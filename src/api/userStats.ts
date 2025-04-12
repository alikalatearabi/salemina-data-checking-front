import apiClient from './index';

export interface DailyCount {
  date: string;
  count: number;
}

export interface StatusGroup {
  main_data_status: number;
  extra_data_status: string;
  totalCount: number;
  dailyCounts: DailyCount[];
}

export interface UserProductStats {
  username: string;
  totalProducts: number;
  statusGroups: StatusGroup[];
  overallDailyCounts: DailyCount[];
}

export interface ImportersResponse {
  importers: string[];
}

export const fetchUserProductStats = async (username: string): Promise<UserProductStats> => {
  try {
    const response = await apiClient.get(`/user-products/${username}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user product statistics', error);
    throw error;
  }
};

export const fetchImporters = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<ImportersResponse>('/distinct-importers');
    return response.data.importers.filter(importer => importer.trim() !== '');
  } catch (error) {
    console.error('Failed to fetch importers list', error);
    throw error;
  }
}; 