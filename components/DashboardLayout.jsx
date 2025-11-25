'use client';

import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {user && (
        <aside className="hidden md:block">
          <Sidebar user={user} />
        </aside>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function Sidebar({ user }) {
  return (
    <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 min-h-screen text-white">
      {/* Sidebar content will be imported from Sidebar component */}
    </div>
  );
}
