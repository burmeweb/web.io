import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Globe, 
  Bell, 
  Search,
  TrendingUp,
  UserPlus,
  Video,
  Mic
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';
import { useUIStore } from '../../stores/uiStore';
import Button from '../../components/ui/Button';
import VoiceRoom3D from '../../components/threejs/VoiceRoom3D';
import ChatSidebar from '../../components/chat/ChatSidebar';

const Home = () => {
  const { userData } = useAuthStore();
  const { chats } = useChatStore();
  const { addToast } = useUIStore();
  
  const [stats, setStats] = useState({
    friends: 0,
    groups: 0,
    messages: 0,
    online: 0
  });
  
  const [voiceRoomParticipants, setVoiceRoomParticipants] = useState([
    { id: '1', name: 'You', isSpeaking: true, isOnline: true },
    { id: '2', name: 'Alex', isSpeaking: false, isOnline: true },
    { id: '3', name: 'Sam', isSpeaking: true, isOnline: true },
    { id: '4', name: 'Taylor', isSpeaking: false, isOnline: true }
  ]);
  
  useEffect(() => {
    // Simulate voice activity
    const interval = setInterval(() => {
      setVoiceRoomParticipants(prev => 
        prev.map(p => ({
          ...p,
          isSpeaking: Math.random() > 0.7
        }))
      );
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleJoinVoiceChat = () => {
    addToast({
      type: 'info',
      title: 'Voice Chat',
      message: 'Joining voice chat room...'
    });
  };
  
  const quickActions = [
    { icon: <MessageSquare />, label: 'New Chat', color: 'primary' },
    { icon: <Users />, label: 'Create Group', color: 'secondary' },
    { icon: <Video />, label: 'Start Video Call', color: 'success' },
    { icon: <Globe />, label: 'Public Post', color: 'warning' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-950">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-900 shadow-sm border-b border-gray-200 dark:border-secondary-700">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {userData?.displayName || 'User'} 👋
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Here's what's happening with your social network today
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-gray-50 dark:bg-secondary-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search messages, friends..."
                />
              </div>
              
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-800">
                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full"
                  src={userData?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userData?.uid}
                  alt="Profile"
                />
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white dark:ring-secondary-900"></span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Chat list */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700">
              <div className="p-6 border-b border-gray-200 dark:border-secondary-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Chats
                  </h2>
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full dark:bg-primary-900 dark:text-primary-200">
                    {chats.length} Active
                  </span>
                </div>
                
                <div className="mt-4">
                  <ChatSidebar />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-800 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900 mb-2`}>
                        <div className={`text-${action.color}-600 dark:text-${action.color}-400`}>
                          {action.icon}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-secondary-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Friends</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">128</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 dark:text-green-400">+12 this week</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-secondary-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,248</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Today: 42 messages
                </div>
              </div>
              
              <div className="bg-white dark:bg-secondary-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Groups</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">24</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  3 active now
                </div>
              </div>
              
              <div className="bg-white dark:bg-secondary-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                    <UserPlus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Requests</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">8</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Voice Chat Room */}
            <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-secondary-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Active Voice Chat
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Join the conversation with friends
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleJoinVoiceChat}
                    icon={<Mic className="w-4 h-4" />}
                  >
                    Join Voice Chat
                  </Button>
                </div>
              </div>
              
              <VoiceRoom3D
                participants={voiceRoomParticipants}
                style={{ height: '400px' }}
              />
              
              <div className="p-6 bg-gray-50 dark:bg-secondary-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {voiceRoomParticipants.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          className="relative"
                          title={p.name}
                        >
                          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-secondary-600 border-2 border-white dark:border-secondary-800" />
                          {p.isSpeaking && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {voiceRoomParticipants.length} people in voice chat
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Click join to start talking
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center p-4 rounded-lg border border-gray-100 dark:border-secondary-800 hover:bg-gray-50 dark:hover:bg-secondary-800 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          New message from Alex Johnson
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          "Hey, are you joining the meeting today?"
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
