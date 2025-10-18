'use client';
import { useState } from 'react';
import { X, Eye, EyeOff, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
};

type APIKeys = {
  canvasToken: string;
  canvasUrl: string;
  tavilyApiKey: string;
  openaiApiKey: string;
};

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  userData 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  userData: UserData;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'personal' | 'settings'>('personal');
  const [showKeys, setShowKeys] = useState({
    canvasToken: false,
    canvasUrl: false,
    tavilyApiKey: false,
    openaiApiKey: false,
  });

  const [personalInfo, setPersonalInfo] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    username: userData.username,
    email: userData.email,
    phone: userData.phone,
  });

  const [apiKeys, setApiKeys] = useState<APIKeys>(() => {
    const stored = localStorage.getItem('apiKeys');
    return stored ? JSON.parse(stored) : {
      canvasToken: '',
      canvasUrl: '',
      tavilyApiKey: '',
      openaiApiKey: '',
    };
  });

  const [saved, setSaved] = useState(false);

  const handlePersonalChange = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
    setSaved(false);
  };

  const handleApiKeyChange = (field: keyof APIKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [field]: value
    }));
    setSaved(false);
  };

  const handleSavePersonal = () => {
    localStorage.setItem('userData', JSON.stringify(personalInfo));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveApiKeys = () => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('apiKeys');
    router.push('/');
    onClose();
  };

  const toggleShowKey = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'personal'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'settings'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Connect Services
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={personalInfo.username}
                  onChange={(e) => handlePersonalChange('username', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <button
                onClick={handleSavePersonal}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>

              {saved && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
                  ✓ Changes saved successfully
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 mb-6">
                <p className="text-slate-300 text-sm">
                  Connect your external services to enhance Nora's capabilities. Your API keys are stored securely in your browser.
                </p>
              </div>

              {/* Canvas Token */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Canvas Token
                </label>
                <div className="relative">
                  <input
                    type={showKeys.canvasToken ? 'text' : 'password'}
                    value={apiKeys.canvasToken}
                    onChange={(e) => handleApiKeyChange('canvasToken', e.target.value)}
                    placeholder="Enter your Canvas token"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <button
                    onClick={() => toggleShowKey('canvasToken')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
                  >
                    {showKeys.canvasToken ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Canvas URL */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Canvas URL
                </label>
                <div className="relative">
                  <input
                    type={showKeys.canvasUrl ? 'text' : 'password'}
                    value={apiKeys.canvasUrl}
                    onChange={(e) => handleApiKeyChange('canvasUrl', e.target.value)}
                    placeholder="Enter your Canvas URL"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <button
                    onClick={() => toggleShowKey('canvasUrl')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
                  >
                    {showKeys.canvasUrl ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Tavily API Key */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Tavily API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.tavilyApiKey ? 'text' : 'password'}
                    value={apiKeys.tavilyApiKey}
                    onChange={(e) => handleApiKeyChange('tavilyApiKey', e.target.value)}
                    placeholder="Enter your Tavily API key"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <button
                    onClick={() => toggleShowKey('tavilyApiKey')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
                  >
                    {showKeys.tavilyApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* OpenAI API Key */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  OpenAI API Key (DEMO)
                </label>
                <div className="relative">
                  <input
                    type={showKeys.openaiApiKey ? 'text' : 'password'}
                    value={apiKeys.openaiApiKey}
                    onChange={(e) => handleApiKeyChange('openaiApiKey', e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <button
                    onClick={() => toggleShowKey('openaiApiKey')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
                  >
                    {showKeys.openaiApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveApiKeys}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save API Keys
              </button>

              {saved && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
                  ✓ API keys saved successfully
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Sign Out */}
        <div className="border-t border-slate-700 p-6 bg-slate-700/20">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}