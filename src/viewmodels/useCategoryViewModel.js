import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

export default function useCategoryViewModel() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const response = await getCategories();

            const data = Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response)
                    ? response
                    : [];

            setCategories(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        fetchCategories,
    };
}