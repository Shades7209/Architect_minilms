import * as SecureStore from "expo-secure-store";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../Storage/mmkv";
import {Alert} from "react-native";
import {LoginFormData, signupFormData} from "@/src/validation/authSchema";
import {router} from "expo-router";

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    updateAvatar: (imageUri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshAccessToken = async () => {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
            await logout();
            return null;
        }

        try {
            const res = await axios.post(
                "https://api.freeapi.app/api/v1/users/refresh-token",
                { refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const nextAccessToken = res.data.data?.accessToken;
            const nextRefreshToken = res.data.data?.refreshToken;

            if (!nextAccessToken) {
                await logout();
                return null;
            }

            await SecureStore.setItemAsync("accessToken", nextAccessToken);

            if (nextRefreshToken) {
                await SecureStore.setItemAsync("refreshToken", nextRefreshToken);
            }

            return nextAccessToken;
        } catch {
            await logout();
            return null;
        }
    };

    const authorizedRequest = async <T,>(request: (token: string) => Promise<T>): Promise<T> => {
        const accessToken = await SecureStore.getItemAsync("accessToken");

        if (!accessToken) {
            await logout();
            throw new Error("No access token found");
        }

        try {
            return await request(accessToken);
        } catch (error: any) {
            const status = error?.response?.status;

            if (status === 401 || status === 403) {
                const nextAccessToken = await refreshAccessToken();

                if (!nextAccessToken) {
                    throw error;
                }

                return request(nextAccessToken);
            }

            if (status === 404) {
                await logout();
            }

            throw error;
        }
    };

    useEffect(() => {
        const restoreSession = async () => {
            const savedUser = storage.getString("user");

            try {
                const token = await SecureStore.getItemAsync("accessToken");

                if (token) {
                    try {
                        const res = await authorizedRequest((validToken) =>
                            axios.get("https://api.freeapi.app/api/v1/users/current-user", {
                                headers: {
                                    Authorization: `Bearer ${validToken}`
                                }
                            })
                        );
                        
                        const freshUser = res.data.data;
                        setUser(freshUser);
                        storage.set("user", JSON.stringify(freshUser));
                    } catch (apiError: any) {
                        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
                            await logout();
                        } else {
                            if (savedUser) setUser(JSON.parse(savedUser));
                        }
                    }
                } else {
                    setUser(null);
                }
            } catch {
                if (savedUser) setUser(JSON.parse(savedUser));
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

            storage.set("user", JSON.stringify(user));

            setUser(user);
            Alert.alert("Success","Welcome Back!");
            router.replace("/(root)/(tabs)")

        }catch(error:any){
            Alert.alert("Login Failed", error.response?.data?.message || "Please check your credentials.");
        }

    };

    const signup = async (data: signupFormData) => {
        try{
            await axios.post(
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
            Alert.alert("Success", "Account successfully created! Please login.");

        }catch(error:any){
            Alert.alert("Signup Failed", error.response?.data?.message || "Something went wrong.");
        }

    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        storage.remove("user");

        setUser(null);
    };

    const updateAvatar = async (imageUri: string) => {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        if (!accessToken) {
            Alert.alert("Error", "You must be logged in to update your avatar.");
            return;
        }

        const formData = new FormData();
        const fileName = imageUri.split('/').pop() || 'avatar.jpg';
        const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

        formData.append('avatar', {
            uri: imageUri,
            name: fileName,
            type: fileType,
        } as any);

        try {
            await authorizedRequest((validToken) =>
                axios.patch(
                    "https://api.freeapi.app/api/v1/users/avatar",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${validToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
            );

            const res = await authorizedRequest((validToken) =>
                axios.get("https://api.freeapi.app/api/v1/users/current-user", {
                    headers: { Authorization: `Bearer ${validToken}` },
                })
            );
            const freshUser = res.data.data;
            setUser(freshUser);
            storage.set("user", JSON.stringify(freshUser));
        } catch (error: any) {
            throw error;
        }
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateAvatar }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext)!;
};
