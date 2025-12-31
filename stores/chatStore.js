import { create } from 'zustand';
import { 
  createChat,
  sendMessage,
  listenToMessages,
  listenToUserChats
} from '../firebase/firestore';

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  unsubscribeMessages: null,
  unsubscribeChats: null,
  
  // Actions
  setChats: (chats) => set({ chats }),
  setCurrentChat: (
