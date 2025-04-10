// uploadService.ts - Versão melhorada
import api from "./api";

interface UploadResponse {
    url: string;
    publicId?: string;
    width?: number;
    height?: number;
}

interface ErrorResponse {
    message: string;
    status?: number;
    code?: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
    try {
        const formData = new FormData();
        formData.append('image', file); // Nome consistente com o backend
        
        // REMOVA os headers - o interceptor já cuida disso
        const response = await api.post('/upload', formData);
        
        return {
        url: response.data.url,
        publicId: response.data.public_id,
        ...(response.data.width && { width: response.data.width }),
        ...(response.data.height && { height: response.data.height })
        };
    } catch (error: any) {
        if (error.response?.status === 413) {
            throw new Error('Imagem muito grande. O tamanho máximo é 5MB.');
        } else if (error.response?.data?.message?.includes('formato')) {
            throw new Error('Formato de arquivo inválido. Use JPEG, PNG ou SVG.');
        }
            throw new Error(
        error.response?.data?.message ||
            'Falha no upload da imagem.'
        );
    }
};

export const uploadMultipleImages = async (files: File[]): Promise<UploadResponse[]> => {
    try {
        const formData = new FormData();
        
        // Nome consistente com o backend (additionalImages)
        files.forEach((file, index) => {
        formData.append(`additionalImages`, file); // Note o nome plural
        });

        const response = await api.post('/', formData);
        
        return response.data.map((img: any) => ({
        url: img.url,
        publicId: img.public_id,
        ...(img.width && { width: img.width }),
        ...(img.height && { height: img.height })
        }));
    } catch (error: any) {
        console.error('Multiple upload error:', error);
        throw new Error(
        error.response?.data?.message || 
        'Falha no upload de imagens. Verifique os formatos e tamanhos'
        );
    }
};

// Função auxiliar para pré-visualização
export const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
};

// Função para liberar recursos de pré-visualização
export const revokePreviewUrl = (url: string) => {
    URL.revokeObjectURL(url);
};