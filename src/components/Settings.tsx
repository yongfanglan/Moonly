'use client';
interface SettingsProps { darkMode: boolean; setDarkMode: (d: boolean) => void; onLogout: () => void; }
export function Settings({ darkMode, setDarkMode, onLogout }: SettingsProps) {
  return (
    <div className="rounded-2xl border p-8 space-y-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="text-center">
        <p className="text-3xl mb-2">⚙️</p>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--background)' }}>
          <div>
            <p className="font-medium">🌙 Dark Mode</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>Enable dark theme for nighttime</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}
            className="relative w-12 h-6 rounded-full transition-colors" style={{ background: darkMode ? '#7C3AED' : '#D1D5DB' }}>
            <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform" style={{ transform: darkMode ? 'translateX(28px)' : 'translateX(4px)' }} />
          </button>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--background)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">💜 Moonly Pro</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>Unlimited + memory + advanced analysis</p>
            </div>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#7C3AED' }}>$9.9/mo</button>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium px-1">Pro Features</p>
          {['♾️ Unlimited daily messages', '🧠 AI memory — I remember your stories', '📊 Advanced mood analysis', '💬 Priority access to new features'].map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--background)' }}>
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>{f}</span>
            </div>
          ))}
        </div>
        <button onClick={onLogout} className="w-full py-3 rounded-xl font-medium border" style={{ borderColor: 'var(--border)', color: '#EF4444' }}>Logout</button>
      </div>
    </div>
  );
}
