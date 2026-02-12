'use client';

import React, { useState, useEffect } from 'react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth');
      if (res.ok) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    }
  };

  const handleAuth = async (pwd: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        setIsAuthorized(true);
      } else {
        setError('密码错误');
      }
    } catch (err) {
      setError('认证失败');
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <div className="animate-pulse">正在初始化安全连接...</div>
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50/30 p-4">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl shadow-blue-100 border border-blue-50">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">私有网盘访问</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">此仓库受 GitPan 安全保护，请输入访问密码</p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleAuth(password); }}>
          <input
            type="password"
            placeholder="请输入访问密码"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && (
            <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-4 flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 active:scale-[0.98]"
          >
            进入系统
          </button>
        </form>
      </div>
    </div>
  );
}
