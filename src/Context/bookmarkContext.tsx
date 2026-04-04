import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../Storage/mmkv';
import { Course } from '../API/Random_APi';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

interface BookmarkContextType {
    bookmarks: Course[];
    toggleBookmark: (course: Course) => void;
    isBookmarked: (courseId: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<Course[]>([]);

    useEffect(() => {
        const checkPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
        };

        checkPermissions();

        const savedBookmarks = storage.getString('bookmarks');
        if (savedBookmarks) {
            try {
                setBookmarks(JSON.parse(savedBookmarks));
            } catch {
                storage.delete('bookmarks');
            }
        }
    }, []);

    const toggleBookmark = (course: Course) => {
        setBookmarks((prev) => {
            const isExist = prev.find((item) => item.id === course.id);
            let updated;
            if (isExist) {
                updated = prev.filter((item) => item.id !== course.id);
            } else {
                updated = [course, ...prev];
                
                if (updated.length === 5) {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Achievement Unlocked! 🎯",
                            body: "You've saved 5 courses to your library! Ready to dive in?",
                            data: { type: 'milestone', count: 5 },
                        },
                        trigger: null,
                    });
                }
            }
            storage.set('bookmarks', JSON.stringify(updated));
            return updated;
        });
    };

    const isBookmarked = (courseId: number) => {
        return !!bookmarks.find((item) => item.id === courseId);
    };

    return (
        <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmarks = () => {
    const context = useContext(BookmarkContext);
    if (!context) {
        throw new Error('useBookmarks must be used within a BookmarkProvider');
    }
    return context;
};
