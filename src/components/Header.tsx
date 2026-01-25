import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ShoppingCart, User, LogOut, Package, Heart, Bell, MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import alfanarLogo from '@/assets/alfanar-logo.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: 'الرئيسية', href: '/', isRoute: true },
  { name: 'من نحن', href: '/about', isRoute: true },
  { name: 'المنيو', href: '/#menu', isRoute: false },
  { name: 'اتصل بنا', href: '/contact', isRoute: true },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Mock auth state
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string, isRoute: boolean) => {
    if (!isRoute && href.includes('#')) {
      const hash = href.split('#')[1];
      if (location.pathname === '/') {
        const element = document.querySelector(`#${hash}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = href;
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-soft py-3'
            : 'bg-primary/90 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container-rtl flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={alfanarLogo} 
              alt="الفنار للقهوة" 
              className={`h-10 md:h-12 w-auto transition-all duration-300 ${
                isScrolled ? '' : 'brightness-0 invert'
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`gold-underline text-base font-medium transition-colors duration-300 ${
                    isScrolled
                      ? 'text-foreground hover:text-accent'
                      : 'text-primary-foreground hover:text-accent'
                  } ${location.pathname === link.href ? 'text-accent' : ''}`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href, link.isRoute)}
                  className={`gold-underline text-base font-medium transition-colors duration-300 ${
                    isScrolled
                      ? 'text-foreground hover:text-accent'
                      : 'text-primary-foreground hover:text-accent'
                  }`}
                >
                  {link.name}
                </button>
              )
            ))}
            
            <div className="h-6 w-px bg-border/50 mx-2" />

            {/* Cart Icon */}
            <Link to="/cart" className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  isScrolled
                    ? 'text-foreground hover:bg-accent/20'
                    : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  2
                </span>
              </Button>
            </Link>

            {/* User Dropdown or Login Button */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full ${
                      isScrolled
                        ? 'text-foreground hover:bg-accent/20'
                        : 'text-primary-foreground hover:bg-primary-foreground/10'
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56" dir="rtl">
                  <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account/profile" className="cursor-pointer">
                      <User className="ml-2 h-4 w-4" />
                      البيانات الشخصية
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/orders" className="cursor-pointer">
                      <Package className="ml-2 h-4 w-4" />
                      طلباتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/wishlist" className="cursor-pointer">
                      <Heart className="ml-2 h-4 w-4" />
                      المفضلة
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/addresses" className="cursor-pointer">
                      <MapPin className="ml-2 h-4 w-4" />
                      عناويني
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/notifications" className="cursor-pointer">
                      <Bell className="ml-2 h-4 w-4" />
                      الإشعارات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant={isScrolled ? "default" : "secondary"} size="sm">
                <Link to="/auth/login">تسجيل الدخول</Link>
              </Button>
            )}

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                isScrolled
                  ? 'text-foreground hover:bg-accent/20'
                  : 'text-primary-foreground hover:bg-primary-foreground/10'
              }`}
              aria-label="تبديل اللغة"
            >
              <Globe className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  isScrolled
                    ? 'text-foreground'
                    : 'text-primary-foreground'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  2
                </span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border overflow-hidden"
            >
              <div className="container-rtl py-6 flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  link.isRoute ? (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block text-foreground text-lg font-medium py-2 text-right hover:text-accent transition-colors ${
                          location.pathname === link.href ? 'text-accent' : ''
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.button
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      onClick={() => handleNavClick(link.href, link.isRoute)}
                      className="text-foreground text-lg font-medium py-2 text-right hover:text-accent transition-colors"
                    >
                      {link.name}
                    </motion.button>
                  )
                ))}
                
                <div className="border-t border-border pt-4 space-y-2">
                  {isLoggedIn ? (
                    <>
                      <Link to="/account/profile" className="block py-2 text-right text-foreground hover:text-accent">
                        الملف الشخصي
                      </Link>
                      <Link to="/account/orders" className="block py-2 text-right text-foreground hover:text-accent">
                        طلباتي
                      </Link>
                      <button onClick={handleLogout} className="block w-full text-right py-2 text-red-500 hover:text-red-600">
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <Link to="/auth/login" className="block py-2 text-right text-foreground hover:text-accent">
                      تسجيل الدخول
                    </Link>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <span className="text-muted-foreground text-sm">اللغة</span>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 ml-2" />
                    AR/EN
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};

export default Header;
