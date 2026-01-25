import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  Heart, 
  Bell, 
  MapPin, 
  LogOut,
  ChevronDown,
  ShoppingCart
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ProfileDropdownProps {
  user?: {
    name: string;
    phone?: string;
  } | null;
  isScrolled?: boolean;
  onLogout?: () => void;
}

const menuItems = [
  { 
    icon: User, 
    label: 'البيانات الشخصية', 
    href: '/account/profile' 
  },
  { 
    icon: Package, 
    label: 'طلباتي', 
    href: '/account/orders' 
  },
  { 
    icon: Heart, 
    label: 'المفضلة', 
    href: '/account/wishlist' 
  },
  { 
    icon: Bell, 
    label: 'الإشعارات', 
    href: '/account/notifications',
    badge: 3, // عدد الإشعارات غير المقروءة
  },
  { 
    icon: MapPin, 
    label: 'عناويني', 
    href: '/account/addresses' 
  },
];

const ProfileDropdown = ({ user, isScrolled = false, onLogout }: ProfileDropdownProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: استدعاء API لتسجيل الخروج
    // await api.logout();
    console.log('Logging out...');
    
    // TODO: مسح التوكن من localStorage
    // localStorage.removeItem('token');
    
    if (onLogout) {
      onLogout();
    }
    
    navigate('/auth/login');
  };

  // عرض أزرار تسجيل الدخول إذا لم يكن المستخدم مسجل
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {/* Cart Icon for non-logged users */}
        <Link to="/cart">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isScrolled
                ? 'text-foreground hover:bg-accent/20'
                : 'text-primary-foreground hover:bg-primary-foreground/10'
            }`}
            aria-label="سلة التسوق"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </Link>
        
        <Link to="/auth/login">
          <Button
            variant={isScrolled ? 'outline' : 'outline-light'}
            size="sm"
          >
            تسجيل الدخول
          </Button>
        </Link>
      </div>
    );
  }

  // الحصول على الاسم الأول
  const firstName = user.name.split(' ')[0];

  return (
    <div className="flex items-center gap-2">
      {/* Cart Icon */}
      <Link to="/cart">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full relative ${
            isScrolled
              ? 'text-foreground hover:bg-accent/20'
              : 'text-primary-foreground hover:bg-primary-foreground/10'
          }`}
          aria-label="سلة التسوق"
        >
          <ShoppingCart className="h-5 w-5" />
          {/* Badge for cart items count */}
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
      </Link>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`flex items-center gap-2 px-3 py-2 rounded-full ${
              isScrolled
                ? 'text-foreground hover:bg-accent/20'
                : 'text-primary-foreground hover:bg-primary-foreground/10'
            }`}
          >
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="hidden sm:inline font-medium">{firstName}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="start" 
          className="w-56 bg-popover border border-border shadow-lg"
          sideOffset={8}
        >
          {/* User Info */}
          <DropdownMenuLabel className="text-right">
            <p className="font-bold text-foreground">{user.name}</p>
            {user.phone && (
              <p className="text-sm text-muted-foreground font-normal" dir="ltr">
                {user.phone}
              </p>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Menu Items */}
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link 
                to={item.href}
                className="flex items-center gap-3 cursor-pointer text-right w-full px-2 py-2"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-3 cursor-pointer text-right text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDropdown;
