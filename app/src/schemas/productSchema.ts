import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];

// Schema para tamanho do produto
const productSizeSchema = z.object({
  size: z.string().min(1, "Tamanho é obrigatório"),
  stock: z.number().min(0, "Estoque não pode ser negativo")
});

// Schema para cor do produto
const productColorSchema = z.object({
  colorName: z.string().min(1, "Nome da cor é obrigatório"),
  colorCode: z.string().min(1, "Código da cor é obrigatório"),
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  imageUrl: z.any().optional() // Pode ser File ou string (URL)
});

// Schema principal do produto
export const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0.01, "Preço inválido"),
  category: z.string().min(1, "Categoria é obrigatória"),
  countInStock: z.number().min(0, "Estoque não pode ser negativo"),
  image: z.any().refine(file => !file || (file instanceof File && 
         ALLOWED_FILE_TYPES.includes(file.type) && 
         file.size <= MAX_FILE_SIZE), {
    message: "Apenas imagens JPEG/PNG/SVG de até 5MB são permitidas"
  }).optional(),
  salePrice: z.number().optional(),
  collection: z.string().optional(),
  features: z.array(z.string().min(1, "Característica não pode ser vazia")).optional(),
  sizes: z.array(productSizeSchema).optional(),
  colors: z.array(productColorSchema).optional(),
  additionalImages: z.array(z.string().optional()).optional(),
  additionalImagesFiles: z.array(z.any()).optional(),
  removedImages: z.array(z.string()).optional()
}).superRefine((data, ctx) => {
  if (data.salePrice !== undefined && data.salePrice >= data.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Preço promocional deve ser menor que o preço normal",
      path: ["salePrice"]
    });
  }
});