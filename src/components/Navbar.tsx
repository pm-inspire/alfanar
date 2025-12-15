import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'الرئيسية', href: '#home' },
  { name: 'من نحن', href: '#about' },
  { name: 'المنيو', href: '#menu' },
  { name: 'اتصل بنا', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-effect shadow-soft py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-rtl flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <h1 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-primary' : 'text-primary-foreground'
          }`}>
            الفنار
            <span className="text-gradient-gold"> للقهوة</span>
          </h1>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.button
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => scrollToSection(link.href)}
              className={`gold-underline text-base font-medium transition-colors duration-300 ${
                isScrolled
                  ? 'text-foreground hover:text-accent'
                  : 'text-primary-foreground hover:text-accent'
              }`}
            >
              {link.name}
            </motion.button>
          ))}
          
          {/* Language Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
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
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden ${
            isScrolled
              ? 'text-foreground'
              : 'text-primary-foreground'
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
            className="md:hidden glass-effect border-t border-border/50"
          >
            <div className="container-rtl py-6 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground text-lg font-medium py-2 text-right hover:text-accent transition-colors"
                >
                  {link.name}
                </motion.button>
              ))}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
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
  );
};

export default Navbar;
