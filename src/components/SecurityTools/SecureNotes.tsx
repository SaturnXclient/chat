import React, { useState, useEffect } from 'react';
import { FileText, Clock, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface SecureNote {
  id: string;
  content: string;
  expiresAt: number;
}

export const SecureNotes: React.FC = () => {
  const [notes, setNotes] = useState<SecureNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [expiration, setExpiration] = useState(5);
  const [showContent, setShowContent] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const now = Date.now();
    const storedNotes = JSON.parse(localStorage.getItem('secureNotes') || '[]');
    const validNotes = storedNotes.filter((note: SecureNote) => note.expiresAt > now);
    setNotes(validNotes);
    localStorage.setItem('secureNotes', JSON.stringify(validNotes));
  }, []);

  const addNote = () => {
    if (!newNote) return;

    const note: SecureNote = {
      id: crypto.randomUUID(),
      content: newNote,
      expiresAt: Date.now() + expiration * 60 * 1000
    };

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem('secureNotes', JSON.stringify(updatedNotes));
    setNewNote('');
    toast.success('Note added with auto-destruct timer!');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('secureNotes', JSON.stringify(updatedNotes));
    toast.success('Note deleted!');
  };

  const toggleVisibility = (id: string) => {
    setShowContent(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatTimeLeft = (expiresAt: number) => {
    const minutes = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000 / 60));
    return `${minutes} minutes`;
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center mb-4">
        <FileText className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Secure Notes</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-cyan-300 mb-2">New Note</label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full bg-gray-900/50 rounded-lg p-3 text-cyan-400 h-24"
            placeholder="Enter your secure note..."
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-cyan-300 mb-2">Auto-destruct Timer</label>
            <select
              value={expiration}
              onChange={(e) => setExpiration(Number(e.target.value))}
              className="w-full bg-gray-900/50 rounded-lg p-2 text-cyan-400"
            >
              <option value={5}>5 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          <button
            onClick={addNote}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6"
          >
            Add Note
          </button>
        </div>

        <div className="space-y-4 mt-6">
          {notes.map(note => (
            <div key={note.id} className="bg-gray-900/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-cyan-300">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Expires in: {formatTimeLeft(note.expiresAt)}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleVisibility(note.id)}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    {showContent[note.id] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className={showContent[note.id] ? '' : 'content-blur'}>
                <p className="text-cyan-400 whitespace-pre-wrap">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};