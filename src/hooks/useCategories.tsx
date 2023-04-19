import { useState, useEffect } from 'react';
import { Categoria, CategoriesResponse } from '../interfaces/appInterfaces';
import productosApi from '../api/productosApi';

export const useCategories = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [categories, setCategories] = useState<Categoria[]>([])

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async () => {

        const resp = await productosApi.get<CategoriesResponse>('/categorias');

        setCategories(resp.data.categorias)
        setIsLoading(false)

    }


    return {
        categories,
        isLoading,
    }

}
