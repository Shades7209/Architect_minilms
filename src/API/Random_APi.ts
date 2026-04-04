import axios from "axios";

export interface User {
    name: {
        first: string;
        last: string;
    };
    picture: {
        large: string;
    };
    email: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    rating: number;
    price: number;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    image: string;
    rating: number;
    price: number;
    duration: string;
    instructor: {
        name: string;
        avatar: string;
        email: string;
    };
}

const API = axios.create({
    baseURL: "https://api.freeapi.app/api/v1",
    timeout: 8000,
});

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error: unknown) => {
    if (!axios.isAxiosError(error)) return false;

    if (error.code === "ECONNABORTED") return true;
    if (!error.response) return true;

    const status = error.response.status;
    return status === 429 || status >= 500;
};

const requestWithRetry = async <T>(request: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
    try {
        return await request();
    } catch (error) {
        if (!shouldRetry(error) || retries <= 0) {
            throw error;
        }

        const attempt = MAX_RETRIES - retries + 1;
        await sleep(RETRY_DELAY_MS * attempt);
        return requestWithRetry(request, retries - 1);
    }
};

export const fetchData = async (): Promise<{ users: User[]; products: Product[] }> => {
    try {
        const [usersRes, productsRes] = await Promise.all([
            requestWithRetry(() => API.get("/public/randomusers")),
            requestWithRetry(() => API.get("/public/randomproducts")),
        ]);

        return {
            users: usersRes.data.data.data || [],
            products: productsRes.data.data.data || [],
        };
    } catch {
        return { users: [], products: [] };
    }
};

export const combineCourses = (products: Product[], users: User[]): Course[] => {
    if (!products.length || !users.length) return [];

    return products.map((product, index) => {
        const instructor = users[index % users.length];

        const productImage = `https://picsum.photos/seed/${product.id}/600/400`;
        
        const hours = (product.id % 20) + 2;
        const mins = (product.id % 60);

        return {
            id: product.id,
            title: product.title,
            description: product.description,
            image: productImage,
            rating: product.rating,
            price: product.price,
            duration: `${hours}h ${mins}m`,
            instructor: {
                name: `${instructor.name.first} ${instructor.name.last}`,
                avatar: instructor.picture.large,
                email: instructor.email,
            },
        };
    });
};
