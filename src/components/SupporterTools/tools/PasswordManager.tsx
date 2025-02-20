import React, { useState } from 'react';
import { Key, Plus, Eye, EyeOff, Copy, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  createdAt: string;
}

export const PasswordManager: React.FC = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [newPassword, setNewPassword] = useState({
    title: '',
    username: '',
    password: '',
    website: ''
  });

  const handleAdd = () => {
    if (!newPassword.title || !newPassword.username || !newPassword.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const password: Password = {
      id: crypto.randomUUID(),
      ...newPassword,
      createdAt: new Date().toLocaleString()
    };

    setPasswords(prev => [...prev, password]);
    setNewPassword({ title: '', username: '', password: '', website: '' });
    setShowAdd(false);
    toast.success('Password saved successfully!');
  };

  const handleDelete = (id: string) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
    toast.success('Password deleted');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Key className="w-6 h-6 text-purple-400 mr-2" />
          <h2 className="text-xl font-semibold text-purple-400">Password Manager</h2>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Password</span>
        </button>
      </div>

      {showAdd && (
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Title</label>
            <input
              type="text"
              value={newPassword.title}
              onChange={(e) => setNewPassword(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Gmail Account"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Username</label>
            <input
              type="text"
              value={newPassword.username}
              onChange={(e) => setNewPassword(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username or email"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Password</label>
            <input
              type="password"
              value={newPassword.password}
              onChange={(e) => setNewPassword(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Website (optional)</label>
            <input
              type="url"
              value={newPassword.website}
              onChange={(e) => setNewPassword(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://example.com"
              className="w-full"
            />
          </div>

          <div className="flex gap-4">
            <button onClick={handleAdd} className="btn btn-primary flex-1">
              Save Password
            </button>
            <button 
              onClick={() => setShowAdd(false)} 
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {passwords.map(password => (
          <div key={password.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-purple-300">{password.title}</h3>
                <p className="text-sm text-gray-400">Added {password.createdAt}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-700 rounded-lg">
                  <Edit2 className="w-5 h-5 text-purple-400" />
                </button>
                <button onClick={() => handleDelete(password.id)} className="p-2 hover:bg-gray-700 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Username:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300">{password.username}</span>
                  <button
                    onClick={() => copyToClipboard(password.username, 'Username')}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Copy className="w-4 h-4 text-purple-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Password:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300">
                    {showPassword[password.id] ? password.password : '••••••••'}
                  </span>
                  <button
                    onClick={() => setShowPassword(prev => ({ 
                      ...prev, 
                      [password.id]: !prev[password.id] 
                    }))}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    {showPassword[password.id] ? (
                      <EyeOff className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(password.password, 'Password')}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Copy className="w-4 h-4 text-purple-400" />
                  </button>
                </div>
              </div>
              
              {password.website && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Website:</span>
                  <a
                    href={password.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    {password.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};