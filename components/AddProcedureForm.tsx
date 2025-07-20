
import React, { useState, useCallback } from 'react';
import { generateProcedureSuggestion } from '../services/geminiService';
import type { Procedure } from '../types';
import Spinner from './Spinner';
import { SparklesIcon } from './IconComponents';

interface AddProcedureFormProps {
  onAddProcedure: (procedure: Omit<Procedure, 'id' | 'date'>) => void;
}

const AddProcedureForm: React.FC<AddProcedureFormProps> = ({ onAddProcedure }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [cost, setCost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestion = useCallback(async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a brief description for AI suggestion.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const suggestion = await generateProcedureSuggestion(aiPrompt);
      setName(suggestion.procedureName);
      setDescription(suggestion.description);
      setCode(suggestion.suggestedCode);
      setCost(suggestion.estimatedCost.toString());
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [aiPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !cost) {
      setError('Please fill out all fields before submitting.');
      return;
    }
    onAddProcedure({
      name,
      description,
      code,
      cost: parseFloat(cost) || 0,
    });
    // Reset form
    setAiPrompt('');
    setName('');
    setDescription('');
    setCode('');
    setCost('');
    setError(null);
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Procedure</h3>
      
      <div className="mb-4">
        <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700">
          Describe the procedure (for AI)
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="ai-prompt"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300 focus:ring-teal-500 focus:border-teal-500 sm:text-sm px-3 py-2"
            placeholder="e.g., filling for a front tooth"
          />
          <button
            onClick={handleSuggestion}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-l-0 border-teal-600 bg-teal-600 text-white font-semibold rounded-r-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner size="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
            <span className="ml-2">Suggest</span>
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Procedure Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Billing Code</label>
            <input type="text" id="code" value={code} onChange={e => setCode(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2" required />
          </div>
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost (₹)</label>
            <input type="number" id="cost" value={cost} onChange={e => setCost(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2" required />
          </div>
        </div>
        <div className="text-right">
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add Procedure to Bill
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProcedureForm;
