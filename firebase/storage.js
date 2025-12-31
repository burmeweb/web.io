import { 
  storage 
} from './config.js';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable
} from "firebase/storage";

// Upload with progress
export const uploadFile = async (path, file, onProgress) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url: downloadURL, ref: uploadTask.snapshot.ref });
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  const fileExt = file.name.split('.').pop();
  const path = `users/${userId}/profile.${fileExt}`;
  
  try {
    const result = await uploadFile(path, file);
    return { success: true, url: result.url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload chat media
export const uploadChatMedia = async (chatId, file, userId) => {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}_${userId}.${fileExt}`;
  const path = `chats/${chatId}/${fileName}`;
  
  try {
    const result = await uploadFile(path, file);
    return { 
      success: true, 
      url: result.url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      timestamp
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete file
export const deleteFile = async (url) => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
