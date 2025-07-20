import React, { useState } from 'react';
import type { ClinicInfo } from '../types';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from './IconComponents';

interface ClinicInfoModalProps {
  currentInfo: ClinicInfo;
  onClose: () => void;
  onSave: (newInfo: ClinicInfo) => void;
  onImport: (fileContent: string) => void;
  onExport: () => void;
}

const ClinicInfoModal: React.FC<ClinicInfoModalProps> = ({ currentInfo, onClose, onSave, onImport, onExport }) => {
  const [name, setName] = useState(currentInfo.name);
  const [address, setAddress] = useState(currentInfo.address);
  const [logo, setLogo] = useState<string | null>(currentInfo.logo);
  const [error, setError] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setError("Logo image must be smaller than 2MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        setError('');
      };
      reader.onerror = () => {
        setError("Failed to read the logo file.");
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      setError('Clinic Name and Address are required.');
      return;
    }
    onSave({ name, address, logo });
  };
  
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result;
        if (typeof fileContent === 'string') {
          onImport(fileContent);
        } else {
          setError("Failed to read the import file.");
        }
      };
      reader.onerror = () => {
          setError("Failed to read the import file.");
      };
      reader.readAsText(file);
    }
    // Reset file input value to allow re-importing the same file
    if(e.target) e.target.value = '';
  };


  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      aria-labelledby="clinic-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 transform transition-all flex flex-col max-h-[90vh]">
        <h2 id="clinic-modal-title" className="text-2xl font-bold text-gray-800 mb-4 flex-shrink-0">Clinic Settings</h2>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm flex-shrink-0">{error}</p>}
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
            <form id="clinic-settings-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="clinic-name" className="block text-sm font-medium text-gray-700">Clinic Name</label>
                <input 
                  type="text" 
                  id="clinic-name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="clinic-address" className="block text-sm font-medium text-gray-700">Clinic Address</label>
                <textarea
                  id="clinic-address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Clinic Logo</label>
                <div className="mt-2 flex items-center space-x-4">
                    {logo && <img src={logo} alt="Logo Preview" className="h-16 w-16 rounded-full object-cover bg-gray-100" />}
                    <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        <span>{logo ? 'Change' : 'Upload'} Logo</span>
                        <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleLogoChange}/>
                    </label>
                    {logo && (
                        <button type="button" onClick={() => setLogo(null)} className="text-sm text-red-600 hover:text-red-800">
                            Remove Logo
                        </button>
                    )}
                </div>
              </div>
            </form>

            <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Data Management</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <label htmlFor="import-data-input" className="w-full flex-1 cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                        Import Data
                    </label>
                    <input id="import-data-input" type="file" className="sr-only" accept=".json" onChange={handleFileImport} />
                    <button
                      type="button"
                      onClick={onExport}
                      className="w-full flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Export Data
                    </button>
                </div>
                 <p className="text-xs text-gray-500 mt-2">Save all patients, procedures, and clinic settings to a file, or load them from a backup.</p>
            </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t mt-4 flex-shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="clinic-settings-form"
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfoModal;
