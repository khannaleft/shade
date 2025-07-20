import React from 'react';
import type { ClinicInfo } from '../types';
import { WalletIcon, CogIcon } from './IconComponents';

interface HeaderProps {
    clinicInfo: ClinicInfo;
    onClinicSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ clinicInfo, onClinicSettingsClick }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             {clinicInfo.logo ? (
                <img src={clinicInfo.logo} alt="Clinic Logo" className="h-9 w-9 rounded-full object-cover" />
            ) : (
                <WalletIcon className="h-8 w-8 text-teal-600" />
            )}
            <h1 className="ml-3 text-2xl font-bold text-gray-800">{clinicInfo.name}</h1>
          </div>
           <button 
            onClick={onClinicSettingsClick}
            className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-teal-600 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            aria-label="Open clinic settings"
        >
            <CogIcon className="h-6 w-6" />
        </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
