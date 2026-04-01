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
});

export const fetchData = async (): Promise<{ users: User[]; products: Product[] }> => {
    try {
        const [usersRes, productsRes] = await Promise.all([
            API.get("/public/randomusers"),
            API.get("/public/randomproducts"),
        ]);

        return {
            users: usersRes.data.data.data || [],
            products: productsRes.data.data.data || [],
        };
    } catch (error) {
        console.error("Error fetching data:", error);
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