import React, { useState, useCallback } from 'react';
import type { Patient, Procedure, ClinicInfo } from '../types';
import AddProcedureForm from './AddProcedureForm';
import { PlusIcon, DocumentTextIcon, PencilIcon, PhotographIcon } from './IconComponents';
import { generateProcedureImage } from '../services/geminiService';
import Spinner from './Spinner';


interface PatientDetailProps {
  patient: Patient;
  clinicInfo: ClinicInfo;
  onAddProcedure: (patientId: string, newProcedure: Omit<Procedure, 'id' | 'date'>) => void;
  onUpdateProcedure: (patientId: string, procedureId: string, updatedData: Partial<Procedure>) => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, clinicInfo, onAddProcedure, onUpdateProcedure }) => {
  const [editingProc, setEditingProc] = useState<{id: string; date: string} | null>(null);
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const totalBilled = patient.procedures.reduce((sum, proc) => sum + proc.cost, 0);

  const handleAddProcedure = (newProcedure: Omit<Procedure, 'id' | 'date'>) => {
    onAddProcedure(patient.id, newProcedure);
  };
  
  const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleDateEdit = (proc: Procedure) => {
    setEditingProc({ id: proc.id, date: proc.date });
  };
  
  const handleDateSave = () => {
    if (editingProc) {
        onUpdateProcedure(patient.id, editingProc.id, { date: editingProc.date });
        setEditingProc(null);
    }
  };

  const handleImageGenerate = useCallback(async (proc: Procedure) => {
    if(!window.confirm(`This will use the AI to generate an image for "${proc.name}". Proceed?`)) return;

    setGeneratingImageFor(proc.id);
    setImageError(null);
    try {
        const base64Image = await generateProcedureImage(proc.name);
        onUpdateProcedure(patient.id, proc.id, { imageBase64: base64Image });
    } catch (error: any) {
        setImageError(error.message || "An unknown error occurred.");
    } finally {
        setGeneratingImageFor(null);
    }
  }, [patient.id, onUpdateProcedure]);


  const generateInvoiceHTML = () => {
    const procedureRows = patient.procedures.map(proc => `
      <tr class="border-b">
        <td class="py-2 px-4">${formatDate(proc.date)}</td>
        <td class="py-2 px-4">
          <p class="font-semibold">${proc.name} (${proc.code})</p>
          <p class="text-sm text-gray-600">${proc.description}</p>
        </td>
        <td class="py-2 px-4 text-right">${formatCurrency(proc.cost)}</td>
      </tr>
    `).join('');
    
    const logoHtml = clinicInfo.logo ? `<img src="${clinicInfo.logo}" alt="Clinic Logo" style="max-height: 80px; max-width: 200px;">` : `<h1 class="text-3xl font-bold text-gray-800">${clinicInfo.name}</h1>`;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice for ${patient.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 font-sans">
        <div class="container mx-auto max-w-4xl my-8 p-8 bg-white shadow-lg rounded-lg">
          <header class="flex justify-between items-start pb-6 border-b">
            <div>
              ${logoHtml}
              <p class="text-gray-500 mt-2">${clinicInfo.address.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="text-right">
              <h2 class="text-2xl font-bold text-gray-800">Invoice</h2>
              <p><strong>Invoice #:</strong> INV-${patient.id.slice(-4)}-${Date.now()}</p>
              <p><strong>Date:</strong> ${formatDate(new Date().toISOString())}</p>
            </div>
          </header>
          <section class="my-6">
            <h2 class="text-xl font-semibold mb-2">Bill To:</h2>
            <p>${patient.name}</p>
            <p>${patient.email}</p>
          </section>
          <section>
            <table class="w-full text-left">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-2 px-4 font-semibold">Date</th>
                  <th class="py-2 px-4 font-semibold">Description</th>
                  <th class="py-2 px-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${procedureRows}
              </tbody>
            </table>
          </section>
          <section class="mt-8 text-right">
             <div class="inline-block p-4 bg-gray-100 rounded-lg">
                <p class="text-gray-600 text-lg">Total Amount Due</p>
                <p class="text-3xl font-bold text-teal-600">${formatCurrency(totalBilled)}</p>
             </div>
          </section>
        </div>
      </body>
      </html>
    `;
  };

  const handleGenerateInvoice = () => {
    const invoiceHtml = generateInvoiceHTML();
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(invoiceHtml);
      newWindow.document.close();
    } else {
      alert("Please allow pop-ups to generate the invoice.");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">{patient.name}</h2>
                <p className="text-md text-gray-600">{patient.email}</p>
                <p className="text-sm text-gray-500">DOB: {formatDate(patient.dob)}</p>
            </div>
            <div className="text-right flex flex-col items-end">
                <div>
                  <p className="text-sm text-gray-500">Total Billed</p>
                  <p className="text-2xl font-semibold text-teal-600">{formatCurrency(totalBilled)}</p>
                </div>
                {patient.procedures.length > 0 && (
                  <button onClick={handleGenerateInvoice} className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Generate Invoice
                  </button>
                )}
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Procedures History</h3>
        {imageError && <p className="text-sm text-red-600 mb-4">{imageError}</p>}
        {patient.procedures.length > 0 ? (
          <div className="flow-root">
            <ul role="list" className="-my-4 divide-y divide-gray-200">
              {patient.procedures.map((proc) => (
                <li key={proc.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    {proc.imageBase64 ? (
                        <img src={`data:image/jpeg;base64,${proc.imageBase64}`} alt={proc.name} className="h-16 w-16 bg-gray-100 rounded-md object-cover"/>
                    ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                           {generatingImageFor === proc.id ? <Spinner/> : <PhotographIcon className="h-8 w-8 text-gray-400"/>}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-md font-medium text-gray-900 truncate">{proc.name} <span className="text-sm text-gray-500">({proc.code})</span></p>
                      <p className="text-sm text-gray-600 truncate">{proc.description}</p>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        {editingProc?.id === proc.id ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    type="date" 
                                    value={editingProc.date} 
                                    onChange={(e) => setEditingProc({...editingProc, date: e.target.value})}
                                    className="p-1 text-xs border rounded-md border-gray-300"
                                />
                                <button onClick={handleDateSave} className="px-2 py-1 text-xs font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700">Save</button>
                                <button onClick={() => setEditingProc(null)} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                            </div>
                        ) : (
                            <>
                                <span>{formatDate(proc.date)}</span>
                                <button onClick={() => handleDateEdit(proc)} className="ml-2 text-gray-400 hover:text-teal-600">
                                    <PencilIcon className="h-3 w-3" />
                                </button>
                            </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <p className="text-md font-semibold text-gray-900">{formatCurrency(proc.cost)}</p>
                      <button onClick={() => handleImageGenerate(proc)} disabled={generatingImageFor === proc.id} className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-wait">
                          <PhotographIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
            <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No procedures logged</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new procedure below.</p>
          </div>
        )}
      </div>

      <AddProcedureForm onAddProcedure={handleAddProcedure} />
    </div>
  );
};

export default PatientDetail;
