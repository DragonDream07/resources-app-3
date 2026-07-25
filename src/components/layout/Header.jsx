import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logoSrc from '@/assets/images/logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import bellIcon from '@/assets/icons/bell.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const cartItemCount = useSelector((state) =>
    state.cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0
  );
  const unreadNotificationCount = useSelector(
    (state) => state.notifications?.unreadCount ?? 0
  );
  const isAuthenticated = useSelector((state) => !!state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function handleLogout() {
    setAccountMenuOpen(false);
    // Dispatch logout or clear store — placeholder dispatch
    navigate('/auth/login');
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl"
            role="search"
          >
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <img src={searchIcon} alt="" className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <nav className="flex items-center gap-4" aria-label="Utility navigation">
            {/* Notification Bell */}
            {isAuthenticated && (
              <Link
                to="/account/notifications"
                className="relative p-1 text-gray-600 hover:text-indigo-600"
                aria-label={`Notifications${unreadNotificationCount > 0 ? `, ${unreadNotificationCount} unread` : ''}`}
              >
                <img src={bellIcon} alt="" className="h-6 w-6" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-1">
                    {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-1 text-gray-600 hover:text-indigo-600"
              aria-label={`Cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ''}`}
            >
              <img src={cartIcon} alt="" className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-1">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Account Menu */}
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 p-1 text-gray-600 hover:text-indigo-600"
                aria-haspopup="true"
                aria-expanded={accountMenuOpen}
                aria-label="Account menu"
              >
                <img src={userIcon} alt="" className="h-6 w-6" />
                {isAuthenticated && user?.firstName && (
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.firstName}
                  </span>
                )}
                <img src={chevronDownIcon} alt="" className="h-4 w-4" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/account/addresses"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Addresses
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
