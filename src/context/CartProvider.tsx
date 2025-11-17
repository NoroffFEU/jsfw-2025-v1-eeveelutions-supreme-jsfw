import { useMemo, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types/product';
import { CartContext, type CartContextValue, type CartItem } from './CartContext';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' };

const STORAGE_KEY = 'cart';

function getInitialState(): CartState {
  if (typeof window === 'undefined') {
    return { items: [] };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return { items: [] };
    }

    const parsed = JSON.parse(stored) as CartItem[];

    if (!Array.isArray(parsed)) {
      return { items: [] };
    }

    return { items: parsed };
  } catch (error) {
    console.error('Failed to parse stored cart data', error);
    return { items: [] };
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.product.id === action.product.id);

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.product.id !== action.productId),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((item) => item.product.id !== action.productId),
        };
      }

      return {
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return { items: [] };
    }

    default:
      return state;
  }
}

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  return items.reduce(
    (accumulator, item) => {
      const hasDiscount = item.product.discountedPrice < item.product.price;
      const price = hasDiscount ? item.product.discountedPrice : item.product.price;
      const lineTotal = price * item.quantity;

      return {
        totalItems: accumulator.totalItems + item.quantity,
        totalPrice: accumulator.totalPrice + lineTotal,
      };
    },
    { totalItems: 0, totalPrice: 0 }
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const { totalItems, totalPrice } = useMemo(() => calculateTotals(state.items), [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({ items: state.items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }),
    [state.items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
