import React from 'react';
import { Trash2 } from 'lucide-react';

export const FileShredder: React.FC = () => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Trash2 className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-purple-400">File Shredder</h2>
      </div>
      <p className="text-purple-300 mb-4">This feature is coming soon! Early supporters will get first access.</p>
    </div>
  );
};