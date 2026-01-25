import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, LogOut, Heart, Bell, MapPin, ClipboardList, UserCircle, ShoppingCart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import alfanarLogo from '@/assets/alfanar-logo.svg';
import { clearDemoUser, getDemoUser, subscribeDemoAuth } from '@/lib/demoAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { name: 'الرئيسية', href: '/', isRoute: true },
  { name: 'من نحن', href: '/about', isRoute: true },
  { name: 'المنيو', href: '/#menu', isRoute: false },
  { name: 'المتجر', href: '/shop', isRoute: true },
  { name: 'السلة', href: '/cart', isRoute: true },
  { name: 'اتصل بنا', href: '/contact', isRoute: true },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [demoUser, setDemoUserState] = useState(() => {
    try {
      return getDemoUser();
    } catch {
      return null;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return subscribeDemoAuth(() => {
      setDemoUserState(getDemoUser());
    });
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

  const onLogout = () => {
    // TODO(auth): replace with real logout API + clear session/token.
    clearDemoUser();
    setIsMobileMenuOpen(false);
    navigate('/auth/login');
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
          <div className="hidden md:flex items-center gap-8">
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

            {/* Profile / Auth */}
            {demoUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`rounded-full px-3 ${
                      isScrolled
                        ? 'text-foreground hover:bg-accent/20'
                        : 'text-primary-foreground hover:bg-primary-foreground/10'
                    }`}
                    aria-label="قائمة الملف الشخصي"
                  >
                    <User className="h-4 w-4 ml-2" />
                    {demoUser.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="text-right">حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="justify-end">
                    <Link to="/account/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between gap-2 w-full">
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      <span>البيانات الشخصية</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="justify-end">
                    <Link to="/account/orders" className="flex items-center justify-between gap-2 w-full">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>طلباتي</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="justify-end">
                    <Link to="/account/wishlist" className="flex items-center justify-between gap-2 w-full">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>المفضلة</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="justify-end">
                    <Link to="/account/notifications" className="flex items-center justify-between gap-2 w-full">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>الإشعارات</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="justify-end">
                    <Link to="/account/addresses" className="flex items-center justify-between gap-2 w-full">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>عناويني</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="justify-end text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className={`rounded-full font-bold ${
                  isScrolled ? 'bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-gold' : 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                }`}
              >
                <Link to="/auth/login">تسجيل الدخول</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
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

                {/* Auth shortcuts (mobile) */}
                <div className="pt-2 border-t border-border">
                  {demoUser ? (
                    <div className="space-y-2">
                      <div className="text-right text-sm font-semibold text-foreground">
                        مرحباً، {demoUser.firstName}
                      </div>
                      <Link
                        to="/account/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-foreground hover:border-accent transition"
                      >
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        <span>البيانات الشخصية</span>
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-foreground hover:border-accent transition"
                      >
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span>السلة</span>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={onLogout}
                      >
                        تسجيل الخروج
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        asChild
                        className="bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/auth/login">تسجيل الدخول</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/auth/register">تسجيل جديد</Link>
                      </Button>
                    </div>
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
