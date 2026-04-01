import * as SecureStore from "expo-secure-store";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../Storage/mmkv";
import {Alert} from "react-native";
import {loginSchema, LoginFormData, signupFormData} from "@/src/validation/authSchema";
import {router} from "expo-router";
interface AuthContextType {
    user: any;
    loading: boolean;
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                // Read user profile from MMKV (Synchronous)
                const savedUser = storage.getString("user");
                
                // Keep tokens in SecureStore (Asynchronous)
                const token = await SecureStore.getItemAsync("accessToken");

                if (savedUser && token) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.log("Restore session error:", error);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (data: LoginFormData) => {
        try{
            const res = await axios.post(
                "https://api.freeapi.app/api/v1/users/login",{
                    password: data.password,
                    username: data.username.toLowerCase(),
                },{
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }

                );
            const { accessToken, refreshToken, user } = res.data.data;
            await SecureStore.setItemAsync("accessToken", accessToken);
            await SecureStore.setItemAsync("refreshToken", refreshToken);

            // Save user profile to MMKV (Synchronous)
            storage.set("user", JSON.stringify(user));

            setUser(user);
            console.log("Login Success:", res.data);
            Alert.alert("Success","Welcome Back!");
            router.replace("/(root)/(tabs)")



        }catch(error:any){
            Alert.alert(error.response.data.message,)
            console.log(error?.response?.data);
        }


    };

    const signup = async (data: signupFormData) => {
        try{
            const res = await axios.post(
                "https://api.freeapi.app/api/v1/users/register",{
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    username: data.username.toLowerCase(),
                },{
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }


            );
            console.log("User Registered:", res.data);
            Alert.alert("Success","Account successfully created Please Login!");



        }catch(error:any){
            Alert.alert(error.response.data.message,)
            console.log(error?.response?.data);
        }

    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        // Clear user data from MMKV
        storage.remove("user");

        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext)!;
};