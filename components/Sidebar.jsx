'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ user }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: '📊' },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/assignments', label: 'Assignments', icon: '📝' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 min-h-screen text-white flex flex-col">
      {/* User Profile */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-xs text-gray-400 capitalize">
              <span className="text-green-400 mr-1">●</span>
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-3">General</p>
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-gray-400 text-center">Assignment Portal v1.0</p>
      </div>
    </div>
  );
}
