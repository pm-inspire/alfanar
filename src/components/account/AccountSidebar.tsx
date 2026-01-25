import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  Bell, 
  MapPin, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountSidebarProps {
  activeItem: 'profile' | 'orders' | 'wishlist' | 'notifications' | 'addresses';
}

const menuItems = [
  { id: 'profile', icon: User, label: 'البيانات الشخصية', href: '/account/profile' },
  { id: 'orders', icon: Package, label: 'طلباتي', href: '/account/orders' },
  { id: 'wishlist', icon: Heart, label: 'المفضلة', href: '/account/wishlist' },
  { id: 'notifications', icon: Bell, label: 'الإشعارات', href: '/account/notifications', badge: 3 },
  { id: 'addresses', icon: MapPin, label: 'عناويني', href: '/account/addresses' },
];

const AccountSidebar = ({ activeItem }: AccountSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: استدعاء API لتسجيل الخروج
    // await api.logout();
    // localStorage.removeItem('token');
    console.log('Logging out...');
    navigate('/auth/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="bg-card rounded-xl border border-border p-4 shadow-soft sticky top-24">
        <h2 className="text-lg font-bold text-foreground mb-4 px-2">
          حسابي
        </h2>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors',
                activeItem === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className={cn(
                  'w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center',
                  activeItem === item.id
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-destructive text-destructive-foreground'
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-border my-2" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg w-full text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </nav>
      </div>
    </motion.div>
  );
};

export default AccountSidebar;
