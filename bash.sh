# Create project folder
mkdir insightful-ai-social
cd insightful-ai-social

# Initialize React project with Vite
npm create vite@latest . --template react

# Install main dependencies
npm install three @react-three/fiber @react-three/drei
npm install firebase react-router-dom zustand tailwindcss
npm install lucide-react date-fns react-dropzone emoji-picker-react
npm install @headlessui/react socket.io-client

# Install dev dependencies
npm install -D autoprefixer postcss

# Initialize Tailwind
npx tailwindcss init -p
