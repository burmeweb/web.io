// firebase/auth.js
import { 
  auth,
  db,
  storage
} from './config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";

// Create new user with email/password
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, { displayName });
    
    // Send verification email
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: displayName,
      email: email,
      photoURL: "",
      bio: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isOnline: true,
      lastSeen: serverTimestamp(),
      privacy: {
        profileVisible: true,
        searchable: true,
        showOnlineStatus: true
      },
      settings: {
        theme: "light",
        notifications: true,
        twoFactorEnabled: false
      }
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with email/password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update user status to online
    await updateDoc(doc(db, "users", userCredential.user.uid), {
      isOnline: true,
      lastSeen: serverTimestamp()
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        bio: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isOnline: true,
        lastSeen: serverTimestamp(),
        privacy: {
          profileVisible: true,
          searchable: true,
          showOnlineStatus: true
        },
        settings: {
          theme: "light",
          notifications: true,
          twoFactorEnabled: false
        }
      });
    } else {
      // Update existing user status
      await updateDoc(doc(db, "users", user.uid), {
        isOnline: true,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL
      });
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const logout = async () => {
  try {
    if (auth.currentUser) {
      // Update user status to offline
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        isOnline: false,
        lastSeen: serverTimestamp()
      });
    }
    
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    
    // Update in Firebase Auth
    if (updates.displayName || updates.photoURL) {
      await updateProfile(user, {
        displayName: updates.displayName || user.displayName,
        photoURL: updates.photoURL || user.photoURL
      });
    }
    
    // Update in Firestore
    await updateDoc(doc(db, "users", user.uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Auth state listener
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
