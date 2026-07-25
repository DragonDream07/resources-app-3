import { NavLink } from 'react-router-dom';
import packageIcon from '@/assets/icons/package.svg';
import userIcon from '@/assets/icons/user.svg';
import starIcon from '@/assets/icons/star.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import bellIcon from '@/assets/icons/bell.svg';
import logoSrc from '@/assets/images/logo.svg';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: starIcon,
    end: true,
  },
  {
    label: 'Orders',
    to: '/admin/orders',
    icon: packageIcon,
  },
  {
    label: 'Products',
    to: '/admin/catalogue/products',
    icon: packageIcon,
  },
  {
    label: 'Categories',
    to: '/admin/catalogue/categories',
    icon: mapPinIcon,
  },
  {
    label: 'Brands',
    to: '/admin/catalogue/brands',
    icon: starIcon,
  },
  {
    label: 'Promotions',
    to: '/admin/promotions',
    icon: starIcon,
  },
  {
    label: 'Returns',
    to: '/admin/returns',
    icon: packageIcon,
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: userIcon,
  },
  {
    label: 'Reports',
    to: '/admin/reports',
    icon: bellIcon,
  },
];

function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col flex-shrink-0">
      {/* Sidebar header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <img src={logoSrc} alt="Logo" className="h-7 w-auto" />
        <span className="font-semibold text-white text-sm">Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin navigation">
        <ul className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  ].join(' ')
                }
              >
                <img src={item.icon} alt="" className="h-4 w-4 opacity-75" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
