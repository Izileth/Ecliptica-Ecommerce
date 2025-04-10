import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']; // Removido SVG e adicionado WEBP

// Schema para tamanho do produto (melhorado)
const productSizeSchema = z.object({
  size: z.string().min(1, "Tamanho é obrigatório"),
  stock: z.number({
    required_error: "Estoque é obrigatório",
    invalid_type_error: "Estoque deve ser um número"
  }).int("Estoque deve ser inteiro").min(0, "Estoque não pode ser negativo")
});

// Schema para cor do produto (melhorado)
const productColorSchema = z.object({
  colorName: z.string().min(1, "Nome da cor é obrigatório"),
  colorCode: z.string().min(4, "Código da cor inválido").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Formato de cor inválido (use hexadecimal)"),
  stock: z.number({
    required_error: "Estoque é obrigatório",
    invalid_type_error: "Estoque deve ser um número"
  }).int("Estoque deve ser inteiro").min(0, "Estoque não pode ser negativo"),
  imageUrl: z.union([
    z.instanceof(File).refine(file => 
      ALLOWED_FILE_TYPES.includes(file.type) && 
      file.size <= MAX_FILE_SIZE, 
      "Apenas imagens JPEG/PNG/WEBP de até 5MB são permitidas"
    ),
    z.string().url("URL da imagem inválida")
  ]).optional()
});

// Função de validação para arquivos de imagem
const imageFileSchema = z.instanceof(File).refine(file => 
  ALLOWED_FILE_TYPES.includes(file.type) && 
  file.size <= MAX_FILE_SIZE, {
  message: "Apenas imagens JPEG/PNG/WEBP de até 5MB são permitidas"
}).optional();

// Schema principal do produto (refatorado)
export const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().min(1, "Descrição é obrigatória").max(2000, "Descrição muito longa"),
  price: z.union([
    z.number().min(0.01, "Preço mínimo é R$ 0,01").max(999999.99, "Preço muito alto"),
    z.string().refine(val => !isNaN(parseFloat(val)), "Deve ser um número válido")
      .transform(val => parseFloat(val))
      .refine(val => val >= 0.01, "Preço mínimo é R$ 0,01")
  ]),
  category: z.string().min(1, "Categoria é obrigatória"),
  countInStock: z.union([
    z.number().int("Deve ser inteiro").min(0, "Estoque não pode ser negativo"),
    z.string().refine(val => !isNaN(parseInt(val)), "Deve ser um número válido")
      .transform(val => parseInt(val))
      .refine(val => val >= 0, "Estoque não pode ser negativo")
  ]),
  image: imageFileSchema,
  salePrice: z.union([
    z.number().min(0.01, "Preço promocional inválido").optional(),
    z.string().refine(val => val === "" || !isNaN(parseFloat(val)), "Deve ser um número válido")
      .transform(val => val === "" ? undefined : parseFloat(val))
      .optional()
  ]),
  collection: z.string().max(50, "Nome da coleção muito longo").optional(),
  features: z.array(
    z.string().min(1, "Característica não pode ser vazia").max(50, "Característica muito longa")
  ).max(20, "Máximo de 20 características").optional(),
  sizes: z.array(productSizeSchema).max(20, "Máximo de 20 tamanhos").optional(),
  colors: z.array(productColorSchema).max(20, "Máximo de 20 cores").optional(),
  additionalImages: z.array(
    z.string().url("URL da imagem inválida")
  ).max(10, "Máximo de 10 imagens adicionais").optional(),
  additionalImagesFiles: z.array(
    z.instanceof(File).refine(
      file => ALLOWED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE, 
      "Apenas imagens JPEG/PNG/WEBP de até 5MB são permitidas"
    )
  ).max(10, "Máximo de 10 imagens adicionais").optional(),
  removedImages: z.array(
    z.string().url("URL da imagem inválida")
  ).optional()
  }).superRefine((data, ctx) => {
  // Validação cruzada: preço promocional deve ser menor que preço normal
  if (data.salePrice !== undefined && data.salePrice >= data.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Preço promocional deve ser menor que o preço normal",
      path: ["salePrice"]
    });
  }

  // Validação: pelo menos uma imagem (principal ou adicional) deve existir
  const hasMainImage = 
  (data.image instanceof File) || 
  (typeof data.image === 'string' && (data.image as string).length > 0);
  const hasAdditionalImages = 
  (data.additionalImages?.length || 0) > 0 || 
  ((data.additionalImagesFiles as File[] | undefined)?.length || 0) > 0;
  
  if (!hasMainImage && !hasAdditionalImages) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Pelo menos uma imagem (principal ou adicional) é obrigatória",
      path: ["image"]
    });
  }

  // Validação: estoque total deve ser igual à soma dos estoques por tamanho/cores
  if (data.sizes?.length || data.colors?.length) {
    const totalVariantStock = [
      ...(data.sizes?.map(s => s.stock) || []),
      ...(data.colors?.map(c => c.stock) || [])
    ].reduce((sum, stock) => sum + stock, 0);

    if (totalVariantStock !== data.countInStock) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Estoque total deve ser igual à soma dos estoques por variantes",
        path: ["countInStock"]
      });
    }
  }
});