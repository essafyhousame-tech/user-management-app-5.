import { create } from 'zustand';

type User = {
    id: number;
    name: string;
    email: string;
};

type AuthState = {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;

    setAuth: (token: string, user: User) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    setAuth: (token, user) => set({
        token,
        user,
        isAuthenticated: true,
    }),

    logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false,
    }),
}));
