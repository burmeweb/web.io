import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Theme
  theme: 'light',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
  
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Mobile menu
  mobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  
  // Modals
  activeModal: null,
  modalData: null,
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  
  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { id, ...toast };
    
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 5000);
    
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  },
  
  // Loading states
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  // Current page
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Initialize theme from localStorage
  initTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    set({ theme: savedTheme });
  }
}));
