import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import auth from "../assets/configs/firebase.config.js";
import LoadingAnimation from "../components/shared/LoadingAnimation.jsx";
import axios from "axios";

const AuthContextInstance = createContext(null);

export const useAuth = () => useContext(AuthContextInstance);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  // Configure axios for cookies
  axios.defaults.withCredentials = true;

  // Create user
  const createUser = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Set HTTP-only cookie after registration
    await setAuthCookie(result.user);

    return result;
  };

  // Sign in
  const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // ✅ Set HTTP-only cookie after login
    await setAuthCookie(result.user);

    return result;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    // Set HTTP-only cookie after Google login
    await setAuthCookie(result.user);

    return result;
  };

  // Set HTTP-only cookie function
  const setAuthCookie = async (user) => {
    try {
      const idToken = await user.getIdToken();

      await axios.post("https://a11-autovoyage.vercel.app/auth/login", {
        idToken: idToken,
      });
    } catch (error) {
      console.error("❌ Failed to set auth cookie:", error);
    }
  };

  // Clear HTTP-only cookie function
  const clearAuthCookie = async () => {
    try {
      await axios.post("https://a11-autovoyage.vercel.app/auth/logout");
    } catch (error) {
      console.error("Failed to clear auth cookie:", error);
    }
  };

  // Log out
  const logout = async () => {
    try {
      // Clear HTTP-only cookie first
      await clearAuthCookie();

      // Then sign out from Firebase
      return await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  // Password Reset
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Observer for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ensure cookie is set when user is detected
        await setAuthCookie(user);
      } else {
        // Clear cookie when user logs out
        await clearAuthCookie();
      }

      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
    resetPassword,
  };

  return (
    <AuthContextInstance.Provider value={value}>
      {loading ? <LoadingAnimation /> : children}
    </AuthContextInstance.Provider>
  );
};

export default AuthProvider;
