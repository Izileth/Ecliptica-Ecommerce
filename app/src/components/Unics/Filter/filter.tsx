import React, { useState } from 'react';
import type { ProductFilterFormValues } from '~/src/services/type';

interface ProductFilterProps {
    onFilter: (filters: ProductFilterFormValues) => void;
}
const ProductFilter: React.FC<ProductFilterProps> = ({ onFilter }) => {
    const [filters, setFilters] = useState<ProductFilterFormValues>({
        category: '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        
        setFilters(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Remove campos vazios antes de enviar
        const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => 
            value !== '' && value !== false && value !== undefined
        )
        );
        onFilter(activeFilters);
    };
    const handleReset = () => {
        setFilters({
        category: '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        });
        onFilter({});
    };

    
    const categories = [
      'Camisetas',
      'Calças',
      'Vestidos',
      'Casacos',
      'Sapatos'
    ]; // Substitua pelas suas categorias reais

  return (
    <form onSubmit={handleSubmit} className="mb-8 mt-10 p-4 bg-transparent rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Todas categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Preço Mínimo</label>
          <input
            type="number"
            name="minPrice"
            min="0"
            step="0.01"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="R$ 0,00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Preço Máximo</label>
          <input
            type="number"
            name="maxPrice"
            min="0"
            step="0.01"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="R$ 500,00"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={filters.inStock}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
              Em estoque
            </label>
          </div>
          
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Filtrar
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-700 py-2 px-4 rounded border hover:bg-gray-100 transition"
          >
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductFilter;