import React, { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { useTheme } from '../contexts/ThemeContext'; // Import the theme context
import { 
  UserCircleIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  SunIcon, 
  KeyIcon, 
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PencilIcon,
  CheckCircleIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon
} from '../icons';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>This is the settings page.</p>
    </div>
  );
};

export default SettingsPage;
