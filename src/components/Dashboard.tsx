import React, { useContext, useState } from 'react';
import { Routes, Route, useNavigate, Path } from 'react-router-dom';
import { Home, CreditCard, DollarSign, Bell, User, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { HomeView, CreateTransactionView, TransactionsView, NotificationsView, ProfileView, SettingsView } from '../views/views';
import { AuthContext } from '../contexts/AuthContext';
import AccountManagement from './AccountManagement';
import StorePurchase from './StorePurchase';

interface Link {
  key: string;
  icon: React.ReactElement;
  label: string;
}


const Dashboard: React.FC = () => {

  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  const authState = authContext?.authState;
  const logout = authContext?.logout;

  const sidebarLinks = [
    { icon: <Home />, label: 'Home', key: 'home' },
    { icon: <CreditCard />, label: 'Accounts', key: 'accounts' },
    { icon: <DollarSign />, label: 'Create Transaction', key: 'create-transaction' },
    { icon: <DollarSign />, label: 'Transactions', key: 'transactions' },
    { icon: <ShoppingBag />, label: 'Store Purchase', key: 'store-purchase' },
    { icon: <Bell />, label: 'Notifications', key: 'notifications' },
    { icon: <User />, label: 'Profile', key: 'profile' },
    { icon: <Settings />, label: 'Settings', key: 'settings' },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(key);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };



  return (
    <div className="flex h-screen bg-gray-100">
    {/* Sidebar */}
    <div className={`bg-primary shadow-md ${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-width duration-300`}>
      <div className="p-4 flex items-center justify-between">
        <h1 className={`text-2xl font-bold text-black-600 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Wylett</h1>
        {/* Hamburger Menu */}
        <button
          className="p-2 flex justify-center items-center"
          onClick={toggleSidebar}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <nav className="mt-6">
        {sidebarLinks.map((link) => (
          <button
            key={link.key}
            className="flex items-center p-4 hover:bg-gray-200"
            onClick={() => handleTabChange(link.key)}
          >
            <span className="material-icons w-6 h-6">{link.icon}</span>
            <span className={`ml-2 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>{link.key}</span>
          </button>
        ))}
      </nav>
    </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="home" element={<HomeView />} />
            <Route path="accounts" element={<AccountManagement />} />
            <Route path="create-transaction" element={<CreateTransactionView />} />
            <Route path="transactions" element={<TransactionsView />} />
            <Route path="store-purchase" element={<StorePurchase />} />
            <Route path="notifications" element={<NotificationsView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;