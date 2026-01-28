import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProfileDropdown from '@/components/ProfileDropdown';
import alfanarLogo from '@/assets/alfanar-logo.svg';
import AiSearchBar from '@/components/search/AiSearchBar';

const navLinks = [
  { name: 'الرئيسية', href: '/', isRoute: true },
  { name: 'من نحن', href: '/about', isRoute: true },
  { name: 'المنيو', href: '/#menu', isRoute: false },
  { name: 'اتصل بنا', href: '/contact', isRoute: true },
];

// TODO: استبدال هذا بحالة المستخدم الحقيقية من context أو API
// للتجربة: قم بتغيير القيمة إلى null لإظهار أزرار تسجيل الدخول
const mockUser = {
  name: 'محمد الفهد',
  phone: '+966 50 XXX XXXX',
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
            <AiSearchBar className="max-w-[520px]" />
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

            {/* Profile Dropdown / Auth Buttons */}
            <ProfileDropdown 
              user={mockUser}
              isScrolled={isScrolled}
              onLogout={() => {
                // TODO: تنفيذ عملية تسجيل الخروج
                console.log('User logged out');
              }}
            />
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
                <AiSearchBar className="w-full" />
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
                <div className="flex flex-col gap-4 pt-4 border-t border-border">
                  {/* Mobile Profile Section */}
                  {mockUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-accent-foreground font-bold">
                            {mockUser.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{mockUser.name}</p>
                          <p className="text-sm text-muted-foreground" dir="ltr">{mockUser.phone}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/account/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm text-foreground hover:text-accent p-2 bg-secondary rounded-lg text-center"
                        >
                          حسابي
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm text-foreground hover:text-accent p-2 bg-secondary rounded-lg text-center"
                        >
                          طلباتي
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm text-foreground hover:text-accent p-2 bg-secondary rounded-lg text-center"
                        >
                          السلة
                        </Link>
                        <Link
                          to="/account/wishlist"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm text-foreground hover:text-accent p-2 bg-secondary rounded-lg text-center"
                        >
                          المفضلة
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link to="/auth/login" className="flex-1">
                        <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Link to="/auth/register" className="flex-1">
                        <Button variant="gold" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          تسجيل جديد
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {/* Language Toggle */}
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-muted-foreground text-sm">اللغة</span>
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 ml-2" />
                      AR/EN
                    </Button>
                  </div>
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
