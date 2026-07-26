'use client';

import { ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store/store';
import { setCredentials } from '@/store/authSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'next-themes';
import apiClient from '@/lib/axios';

const queryClient = new QueryClient();

/** Rehydrates Redux auth state from localStorage on every mount */
function AuthRehydrator({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) return;

    apiClient
      .get('/auth/me')
      .then((res) => {
        const user = res.data;
        if (user) {
          const currentToken = localStorage.getItem('authToken') || token;
          dispatch(setCredentials({ token: currentToken, user }));
        }
      })
      .catch((err) => {
        console.warn('Session rehydration failed or token invalid:', err);
      });
  }, [dispatch]);

  return <>{children}</>;
}

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthRehydrator>
            {children}
          </AuthRehydrator>
          <Toaster position="top-right" />
          <ToastContainer position="top-right" autoClose={3500} theme="colored" />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
