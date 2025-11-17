import { Link, useLocation } from 'react-router';
import { useMemo } from 'react';
import { useCart } from '../../hooks/useCart';

export function Header() {
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = useMemo(
    () => [
      { label: 'Home', to: '/' },
      { label: 'Contact', to: '/contact' },
      { label: 'Cart', to: '/cart' },
    ],
    []
  );

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Eeveelutions Shop
        </Link>

        <nav className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;

            if (link.to === '/cart') {
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 font-semibold ${
                    isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                  aria-label={`Cart with ${totalItems} item${totalItems === 1 ? '' : 's'}`}
                >
                  <span>{link.label}</span>
                  <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 text-xs font-bold bg-blue-600 text-white rounded-full">
                    {totalItems}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
