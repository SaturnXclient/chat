import React, { useState, useRef } from 'react';
import { FileKey, Upload, Download, Lock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EncryptedFile {
  id: string;
  name: string;
  size: string;
  encryptedAt: string;
}

export const FileEncryption: React.FC = () => {
  const [files, setFiles] = useState<EncryptedFile[]>([]);
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!password) {
      toast.error('Please enter an encryption password');
      return;
    }

    try {
      // Simulate encryption process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFile: EncryptedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        size: formatFileSize(file.size),
        encryptedAt: new Date().toLocaleString()
      };
      
      setFiles(prev => [...prev, newFile]);
      toast.success('File encrypted successfully!');
    } catch (error) {
      toast.error('Failed to encrypt file');
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast.success('File deleted');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <FileKey className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-purple-400">File Encryption Vault</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Encryption Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            placeholder="Enter encryption password"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary flex items-center justify-center gap-2"
            disabled={!password}
          >
            <Upload className="w-5 h-5" />
            <span>Encrypt New File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-purple-300 mb-4">Encrypted Files</h3>
            <div className="space-y-3">
              {files.map(file => (
                <div key={file.id} className="card flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-purple-300">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {file.size} • Encrypted {file.encryptedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toast.success('File download started')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5 text-purple-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};