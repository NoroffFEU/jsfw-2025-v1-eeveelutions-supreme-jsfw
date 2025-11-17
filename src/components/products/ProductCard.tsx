import { Link } from 'react-router';
import type { Product } from '../../types/product';

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discountedPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
            -{discountPercentage}%
          </div>
        )}

        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image.url}
            alt={product.image.alt || product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {product.title}
          </h3>

          <div className="flex items-center mb-3">
            <svg
              className="w-5 h-5 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="ml-1 text-sm text-gray-700">{product.rating}</span>
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
      </div>
    </Link>
  );
}
