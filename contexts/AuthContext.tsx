import { createContext, ReactNode, useState } from 'react';
import { setCookie }  from 'nookies';
import { api } from '../services/api';

import Router  from 'next/router'

type SignCredentials = {
    email: string;
    password: string;
}

type User = {
    email: string;
    permissions: string[];
    roles: string[];

}

type AuthContextData = {
    signIn(credentials: SignCredentials): Promise<void>;
    user: User;
    isAuthenticated: boolean;
}

type AuthProviderPRops = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderPRops) {
    const [user, setUser] = useState<User>();
    
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password,
            })

            const { token, refreshToken, permissions, roles } = response.data;

            setCookie(undefined, 'nextauth.token', token, {
               maxAge: 60 * 60 * 24 * 30, 
               path: '/'
            }); 

            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, 
                path: '/'
             });
    
            setUser({
                email,
                permissions,
                roles,
            });

            Router.push('/dashboard');
        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated, user}}>
            { children } 
        </AuthContext.Provider>
    )
}