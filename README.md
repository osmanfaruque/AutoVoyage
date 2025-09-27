# AutoVoyage : Unlock Your Ride 🚗

**Your Premier Car Rental Platform**

## 🌐 Live Demo
- **Client:** [https://autovoyage-a11.web.app](https://autovoyage-a11.web.app)
- **Server:** [https://a11-autovoyage.vercel.app](https://a11-autovoyage.vercel.app)

## 📋 Project Overview

AutoVoyage is a comprehensive car rental platform that enables seamless car bookings, user authentication, and efficient management of car inventory. This frontend application provides a responsive and intuitive interface for all car rental operations, from browsing available cars to managing personal bookings.

## 🎯 Purpose

This platform serves as the complete solution for car rental needs, allowing users to:
- **Browse & Search** - Explore available cars with advanced filtering
- **Secure Booking** - Reserve cars with real-time availability updates  
- **Manage Listings** - Add, update, and delete personal car listings
- **Track Bookings** - Monitor all rental activities in one place

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- **Firebase Authentication** - Email/Password & Google Sign-In
- **JWT Token Management** - HTTP-only cookie implementation
- **Private Route Protection** - Secure access to sensitive pages
- **Session Persistence** - Maintain login state on page reload

### 🚗 **Car Management**
- **Dynamic Car Display** - Grid and list view options
- **Advanced Search & Filtering** - By model, location, features
- **Real-time Sorting** - Date, price, popularity
- **CRUD Operations** - Full car listing management
- **Availability Toggle** - Instant status updates

### 📅 **Booking System**
- **Seamless Booking Process** - Intuitive confirmation flow
- **My Bookings Dashboard** - View, modify, cancel bookings
- **Booking Status Tracking** - Real-time status updates
- **Incremental Updates** - MongoDB $inc operator implementation

### 🎨 **User Experience**
- **Fully Responsive Design** - Mobile, tablet, desktop optimized
- **Theme Toggle** - Light/Dark mode support
- **Interactive Animations** - Lottie animations & smooth transitions
- **Toast Notifications** - Real-time user feedback
- **Loading States** - Enhanced user experience during operations

### 🔧 **Technical Features**
- **Environment Security** - Protected Firebase & MongoDB credentials
- **Error Handling** - Comprehensive error management
- **Data Visualization** - Chart.js integration (optional)
- **Modern React Patterns** - Hooks, Context API, Custom hooks

---

## 🛠️ Technology Stack

### **Frontend**
```json
{
  "core": ["React 19", "React Router 7", "JavaScript ES6+"],
  "styling": ["Tailwind CSS 4.1", "DaisyUI 5.0", "CSS3"],
  "authentication": ["Firebase 11.9", "JWT"],
  "animations": ["Lottie React", "Framer Motion", "Swiper"],
  "notifications": ["React Toastify", "SweetAlert2"],
  "icons": ["React Icons"],
  "build": ["Vite 6.3", "ESLint"]
}
```

### **Backend**
```json
{
  "runtime": ["Node.js", "Express.js 5.1"],
  "database": ["MongoDB Atlas", "Mongoose 8.16"],
  "authentication": ["Firebase Admin SDK 13.4"],
  "security": ["CORS 2.8", "Cookie Parser 1.4"],
  "environment": ["dotenv 16.5"]
}
```

---

## 📦 Package Dependencies

### **Client-side Dependencies**
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0", 
  "react-router": "^7.6.2",
  "firebase": "^11.9.1",
  "tailwindcss": "^4.1.10",
  "daisyui": "^5.0.43",
  "axios": "^1.11.0",
  "framer-motion": "^12.18.1",
  "lottie-react": "^2.4.1",
  "react-toastify": "^11.0.5",
  "sweetalert2": "^11.22.2",
  "swiper": "^11.2.8",
  "react-icons": "^5.5.0"
}
```

### **Server-side Dependencies**
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.16.0",
  "mongodb": "^6.17.0",
  "firebase-admin": "^13.4.0",
  "cors": "^2.8.5",
  "cookie-parser": "^1.4.6",
  "dotenv": "^16.5.0"
}
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project

### **1. Clone Repository**
```bash
# Frontend
git clone [Will Be Published Later]
cd client-a11
npm install

# Backend  
git clone [Will Be Published Later]
cd server-a11
npm install
```

### **2. Environment Variables**

**Frontend (.env)**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend (.env)**
```env
MONGO_URI=your_mongodb_connection_string
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
PORT=5000
```

### **3. Run Development Servers**
```bash
# Frontend
npm run dev

# Backend
npm start
```

---

## 📱 Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage with banner, features, recent listings |
| `/available-cars` | Public | Browse all available cars with filters |
| `/car/:id` | Public | Detailed car information & booking |
| `/login` | Public | User authentication |
| `/register` | Public | User registration |
| `/add-car` | Private | Add new car listing |
| `/my-cars` | Private | Manage personal car listings |
| `/my-bookings` | Private | View and manage bookings |
| `/update-car/:id` | Private | Edit car details |

---

## 🎨 UI/UX Features

### **Homepage Sections**
- **🎬 Hero Banner** - Swiper slideshow with motivational content
- **🚗 Recent Listings** - Latest 6 cars with hover effects
- **✨ Why Choose Us** - 6 feature highlights with animations
- **📞 Contact Section** - Interactive contact form

### **Design Elements**
- **🎨 Color Themes** - Professional light/dark mode
- **📱 Responsive Grid** - Adaptive layouts for all devices
- **🎭 Micro-interactions** - Smooth hover effects and transitions
- **🔔 Smart Notifications** - Context-aware toast messages

---

## 🔒 Security Implementation

### **Authentication Flow**
1. **Firebase Auth** - Secure user authentication
2. **JWT Tokens** - HTTP-only cookie storage
3. **Token Verification** - Server-side middleware validation
4. **Protected Routes** - Client-side route protection
5. **Session Management** - Automatic token refresh

### **Data Security**
- **Input Validation** - Client and server-side validation
- **CORS Configuration** - Restricted origin access
- **Environment Variables** - Secure credential storage
- **Error Handling** - No sensitive data exposure

---

## 📊 Database Schema

### **Cars Collection**
```javascript
{
  _id: ObjectId,
  model: String,
  dailyRentalPrice: Number,
  availability: Boolean,
  vehicleRegistrationNumber: String,
  features: String,
  description: String,
  imageUrl: String,
  location: String,
  ownerEmail: String,
  ownerName: String,
  datePosted: Date,
  bookingCount: Number
}
```

### **Bookings Collection**  
```javascript
{
  _id: ObjectId,
  carId: ObjectId,
  carModel: String,
  carOwner: String,
  carOwnerEmail: String,
  renterEmail: String,
  renterName: String,
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  totalCost: Number,
  bookingDate: Date,
  status: String // 'pending', 'confirmed', 'cancelled'
}
```

---

## 🚀 Deployment

### **Frontend Deployment (Firebase Hosting)**
```bash
npm run build
firebase deploy
```

### **Backend Deployment (Vercel)**
```bash
# Automatic deployment on git push
# Configure environment variables in Vercel dashboard
```

### **Environment Setup**
- **Development:** Local development with hot reload
- **Production:** Optimized builds with environment-specific configs

---

## 👨‍💻 Developer Information

**Developer:** Osman Faruque  
**Contact:** [osmanfaruque](#)  
**Project Type:** Full-Stack Car Rental Platform  
**Development Period:** 2025  
**Last Updated:** July 28, 2025

---

## 📈 Future Enhancements

- [ ] **Payment Integration** - Stripe/PayPal payment processing
- [ ] **Real-time Chat** - Socket.io customer support
- [ ] **Mobile App** - React Native implementation  
- [ ] **Advanced Analytics** - Detailed booking insights
- [ ] **Notification System** - Email/SMS alerts
- [ ] **Multi-language Support** - i18n implementation

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- **Firebase** - Authentication and hosting services
- **MongoDB Atlas** - Database hosting
- **Vercel** - Backend deployment platform
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

**Made with ❤️ by [Osman Faruque](https://github.com/osmanfaruque)**

</div>