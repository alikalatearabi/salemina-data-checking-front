import apiClient from './index';

export interface Product {
  _id: string;
  main_data_status: string;
  extra_data_status: string;
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
}


export const fetchProducts = async (page: number, limit: number): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/products`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products', error);
    throw error;
  }
};

export const updateProduct = async (updatedProduct: Product) => {
  try {
    const response = await apiClient.put(`/product/${updatedProduct.barcode}`, updatedProduct);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};
