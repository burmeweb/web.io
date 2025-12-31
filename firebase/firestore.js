// firebase/firestore.js
import { 
  db 
} from './config.js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot
} from "firebase/firestore";

// Users Collection
export const usersRef = collection(db, "users");

// Get user by ID
export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

// Update user status
export const updateUserStatus = async (userId, isOnline) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      isOnline,
      lastSeen: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};

// Chats Collection
export const chatsRef = collection(db, "chats");

// Create or get chat between two users
export const getOrCreateChat = async (userId1, userId2) => {
  try {
    // Create sorted ID for consistency
    const chatId = [userId1, userId2].sort().join('_');
    
    const chatDoc = await getDoc(doc(db, "chats", chatId));
    
    if (!chatDoc.exists()) {
      // Create new chat
      await setDoc(doc(db, "chats", chatId), {
        id: chatId,
        participants: [userId1, userId2],
        lastMessage: "",
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Create messages subcollection
      await setDoc(doc(db, "chats", chatId, "metadata", "info"), {
        createdBy: userId1,
        createdAt: serverTimestamp()
      });
    }
    
    return chatId;
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
};

// Send message
export const sendMessage = async (chatId, senderId, content, type = "text") => {
  try {
    const messageId = Date.now().toString();
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    
    await setDoc(messageRef, {
      id: messageId,
      chatId,
      senderId,
      content,
      type,
      timestamp: serverTimestamp(),
      edited: false,
      readBy: [senderId]
    });
    
    // Update chat last message
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: content,
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Groups Collection
export const groupsRef = collection(db, "groups");

// Create new group
export const createGroup = async (name, ownerId, members = [], isPublic = false) => {
  try {
    const groupId = `group_${Date.now()}`;
    
    await setDoc(doc(db, "groups", groupId), {
      id: groupId,
      name,
      description: "",
      ownerId,
      admins: [ownerId],
      members: [...members, ownerId],
      isPublic,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      settings: {
        allowInvites: true,
        allowMemberPosts: true,
        requireApproval: false
      }
    });
    
    return { success: true, groupId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add member to group
export const addGroupMember = async (groupId, userId, role = "member") => {
  try {
    const groupRef = doc(db, "groups", groupId);
    
    if (role === "admin") {
      await updateDoc(groupRef, {
        admins: arrayUnion(userId),
        members: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(groupRef, {
        members: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove member from group
export const removeGroupMember = async (groupId, userId) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    
    await updateDoc(groupRef, {
      admins: arrayRemove(userId),
      members: arrayRemove(userId),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Voice Chat Rooms
export const voiceRoomsRef = collection(db, "voiceRooms");

// Create voice room
export const createVoiceRoom = async (groupId, name, maxParticipants = 10) => {
  try {
    const roomId = `voice_${Date.now()}`;
    
    await setDoc(doc(db, "voiceRooms", roomId), {
      id: roomId,
      groupId,
      name,
      maxParticipants,
      participants: [],
      isActive: true,
      createdAt: serverTimestamp(),
      hostId: null
    });
    
    return { success: true, roomId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const listenToMessages = (chatId, callback) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "desc"), limit(50));
  
  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages.reverse());
  });
};

export const listenToOnlineUsers = (callback) => {
  const q = query(usersRef, where("isOnline", "==", true));
  
  return onSnapshot(q, (snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    callback(users);
  });
};
