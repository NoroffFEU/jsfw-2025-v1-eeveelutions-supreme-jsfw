import { Link, useNavigate } from 'react-router';
import { useMemo } from 'react';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CartPage() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { showToast } = useToast();

  const hasItems = items.length > 0;

  const checkoutDisabled = useMemo(() => !hasItems, [hasItems]);

  const handleDecrease = (productId: string, currentQuantity: number, productTitle: string) => {
    if (currentQuantity <= 1) {
      removeItem(productId);
      showToast({ message: `Removed ${productTitle} from cart`, type: 'success' });
      return;
    }

    updateQuantity(productId, currentQuantity - 1);
  };

  const handleIncrease = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleRemove = (productId: string, productTitle: string) => {
    removeItem(productId);
    showToast({ message: `Removed ${productTitle} from cart`, type: 'success' });
  };

  const handleCheckout = () => {
    if (!hasItems) {
      showToast('Your cart is empty', 'error');
      return;
    }

  showToast({ message: 'Checkout successful!', type: 'success' });
    clearCart();
    navigate('/checkout-success', { state: { fromCheckout: true } });
  };

  if (!hasItems) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center gap-6">
          <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-600 max-w-md">
            Browse our latest Eeveelutions merchandise and add your favourites to the cart to begin checkout.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            {items.map((item) => {
              const hasDiscount = item.product.discountedPrice < item.product.price;
              const unitPrice = hasDiscount ? item.product.discountedPrice : item.product.price;
              const lineTotal = unitPrice * item.quantity;

              return (
                <div key={item.product.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="w-full sm:w-32 sm:shrink-0">
                      <img
                        src={item.product.image.url}
                        alt={item.product.image.alt || item.product.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{item.product.title}</h2>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-lg font-semibold text-gray-900">{formatPrice(unitPrice)}</span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">{formatPrice(item.product.price)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="inline-flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item.product.id, item.quantity, item.product.title)}
                            className="px-3 py-2 text-gray-600 hover:text-gray-900"
                            aria-label={`Decrease quantity of ${item.product.title}`}
                          >
                            −
                          </button>
                          <span className="px-2 min-w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleIncrease(item.product.id, item.quantity)}
                            className="px-3 py-2 text-gray-600 hover:text-gray-900"
                            aria-label={`Increase quantity of ${item.product.title}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.product.id, item.product.title)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="sm:w-32 text-right">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="text-lg font-semibold text-gray-900">{formatPrice(lineTotal)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <aside className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <dl className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <dt>Items</dt>
                <dd>{totalItems}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Total</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatPrice(totalPrice)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutDisabled}
              className={`mt-6 w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${
                checkoutDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Checkout
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
