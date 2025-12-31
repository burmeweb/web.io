// firebase/storage.js
import { 
  storage 
} from './config.js';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from "firebase/storage";

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload chat file (image, video, document)
export const uploadChatFile = async (chatId, file, senderId) => {
  try {
    const fileId = Date.now().toString();
    const fileExtension = file.name.split('.').pop();
    const storageRef = ref(storage, `chats/${chatId}/${fileId}.${fileExtension}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { 
      success: true, 
      url: downloadURL,
      fileId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload group file
export const uploadGroupFile = async (groupId, file) => {
  try {
    const fileId = Date.now().toString();
    const storageRef = ref(storage, `groups/${groupId}/${fileId}_${file.name}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
