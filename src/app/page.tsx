'use client';
import { useState, useEffect } from 'react';
import { MoonlyChat } from '@/components/MoonlyChat';
import { MoodCheckIn } from '@/components/MoodCheckIn';
import { Auth } from '@/components/Auth';
import { Settings } from '@/components/Settings';
import { NavBar } from '@/components/NavBar';

type View = 'chat' | 'mood' | 'settings' | 'auth';

export default function Home() {
  const [view, setView] = useState<View>('chat');
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('moonly_user');
    if (stored) setIsLoggedIn(true);
  }, []);

  const handleLogin = () => { setIsLoggedIn(true); setView('chat'); };
  const handleLogout = () => {
    localStorage.removeItem('moonly_user');
    setIsLoggedIn(false);
    setView('chat');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}
         style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <NavBar view={view} setView={setView} isLoggedIn={isLoggedIn}
              darkMode={darkMode} setDarkMode={setDarkMode}
              onLogout={handleLogout} onLogin={() => setView('auth')} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-2xl">
          {view === 'auth' && <Auth onLogin={handleLogin} onCancel={() => setView('chat')} />}
          {view === 'chat' && <MoonlyChat isLoggedIn={isLoggedIn} isGuest={!isLoggedIn} />}
          {view === 'mood' && <MoodCheckIn onComplete={() => setView('chat')} onExtraMessages={() => {}} />}
          {view === 'settings' && <Settings darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />}
        </div>
      </main>
    </div>
  );
}
