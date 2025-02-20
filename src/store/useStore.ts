import { create } from 'zustand';
import { KeyPair, generateKeyPair } from '../crypto';
import { anonymousId } from '../pocketbaseClient';

interface User {
  id: string;
  username: string;
  publicKey: string;
  isAnonymous?: boolean;
}

interface Contact {
  id: string;
  username: string;
  publicKey: string;
  lastSeen?: string;
  status?: 'online' | 'offline';
  isAnonymous?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  encryptedContent: string;
  timestamp: string;
}

type Theme = 'cyber' | 'sakura' | 'meme' | 'chill';

interface Store {
  user: User | null;
  keyPair: KeyPair | null;
  contacts: Contact[];
  messages: Message[];
  selectedContact: Contact | null;
  theme: Theme;
  performanceMode: boolean;
  supporterCode: string | null;
  setUser: (user: User | null) => void;
  setKeyPair: (keyPair: KeyPair | null) => void;
  setContacts: (contacts: Contact[]) => void;
  addMessage: (message: Message) => void;
  setSelectedContact: (contact: Contact | null) => void;
  updateContactStatus: (contactId: string, status: 'online' | 'offline') => void;
  initializeAnonymousUser: () => void;
  setTheme: (theme: Theme) => void;
  togglePerformanceMode: () => void;
  clearAllData: () => void;
  setSupporterCode: (code: string | null) => void;
  validateSupporterCode: (code: string) => boolean;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  keyPair: null,
  contacts: [],
  messages: [],
  selectedContact: null,
  theme: 'cyber',
  performanceMode: false,
  supporterCode: localStorage.getItem('supporterCode'),
  setUser: (user) => set({ user }),
  setKeyPair: (keyPair) => set({ keyPair }),
  setContacts: (contacts) => set({ contacts }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setSelectedContact: (contact) => set({ selectedContact: contact }),
  updateContactStatus: (contactId, status) => set((state) => ({
    contacts: state.contacts.map(contact => 
      contact.id === contactId ? { ...contact, status } : contact
    )
  })),
  initializeAnonymousUser: () => {
    const keyPair = generateKeyPair();
    const username = `Anonymous-${anonymousId.substring(0, 6)}`;
    set({
      user: {
        id: anonymousId,
        username,
        publicKey: keyPair.publicKey,
        isAnonymous: true
      },
      keyPair
    });
  },
  setTheme: (theme) => set({ theme }),
  togglePerformanceMode: () => set((state) => ({ 
    performanceMode: !state.performanceMode 
  })),
  clearAllData: () => {
    localStorage.clear();
    sessionStorage.clear();
    set({
      user: null,
      keyPair: null,
      contacts: [],
      messages: [],
      selectedContact: null,
      theme: 'cyber',
      performanceMode: false,
      supporterCode: null
    });
  },
  setSupporterCode: (code) => {
    if (code) {
      localStorage.setItem('supporterCode', code);
    } else {
      localStorage.removeItem('supporterCode');
    }
    set({ supporterCode: code });
  },
  validateSupporterCode: (code) => {
    return code === 'ASA-support-569';
  }
}));