import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../Storage/mmkv';
import { Course } from '../API/Random_APi';

interface BookmarkContextType {
    bookmarks: Course[];
    toggleBookmark: (course: Course) => void;
    isBookmarked: (courseId: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<Course[]>([]);

    useEffect(() => {
        const savedBookmarks = storage.getString('bookmarks');
        if (savedBookmarks) {
            try {
                setBookmarks(JSON.parse(savedBookmarks));
            } catch (e) {
                console.error('Failed to parse bookmarks', e);
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
