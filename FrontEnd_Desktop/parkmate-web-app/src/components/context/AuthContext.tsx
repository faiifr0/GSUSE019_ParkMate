'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode';

type CurrUserPayLoad = JwtPayload & {
  roles: string[];
  userId: number;
  parkBranchId: number;
  email: string;
};

// Define the context shape
interface AuthContextType {
  currUser: CurrUserPayLoad | null;
  setCurrUser: Dispatch<SetStateAction<CurrUserPayLoad | null>>;
}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children } : AuthProviderProps) => {
  const [currUser, setCurrUser] = useState<CurrUserPayLoad | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      try {
        const decoded = jwtDecode<CurrUserPayLoad>(token);       
        //console.log("Decoded JWT: ", decoded); 
        //console.log("Decoded JWT: " + JSON.stringify(decoded, null, 2));
        setCurrUser(decoded);
      } catch (err) {
        console.error('Invalid token', err);
        clearCookie('token');
        router.push('/signin');
      }
    } else {
      router.push('/signin');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currUser, setCurrUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to read cookie
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}

// Optional: Helper to clear cookie
function clearCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}