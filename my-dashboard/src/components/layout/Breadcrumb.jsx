// ========================================
// 🎯 ENHANCED BREADCRUMB COMPONENT
// ========================================

import { useLocation, Link } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const Breadcrumb = ({ path = [], customPath = null }) => {
  const location = useLocation();

  // Use custom path or generate from location
  const breadcrumbPath = customPath || generateBreadcrumbPath(location.pathname);

  // Generate breadcrumb path from URL
  function generateBreadcrumbPath(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    const pathMap = {
      'user-dashboard': 'Dashboard',
      'admin-dashboard': 'Admin',
      'partner-dashboard': 'Partner',
      'calendar': 'Calendar',
      'tasks': 'Tasks',
      'demo': 'Demo',
    };

    return segments.map(segment => ({
      name: pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: segment,
      isActive: segments.indexOf(segment) === segments.length - 1,
    }));
  }

  // Don't show breadcrumb if no path
  if (breadcrumbPath.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1 text-sm font-medium text-white/80"
      aria-label="Breadcrumb"
    >
      {/* Home Icon */}
      <Link
        to="/"
        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/20 transition-colors duration-200"
        title="Home"
      >
        <HiHome className="w-4 h-4" />
      </Link>

      {/* Breadcrumb Items */}
      {breadcrumbPath.map((segment, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <HiChevronRight className="w-4 h-4 text-white/60" />
          {segment.isActive ? (
            <span className="text-white font-semibold px-2 py-1 rounded-md bg-white/10">
              {segment.name}
            </span>
          ) : (
            <Link
              to={`/${breadcrumbPath.slice(0, idx + 1).map(s => s.path).join('/')}`}
              className="px-2 py-1 rounded-md hover:bg-white/20 transition-colors duration-200 text-white/80 hover:text-white"
            >
              {segment.name}
            </Link>
          )}
        </div>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;
