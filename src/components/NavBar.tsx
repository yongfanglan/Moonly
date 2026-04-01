'use client';
interface NavBarProps {
  view: string; setView: (v: string) => void; isLoggedIn: boolean;
  darkMode: boolean; setDarkMode: (d: boolean) => void;
  onLogout: () => void; onLogin: () => void;
}
export function NavBar({ view, setView, isLoggedIn, darkMode, setDarkMode, onLogout, onLogin }: NavBarProps) {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between border-b"
         style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('chat')}>
        <span className="text-2xl">🌙</span>
        <span className="font-semibold text-lg tracking-wide" style={{ color: 'var(--foreground)' }}>Moonly</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => setView('mood')} className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                style={{ background: view === 'mood' ? 'var(--card)' : 'transparent', color: 'var(--foreground)' }}>📝 Mood</button>
        <button onClick={() => setView('settings')} className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                style={{ background: view === 'settings' ? 'var(--card)' : 'transparent', color: 'var(--foreground)' }}>⚙️ Settings</button>
        {isLoggedIn ? (
          <button onClick={onLogout} className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80 ml-1"
                  style={{ color: 'var(--foreground-muted)' }}>Logout</button>
        ) : (
          <button onClick={onLogin} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80 ml-1"
                  style={{ background: '#7C3AED', color: '#fff' }}>Login</button>
        )}
        <button onClick={() => setDarkMode(!darkMode)} className="ml-2 px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-80"
                style={{ background: 'var(--card)', color: 'var(--foreground)' }} aria-label="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
