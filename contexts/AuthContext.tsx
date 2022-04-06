import { createContext, ReactNode } from 'react';
import { api } from '../services/api';

type SignCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials: SignCredentials): Promise<void>;
    isAuthenticated: boolean;
}

type AuthProviderPRops = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderPRops) {
    const isAuthenticated = false;

    async function signIn({ email, password }: SignCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password,
            })
    
            console.log(response.data)
        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated}}>
            { children } 
        </AuthContext.Provider>
    )
}