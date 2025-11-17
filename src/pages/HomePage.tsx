import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/products/ProductGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export function HomePage() {
  const { products, loading, error } = useProducts();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<'name-asc' | 'price-asc' | 'price-desc'>('name-asc');

    const filteredProducts = useMemo(() => {
      const query = searchQuery.toLowerCase().trim();

      const filtered = query
        ? products.filter((product) => {
            const inTitle = product.title.toLowerCase().includes(query);
            const inTags = product.tags.some((tag) =>
              tag.toLowerCase().includes(query)
            );
            return inTitle || inTags;
          })
        : products;

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'price-asc':
          return a.discountedPrice - b.discountedPrice;
        case 'price-desc':
          return b.discountedPrice - a.discountedPrice;
        default:
          return 0;
        }
      });

      return sorted;
    }, [products, searchQuery, sortOption]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} />
        </main>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as 'name-asc' | 'price-asc' | 'price-desc')
            }
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="price-asc">Price (low → high)</option>
            <option value="price-desc">Price (high → low)</option>
          </select>
        </div>

        <ProductGrid products={filteredProducts} />
      </main>
    </div>
  );
}
