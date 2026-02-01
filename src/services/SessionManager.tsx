import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SessionData {
  sessionId: string;
  preferredLanguage: string;
  userName?: string;
  location?: string;
  lastActivity: Date;
}

interface SessionContextType {
  session: SessionData | null;
  updateSession: (data: Partial<SessionData>) => void;
  clearSession: () => void;
  isSessionActive: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionManager');
  }
  return context;
};

interface SessionManagerProps {
  children: ReactNode;
}

const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const [session, setSession] = useState<SessionData | null>(null);

  // Generate a simple session ID
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('mandiSession');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        // Check if session is still valid (less than 24 hours old)
        const lastActivity = new Date(parsedSession.lastActivity);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setSession({
            ...parsedSession,
            lastActivity: now,
          });
        } else {
          // Session expired, create new one
          createNewSession();
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      localStorage.setItem('mandiSession', JSON.stringify(session));
    }
  }, [session]);

  const createNewSession = () => {
    const newSession: SessionData = {
      sessionId: generateSessionId(),
      preferredLanguage: 'en-IN', // Default to Indian English
      lastActivity: new Date(),
    };
    setSession(newSession);
  };

  const updateSession = (data: Partial<SessionData>) => {
    if (session) {
      setSession({
        ...session,
        ...data,
        lastActivity: new Date(),
      });
    }
  };

  const clearSession = () => {
    localStorage.removeItem('mandiSession');
    createNewSession();
  };

  const isSessionActive = session !== null;

  const contextValue: SessionContextType = {
    session,
    updateSession,
    clearSession,
    isSessionActive,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionManager;