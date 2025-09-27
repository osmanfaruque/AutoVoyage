require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Firebase Admin SDK er Service Account
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration for cookies
app.use(
  cors({
    origin: ["https://localhost:5173","http://localhost:5173", "https://autovoyage-a11.web.app", "https://autovoyage-a11.firebaseapp.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// JWT Verification Middleware
const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check for token in HTTP-only cookie first, then Authorization header
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No valid authorization token provided",
      });
    }

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

// Login endpoint
app.post("/auth/login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: "ID token is required",
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Set HTTP-only cookie
    res.cookie("authToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
});
// Logout endpoint
app.post("/auth/logout", (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
});
// Check authentication status endpoint
app.get("/auth/me", verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {

    // declare database and collections
    const database = client.db("car-rental");
    const carsCollection = database.collection("cars");
    const bookingsCollection = database.collection("bookings");

    // ===========================================
    // CARS ER API ENDPOINTS
    // ===========================================

    // GET all cars endpoint
    app.get("/cars", async (req, res) => {
      try {
        const { search, sort, order } = req.query;
        let query = {};
        //this is Searching function for the cars
        if (search && search.trim()) {
          query.$or = [
            { model: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { features: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { ownerName: { $regex: search, $options: "i" } },
          ];
        }
        // after sorting, creating object that result found after sorting
        let sortObject = {};
        if (sort) {
          const sortOrder = order === "asc" ? 1 : -1;

          if (sort === "datePosted") {
            sortObject.datePosted = sortOrder;
          } else if (sort === "dailyRentalPrice") {
            sortObject.dailyRentalPrice = sortOrder;
          } else if (sort === "model") {
            sortObject.model = sortOrder;
          }
        } else {
          // Default sort by datePosted descending (newest first)
          sortObject.datePosted = -1;
        }
        const cars = await carsCollection
          .find(query)
          .sort(sortObject)
          .toArray();
        res.json(cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).json({ error: error.message });
      }
    });
    // POST add new car endpoint
    app.post("/cars", verifyToken, async (req, res) => {
      try {
        const carData = {
          ...req.body,
          ownerEmail: req.user.email,
          datePosted: new Date(),
          bookingCount: 0,
        };

        const result = await carsCollection.insertOne(carData);
        res.json({
          success: true,
          insertedId: result.insertedId,
          message: "Car added successfully!",
        });
      } catch (error) {
        console.error("Error adding car:", error);
        res.status(500).json({ error: error.message });
      }
    });
    // GET single car by id
    app.get("/cars/:id", async (req, res) => {
      try {
        const car = await carsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!car) {
          return res.status(404).json({ error: "Car not found" });
        }

        res.json(car);
      } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({ error: error.message });
      }
    });
    // PUT update car
    app.put("/cars/:id", verifyToken, async (req, res) => {
      try {
        // First check if car exists and belongs to user
        const existingCar = await carsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!existingCar) {
          return res.status(404).json({ error: "Car not found" });
        }

        if (existingCar.ownerEmail !== req.user.email) {
          return res.status(403).json({
            error: "Unauthorized: You can only update your own cars",
          });
        }

        const filter = { _id: new ObjectId(req.params.id) };
        const updateDoc = {
          $set: {
            ...req.body,
            updatedAt: new Date(),
          },
        };

        const result = await carsCollection.updateOne(filter, updateDoc);

        res.json({
          success: true,
          modifiedCount: result.modifiedCount,
          message: "Car updated successfully!",
        });
      } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).json({ error: error.message });
      }
    });
    // DELETE car endpoint
    app.delete("/cars/:id", verifyToken, async (req, res) => {
      try {
        // First check if car exists and belongs to user
        const existingCar = await carsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!existingCar) {
          return res.status(404).json({ error: "Car not found" });
        }

        if (existingCar.ownerEmail !== req.user.email) {
          return res.status(403).json({
            error: "Unauthorized: You can only delete your own cars",
          });
        }

        const result = await carsCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        res.json({
          success: true,
          deletedCount: result.deletedCount,
          message: "Car deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // ===========================================
    // BOOKINGS ER API ENDPOINTS
    // ===========================================

    // GET all bookings
    app.get("/bookings", verifyToken, async (req, res) => {
      try {
        const { sort, order } = req.query;
        let query = { renterEmail: req.user.email };
        let sortObject = {};
        if (sort) {
          const sortOrder = order === "asc" ? 1 : -1;
          sortObject[sort] = sortOrder;
        } else {
          sortObject.bookingDate = -1; // Default newest first
        }

        const bookings = await bookingsCollection
          .find(query)
          .sort(sortObject)
          .toArray();

        const bookingsWithCarDetails = await Promise.all(
          bookings.map(async (booking) => {
            try {
              const car = await carsCollection.findOne({
                _id: new ObjectId(booking.carId),
              });

              return {
                ...booking,
                carImageUrl: car ? car.imageUrl : null,
              };
            } catch (error) {
              console.error(
                "Error fetching car details for booking:",
                booking._id
              );
              return {
                ...booking,
                carImageUrl: null,
              };
            }
          })
        );
        res.json(bookingsWithCarDetails);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: error.message });
      }
    });
    // POST add new booking
    app.post("/bookings", verifyToken, async (req, res) => {
      try {
        const bookingData = {
          ...req.body,
          renterEmail: req.user.email,
          bookingDate: new Date(),
        };

        const result = await bookingsCollection.insertOne(bookingData);
        await carsCollection.updateOne(
          { _id: new ObjectId(req.body.carId) },
          { $inc: { bookingCount: 1 } }
        );
        res.json({
          success: true,
          insertedId: result.insertedId,
          message: "Booking created successfully!",
        });
      } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: error.message });
      }
    });
    // PUT update booking
    app.put("/bookings/:id", verifyToken, async (req, res) => {
      try {
        const existingBooking = await bookingsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!existingBooking) {
          return res.status(404).json({ error: "Booking not found" });
        }

        if (existingBooking.renterEmail !== req.user.email) {
          return res.status(403).json({
            error: "Unauthorized: You can only update your own bookings",
          });
        }

        const filter = { _id: new ObjectId(req.params.id) };
        const updateDoc = {
          $set: {
            ...req.body,
            updatedAt: new Date(),
          },
        };

        const result = await bookingsCollection.updateOne(filter, updateDoc);

        res.json({
          success: true,
          modifiedCount: result.modifiedCount,
          message: "Booking updated successfully!",
        });
      } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ error: error.message });
      }
    });
    // DELETE booking
    app.delete("/bookings/:id", verifyToken, async (req, res) => {
      try {
        const existingBooking = await bookingsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!existingBooking) {
          return res.status(404).json({ error: "Booking not found" });
        }

        if (existingBooking.renterEmail !== req.user.email) {
          return res.status(403).json({
            error: "Unauthorized: You can only delete your own bookings",
          });
        }
        const result = await bookingsCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        await carsCollection.updateOne(
          { _id: new ObjectId(existingBooking.carId) },
          { $inc: { bookingCount: -1 } }
        );
        res.json({
          success: true,
          deletedCount: result.deletedCount,
          message: "Booking deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: error.message });
      }
    });
    // Check if user has active booking for this car
    app.get("/bookings/check/:carId/:userEmail",verifyToken,async (req, res) => {
        try {
          const { carId, userEmail } = req.params;

          // Security: Only allow user to check their own bookings
          if (userEmail !== req.user.email) {
            return res.status(403).json({
              error: "Unauthorized: You can only check your own bookings",
            });
          }

          // Check for active bookings (pending or confirmed)
          const activeBooking = await bookingsCollection.findOne({
            carId: carId,
            renterEmail: userEmail,
            status: { $in: ["pending", "confirmed"] },
          });

          res.json({
            hasActiveBooking: !!activeBooking,
            booking: activeBooking || null,
          });
        } catch (error) {
          console.error("Error checking user booking:", error);
          res.status(500).json({ error: error.message });
        }
      }
    );
    // POST booking with duplicate check
    app.post("/bookings", verifyToken, async (req, res) => {
      try {
        // Check if user already has active booking for this car
        const existingBooking = await bookingsCollection.findOne({
          carId: req.body.carId,
          renterEmail: req.user.email,
          status: { $in: ["pending", "confirmed"] },
        });

        if (existingBooking) {
          return res.status(409).json({
            success: false,
            error: "You already have an active booking for this car",
          });
        }

        const bookingData = {
          ...req.body,
          renterEmail: req.user.email,
          bookingDate: new Date(),
        };

        const result = await bookingsCollection.insertOne(bookingData);

        // Increment booking count using $inc operator
        await carsCollection.updateOne(
          { _id: new ObjectId(req.body.carId) },
          { $inc: { bookingCount: 1 } }
        );

        res.json({
          success: true,
          insertedId: result.insertedId,
          message: "Booking created successfully!",
        });
      } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: error.message });
      }
    });

  } catch (error) {
    console.error(" MongoDB connection error:", error);
  } finally {
  }
}

app.get("/", (req, res) => {
  res.send(`AutoVoyage Server Running at ${port}`);
});

app.listen(port, () => {});
run().catch(console.dir);
