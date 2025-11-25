'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err) {
      setError('Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Welcome section */}
          <div className="md:w-1/2 p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">Welcome to Assignment Portal</h1>
              <p className="text-purple-100 leading-relaxed">
                Streamline your academic workflow with our comprehensive assignment submission and grading platform. 
                Connect with your instructors and track your progress effortlessly.
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-2 h-20 bg-gradient-to-b from-pink-400 to-orange-400 rounded-full transform -rotate-45 opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-24 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full transform rotate-45 opacity-60"></div>
            <div className="absolute bottom-1/3 left-1/3 w-16 h-16 border-4 border-orange-400 rounded-full opacity-40"></div>
          </div>

          {/* Right side - Login form */}
          <div className="md:w-1/2 bg-white p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-purple-600 mb-2 text-center">USER LOGIN</h2>
              <div className="w-16 h-1 bg-purple-600 mx-auto mb-8"></div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full pl-12 pr-4 py-3 border-2 border-purple-100 rounded-lg focus:outline-none focus:border-purple-400 transition-colors text-gray-700 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-3 border-2 border-purple-100 rounded-lg focus:outline-none focus:border-purple-400 transition-colors text-gray-700 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-600 cursor-pointer">
                    <input type="checkbox" className="mr-2 w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                    Remember me
                  </label>
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  LOGIN
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
