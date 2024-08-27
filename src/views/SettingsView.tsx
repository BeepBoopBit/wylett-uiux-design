import React, { useState, ChangeEvent } from 'react';
import { Bell, Globe, Shield } from 'lucide-react';

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  darkMode: boolean;
  language: string;
  twoFactor: boolean;
}

function SettingsView() {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    darkMode: JSON.parse(localStorage.getItem('darkMode') || 'false'),
    language: 'en',
    twoFactor: false,
  });

  const handleDarkModeChange = () => {
    const newDarkMode = !settings.darkMode;
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    setSettings((prevSettings) => ({
      ...prevSettings,
      darkMode: !prevSettings.darkMode,
    }));
  };

  const handleNotificationChange = (type: 'email' | 'push' | 'sms') => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      notifications: {
        ...prevSettings.notifications,
        [type]: !prevSettings.notifications[type],
      },
    }));
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      language: e.target.value,
    }));
  };

  const handleTwoFactorChange = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      twoFactor: !prevSettings.twoFactor,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Bell className="mr-2" size={20} /> Notification Settings
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 capitalize">{key} Notifications</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <button
                    onClick={() => handleNotificationChange(key as 'email' | 'push' | 'sms')}
                    className={`${value ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${value ? 'translate-x-5' : 'translate-x-0'
                        } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    />
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500 capitalize">Dark Mode</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <button
              onClick={handleDarkModeChange}
              className={`${settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <span
                aria-hidden="true"
                className={`${settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </dd>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;