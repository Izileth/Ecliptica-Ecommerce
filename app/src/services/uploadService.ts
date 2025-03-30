import api from "./api";

export const uploadImage = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload', formData);
    return response.data;
};