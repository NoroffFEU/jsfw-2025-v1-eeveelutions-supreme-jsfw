import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import type { Product } from '../types/product';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Toast } from '../components/ui/Toast';

const API_URL = 'https://v2.api.noroff.dev/online-shop';

type RouteParams = {
    id: string;
};

type CartItem = {
    id: string;
    quantity: number;
};

export function ProductDetailsPage() {
    const { id } = useParams<RouteParams>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
        setError('Missing product ID');
        setLoading(false);
        return;
        }

        async function fetchProduct() {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/${id}`);

            if (!response.ok) {
            throw new Error('Failed to fetch product');
            }

            const json = await response.json();
            setProduct(json.data as Product);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }

        fetchProduct();
    }, [id]);

    function handleAddToCart() {
        if (!product) return;

        const storedCart = localStorage.getItem('cart');
        let cart: CartItem[] = [];

        if (storedCart) {
        try {
            cart = JSON.parse(storedCart);
        } catch {
            cart = [];
        }
        }

        const existingIndex = cart.findIndex((item) => item.id === product.id);

        if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
        } else {
        cart.push({ id: product.id, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        setToast('Added to cart');
    }

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

    if (!product) {
        return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
            <ErrorMessage message="Product not found" />
            </main>
        </div>
        );
    }

    const hasDiscount = product.discountedPrice < product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
            <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:underline mb-6"
            >
            ← Back to products
            </Link>

            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col lg:flex-row">
            {/* Image */}
            <div className="lg:w-1/2">
                <img
                src={product.image.url}
                alt={product.image.alt || product.title}
                className="w-full h-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col gap-4">
                {hasDiscount && (
                <span className="self-start bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discountPercentage}%
                </span>
                )}

                <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

                <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">
                    ({product.reviews.length} reviews)
                </span>
                </div>

                <p className="text-gray-700">{product.description}</p>

                <div className="mt-2">
                {hasDiscount ? (
                    <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-green-600">
                        ${product.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                    </span>
                    </div>
                ) : (
                    <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                    </span>
                )}
                </div>

                {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                        #{tag}
                    </span>
                    ))}
                </div>
                )}

                <button
                type="button"
                onClick={handleAddToCart}
                className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
                >
                Add to cart
                </button>

                {product.reviews.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Reviews</h2>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {product.reviews.map((review) => (
                        <div
                        key={review.id}
                        className="border border-gray-200 rounded-md p-3"
                        >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{review.username}</span>
                            <span className="text-yellow-500 text-sm">
                            ★ {review.rating.toFixed(1)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700">
                            {review.description}
                        </p>
                        </div>
                    ))}
                    </div>
                </section>
                )}
            </div>
            </div>
        </main>

            {toast && (
                <Toast
                message={toast}
                type="success"
                onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
