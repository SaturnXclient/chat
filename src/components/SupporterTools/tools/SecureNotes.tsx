import React, { useState, useEffect } from 'react';
import { FileText, Lock, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface SecureNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  expiresAt: number;
}

export const SecureNotes: React.FC = () => {
  const [notes, setNotes] = useState<SecureNote[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showContent, setShowContent] = useState<Record<string, boolean>>({});
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    expiration: 60 // minutes
  });

  useEffect(() => {
    const now = Date.now();
    const storedNotes = JSON.parse(localStorage.getItem('secureNotes') || '[]');
    const validNotes = storedNotes.filter((note: SecureNote) => note.expiresAt > now);
    setNotes(validNotes);
    localStorage.setItem('secureNotes', JSON.stringify(validNotes));

    const interval = setInterval(() => {
      setNotes(prev => prev.filter(note => note.expiresAt > Date.now()));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleAdd = () => {
    if (!newNote.title || !newNote.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const note: SecureNote = {
      id: crypto.randomUUID(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date().toLocaleString(),
      expiresAt: Date.now() + (newNote.expiration * 60 * 1000)
    };

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem('secureNotes', JSON.stringify(updatedNotes));
    setNewNote({ title: '', content: '', expiration: 60 });
    setShowAdd(false);
    toast.success('Note added successfully!');
  };

  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('secureNotes', JSON.stringify(updatedNotes));
    toast.success('Note deleted');
  };

  const getTimeLeft = (expiresAt: number) => {
    const minutes = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000 / 60));
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hours`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-purple-400 mr-2" />
          <h2 className="text-xl font-semibold text-purple-400">Secure Notes</h2>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn btn-primary"
        >
          Add Note
        </button>
      </div>

      {showAdd && (
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Title</label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Note title..."
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Content</label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your secure note..."
              className="w-full h-32"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Auto-destruct Timer
            </label>
            <select
              value={newNote.expiration}
              onChange={(e) => setNewNote(prev => ({ ...prev, expiration: Number(e.target.value) }))}
              className="w-full"
            >
              <option value={60}>1 hour</option>
              <option value={180}>3 hours</option>
              <option value={360}>6 hours</option>
              <option value={720}>12 hours</option>
              <option value={1440}>24 hours</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button onClick={handleAdd} className="btn btn-primary flex-1">
              Save Note
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
        {notes.map(note => (
          <div key={note.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-purple-300">{note.title}</h3>
                <p className="text-sm text-gray-400">
                  Created {note.createdAt} • Expires in {getTimeLeft(note.expiresAt)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowContent(prev => ({ 
                    ...prev, 
                    [note.id]: !prev[note.id] 
                  }))}
                  className="p-2 hover:bg-gray-700 rounded-lg"
                >
                  {showContent[note.id] ? (
                    <EyeOff className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-purple-400" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-2 hover:bg-gray-700 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
            <div className={showContent[note.id] ? '' : 'content-blur'}>
              <p className="text-purple-300 whitespace-pre-wrap">{note.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};