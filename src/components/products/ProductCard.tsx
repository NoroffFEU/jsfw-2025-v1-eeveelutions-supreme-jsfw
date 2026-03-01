import { Link } from 'react-router';
import type { Product } from '../../types/product';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../context/ToastContext';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const hasDiscount = product.discountedPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product);
    showToast({ message: `${product.title} added to cart`, type: 'success' });
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {hasDiscount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
          -{discountPercentage}%
        </div>
      )}

      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image.url}
            alt={product.image.alt || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {product.title}
          </h3>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="ml-1 text-sm text-gray-700">{product.rating}</span>
            <span className="ml-1 text-xs text-gray-400">({product.reviews.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-gray-900">
                  ${product.discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
