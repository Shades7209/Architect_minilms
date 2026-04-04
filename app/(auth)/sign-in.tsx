import {View, Text, TouchableOpacity,Alert} from 'react-native'
import React, {useState} from 'react'
import Animated, { FadeInUp, FadeInDown, FadeIn, Layout, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import { useForm} from "react-hook-form";
import { loginSchema, LoginFormData, signupSchema, signupFormData } from "@/src/validation/authSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import {FormInput} from "@/components/FormInput";
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from "axios";
import {useAuth} from "@/src/Context/authContext";

const SignIn = () => {

    const [loginMethod, setLoginMethod] = useState<string>('login');
    const [passwordView, setPasswordView] = useState(true);

    const {login,signup} = useAuth()

    const {
        control: loginControl,
        handleSubmit: loginSubmit,
        formState: { errors: loginErrors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const {
        control: signupControl,
        handleSubmit: signupSubmit,
        formState: { errors: signupErrors },
    } = useForm<signupFormData>({
        resolver: zodResolver(signupSchema),
    });





    const onSubmit = async (data: LoginFormData) =>{
        await login(data)


    }
    const onSubmit1 = async (data: signupFormData) =>{
        await signup(data)
        setLoginMethod("login")
    }




  return (
    <SafeAreaView className='bg-black size-full px-[33px]'>
        <StatusBar style={"light"}/>
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        className='pt-[28px]'
      >
        <View className={"flex flex-row gap-[16px] items-center"}>
          <LinearGradient
            style={{ width: 48, height: 48, borderRadius:8, justifyContent:"center", alignItems:"center"}}
            colors={['#6366F1', '#818CF8']}>
            <MaterialCommunityIcons name="lightbulb-on" size={30} color="white" />
          </LinearGradient>
            <Text className={"text-white font-bold text-[24px] text"}>
                L U M I N A
            </Text>
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.delay(400).duration(800)}
        className={"pt-[26px] "}
      >
            <View className={"h-[55px] w-full rounded-[8px] bg-[#0F172A] items-center px-[4px] flex-row"}>
                <TouchableOpacity
                    className={"h-[45px] rounded-[6px] items-center justify-center"}
                    style={{
                        width: "50%",
                        backgroundColor: loginMethod === "login" ? "white" : "transparent",
                    }}
                    onPress={() => setLoginMethod("login")}
                >
                    <Text
                        className={"font-semibold"}
                        style={{ color: loginMethod === "login" ? "black" : "#94A3B8" }}
                    >
                        L o g i n
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={"h-[45px] rounded-[6px] items-center justify-center"}
                    style={{
                        width: "50%",
                        backgroundColor: loginMethod === "register" ? "white" : "transparent",
                    }}
                    onPress={() => setLoginMethod("register")}
                >
                    <Text
                        className={"font-semibold"}
                        style={{ color: loginMethod === "register" ? "black" : "#94A3B8" }}
                    >
                        R E G I S T E R
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
        {loginMethod === 'login' ? (
          <Animated.View 
            key="login-view"
            entering={FadeInDown.springify().damping(15)}
            layout={Layout.springify()}
          >
            <View className={"pt-[38px] gap-[8px]"}>
                <Text className={"text-white font-bold text-[36px]"}>Identity Access</Text>
                <Text className={"text-[#94A3B8] text-[16px]"}>Please authenticate with your verified
                    credentials.</Text>
            </View>
            <View className={"pt-[20px] gap-[10px]"}>
                <Animated.View entering={FadeInUp.delay(600)} className={"gap-2"}>
                    <Text className={"text-[#64748B]"}>UserName</Text>
                    <FormInput control={loginControl} name={"username"} placeholder={"Enter your username"}/>
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(700)} className={"gap-2"}>
                    <View className={"flex-row justify-between"}>
                        <Text className={"text-[#64748B]"}>PASSWORD</Text>
                        <TouchableOpacity onPress={()=>setPasswordView(!passwordView)}>
                            <AntDesign name={passwordView?"eye":"eye-invisible"} size={24} color="#6366F1" />
                        </TouchableOpacity>
                    </View>

                    <FormInput control={loginControl} name={"password"} placeholder={"Enter your Password"} secureTextEntry={passwordView}/>
                </Animated.View>

                <Animated.View entering={ZoomIn.delay(800).springify()}>
                  <LinearGradient colors={['#6366F1', '#818CF8']}
                                  style={{borderRadius:8}}
                  >
                      <TouchableOpacity onPress={loginSubmit(onSubmit)} className={" h-[58px]  items-center justify-center"}>
                          <Text className={"font-bold text-white tracking-widest"}>I N I T I A L I Z E  S E S S I O N</Text>
                      </TouchableOpacity>
                  </LinearGradient>
                </Animated.View>

            </View>
        </Animated.View>
        ) : (
            <Animated.View 
              key="register-view"
              entering={FadeInDown.springify().damping(15)}
              layout={Layout.springify()}
            >
                <View className={"pt-[26px] gap-[10px]"}>
                    <Text className={"text-white text-[36px] font-bold"}>Hello There👋</Text>
                    <Text className={"text-[#94A3B8] text-[16px] font-semibold"}>Welcome to LUMINA</Text>
                    <Text className={"text-[#94A3B8] text-[10px] font-semibold"}>Please REGISTER to continue</Text>
                </View>
                <View className={"gap-1 pt-[15px]"}>
                    <Animated.View entering={FadeInUp.delay(100)} className="gap-1">
                      <Text className={"text-[#64748B]"}>Full Name:-</Text>
                      <FormInput control={signupControl} name={"name"} placeholder={"Enter your full name"} />
                    </Animated.View>
                    <Animated.View entering={FadeInUp.delay(200)} className="gap-1">
                      <Text className={"text-[#64748B]"}>User Name:-</Text>
                      <FormInput control={signupControl} name={"username"} placeholder={"Enter username"} />
                    </Animated.View>
                    <Animated.View entering={FadeInUp.delay(300)} className="gap-1">
                      <Text className={"text-[#64748B]"}>EMAIL</Text>
                      <FormInput control={signupControl} name={"email"} placeholder={"Enter your email"}/>
                    </Animated.View>
                    <Animated.View entering={FadeInUp.delay(400)} className="gap-1">
                      <View className={"flex-row justify-between"}>
                          <Text className={"text-[#64748B]"}>PASSWORD</Text>
                          <TouchableOpacity onPress={()=>setPasswordView(!passwordView)}>
                              <AntDesign name={passwordView?"eye":"eye-invisible"} size={24} color="#6366F1" />
                          </TouchableOpacity>
                      </View>
                      <FormInput control={signupControl} name={"password"} placeholder={"Enter your password"} secureTextEntry={passwordView}/>
                    </Animated.View>
                    
                    <Animated.View entering={ZoomIn.delay(500).springify()}>
                      <LinearGradient colors={['#6366F1', '#818CF8']}
                                      style={{borderRadius:8}}
                      >
                          <TouchableOpacity onPress={signupSubmit(onSubmit1)} className={" h-[58px]  items-center justify-center"}>
                              <Text className={"font-bold text-white tracking-widest"}>I N I T I A L I Z E   A C C O U N T</Text>
                          </TouchableOpacity>
                      </LinearGradient>
                    </Animated.View>

                </View>
            </Animated.View>
        )}

    </SafeAreaView>
  )
}

export default SignIn