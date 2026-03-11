'use client';

import Link from 'next/link';
import { Moon, Sun, User } from 'lucide-react';
import { useDarkMode } from '@/lib/useDarkMode';

interface NavbarProps {
  user?: { name?: string; avatar_url?: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { theme, toggleTheme, mounted } = useDarkMode();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="font-mono text-2xl font-bold bg-gradient-to-r from-hn-orange-500 to-hn-orange-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              HN
            </div>
            <div className="font-sans text-xl font-semibold text-gray-900 dark:text-gray-100">
              Modern
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/">Trending</NavLink>
            <NavLink href="/?category=AI">AI</NavLink>
            <NavLink href="/?category=Programming">Programming</NavLink>
            <NavLink href="/?category=Startups">Startups</NavLink>
            <NavLink href="/bookmarks">Bookmarks</NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}

            {/* User menu */}
            {user ? (
              <Link 
                href="/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name || 'User'} 
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {user.name || 'Profile'}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-hn-orange-500 hover:bg-hn-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {children}
    </Link>
  );
}
