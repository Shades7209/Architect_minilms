import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/src/Context/authContext';

const WebViewScreen = () => {
    const params = useLocalSearchParams();
    const { user } = useAuth();
    
    const id = params.id as string;
    const title = params.title as string;
    const instructorName = params.instructorName as string;

    // Create a local HTML template with Lumina branding
    const htmlTemplate = useMemo(() => {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data:; media-src *; frame-src *; style-src * 'unsafe-inline';">
                <style>
                    :root {
                        --bg-color: #000000;
                        --card-bg: #0A0A0A;
                        --accent-color: #6366F1;
                        --text-primary: #FFFFFF;
                        --text-secondary: #A1A1AA;
                        --border-color: #27272A;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        background-color: var(--bg-color);
                        color: var(--text-primary);
                        margin: 0;
                        padding: 24px;
                        line-height: 1.6;
                    }
                    .header {
                        padding-bottom: 24px;
                        border-bottom: 1px solid var(--border-color);
                        margin-bottom: 24px;
                    }
                    .title {
                        font-size: 28px;
                        font-weight: 800;
                        margin: 0 0 8px 0;
                        background: linear-gradient(to right, #6366F1, #A5B4FC);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .instructor {
                        color: var(--text-secondary);
                        font-size: 16px;
                        font-weight: 500;
                    }
                    .content {
                        font-size: 17px;
                    }
                    .card {
                        background-color: var(--card-bg);
                        border: 1px solid var(--border-color);
                        border-radius: 20px;
                        padding: 20px;
                        margin-bottom: 24px;
                        margin-top:10px
                    }
                    .badge {
                        background-color: rgba(99, 102, 241, 0.15);
                        color: var(--accent-color);
                        padding: 4px 12px;
                        border-radius: 8px;
                        font-size: 12px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        display: inline-block;
                        margin-bottom: 12px;
                    }
                    h2 {
                        font-size: 20px;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        color: var(--text-secondary);
                        font-size: 12px;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid var(--border-color);
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <span class="badge">Course Lesson</span>
                    <h1 class="title">${title}</h1>
                    <div class="instructor">Instructor: ${instructorName}</div>
                </div>
                
                <div class="card">
                    <h2>Module 1: Introduction</h2>
                    <p>Welcome to the premium content of this course. This module covers the foundational concepts required to master this topic.</p>
                </div>

                <div class="content">
                    <h2>Course Overview</h2>
                    <p>In this lesson, we explore the advanced methodologies utilized by industry experts. You will learn how to integrate these concepts into your existing workflow for maximum efficiency.</p>
                    <ul>
                        <li>Understanding the Core Architecture</li>
                        <li>Setting up the Development Environment</li>
                        <li>State Management Best Practices</li>
                        <li>Advanced Rendering Techniques</li>
                    </ul>
                </div>
                <div style="padding-top: 20px; border: 2px solid #ccc; border-bottom: 4px solid white; border-radius: 10px; overflow: hidden; max-width: 100%;">

  <div style="position: relative; padding-bottom: 56.25%; height: 0;">
    <iframe 
      src="https://www.youtube.com/embed/YoeP9w5UIlg?playsinline=1&rel=0&origin=https://lumina-app.com&widget_referrer=https://lumina-app.com"
      title="YouTube video player"
      frameborder="0"
     allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    </iframe>
  </div>

</div>

                <div class="card">
                    <h2>Communication Check</h2>
                    <p>The Native app has securely transmitted headers to this viewer. This ensures that only authorized learners can access this content.</p>
                </div>

                <div class="footer">
                    &copy; 2026 LUMINA Learning Management System
                </div>
            </body>
            </html>
        `;
    }, [title, instructorName]);

    return (
        <View className="flex-1 bg-black">
            {/* Header */}
            <SafeAreaView edges={['top']} className="bg-neutral-900/50 border-b border-white/5">
                <View className="flex-row items-center px-6 py-4">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="bg-neutral-800 p-2 rounded-full mr-4"
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg" numberOfLines={1}>Course Viewer</Text>
                        <Text className="text-neutral-500 text-xs uppercase tracking-widest">Premium Content</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* WebView */}
            <WebView
                source={{ 
                    html: htmlTemplate,
                    baseUrl: 'https://lumina-app.com',
                    // Passing headers for Communication Check
                    headers: {
                        'X-Course-Id': id,
                        'Authorization': `Bearer ${user?.token || 'mock-token'}`,
                        'X-Device-Type': 'Mobile-App'
                    }
                }}
                userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
                javaScriptEnabled
                domStorageEnabled
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={['*']} 
                className="flex-1"
                containerStyle={{ backgroundColor: 'black' }}
                startInLoadingState={true}
                renderLoading={() => (
                    <View className="absolute inset-0 bg-black items-center justify-center">
                        <ActivityIndicator color="#6366F1" size="large" />
                    </View>
                )}
                scalesPageToFit={true}
            />
        </View>
    );
};

export default WebViewScreen;
