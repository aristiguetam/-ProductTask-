import { createContext, useEffect, useState } from "react";

import { ImagePickerResponse } from "react-native-image-picker";

import productosApi from "../api/productosApi";
import { Producto, ProductsResponse } from "../interfaces/appInterfaces";

type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProducts: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: ImagePickerResponse, id: string) => Promise<void>;
}



export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({ children }: any) => {

    const [products, setProducts] = useState<Producto[]>([])

    useEffect(() => {
        loadProducts();
    }, [])


    const loadProducts = async () => {

        const resp = await productosApi.get<ProductsResponse>('/productos?limit=50');
        // setProducts([...products, ...resp.data.productos])
        setProducts([...resp.data.productos])

    };

    const addProducts = async (categoryId: string, productName: string): Promise<Producto> => {

        const resp = await productosApi.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId
        });

        setProducts([...products, resp.data]);

        return resp.data;
    };

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {

        const resp = await productosApi.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId
        });

        setProducts(products.map(prod => {
            return (prod._id === productId)
                ? resp.data
                : prod
        }));

    };

    const deleteProduct = async (id: string) => {
        const resp = await productosApi.delete<Producto>(`/productos/${id}`);

        setProducts(products.map(prod => {
            return (prod._id === id)
                ? resp.data
                : prod
        }));

    };

    const loadProductById = async (id: string): Promise<Producto> => {

        const resp = await productosApi.get<Producto>(`/productos/${id}`);
        return resp.data

    };

    
    const uploadImage = async (data: ImagePickerResponse, id: string) => {

        const params = {
            name: data.assets![0].fileName!,
            type: data.assets![0].type!,
            uri: data.assets![0].uri!,
        }

        const fileToUpload = JSON.parse(JSON.stringify(params));

        const formData = new FormData();
        formData.append('archivo', fileToUpload);

        try {
            const resp = await productosApi.put(`/uploads/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            console.log(resp);
        } catch (error) {
            console.log({ error });

        }
    };

    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProducts,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage,
        }}>
            {children}
        </ProductsContext.Provider>
    )
}