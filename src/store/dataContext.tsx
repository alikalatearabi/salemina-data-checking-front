import React, { createContext, useContext, useState, ReactNode } from 'react';
import apiClient from '../api';

export interface DataType {
    data?: {
        _id: string;
        Main_data_status: string;
        Extra_data_status: string;
        cluster: string;
        child_cluster: string;
        product_name: string;
        brand: string;
        picture_old: string;
        picture_new: string;
        picture_main_info: string;
        picture_extra_info: string;
        product_description: string;
        barcode: string;
        state_of_matter: string;
        per: string;
        calorie: string;
        sugar: string;
        fat: string;
        salt: string;
        trans_fatty_acids: string;
        per_ext: string;
        calorie_ext: string;
        cal_fat: string;
        total_fat: string;
        saturated_fat: string;
        unsaturated_fat: string;
        trans_fat: string;
        protein: string;
        sugar_ext: string;
        carbohydrate: string;
        fiber: string;
        salt_ext: string;
        sodium: string;
        cholesterol: string;
        createdAt: Date,
        updatedAt: Date
    }[],
    totalProducts?: string
}

interface DataContextType {
    data: DataType;
    setData: React.Dispatch<React.SetStateAction<DataType>>;
    fetchData: (params: { page: string; limit: string;[key: string]: any }) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<DataType>({});

    const fetchData = async (newParams: { page: string; limit: string;[key: string]: any }) => {
        try {
            const response = await apiClient.get("/products", { params: newParams });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    return (
        <DataContext.Provider value={{ data, setData, fetchData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
