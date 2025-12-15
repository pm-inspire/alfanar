import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cafe1 from '@/assets/cafe-1.jpg';

const HeroSection = () => {
  const scrollToMenu = () => {
    const element = document.querySelector('#menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={cafe1}
          alt="أجواء مقهى الفنار"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, hsla(355, 52%, 10%, 0.6) 0%, hsla(355, 52%, 15%, 0.8) 100%)',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-coffee-pattern"
      />

      {/* Content */}
      <div className="relative z-10 container-rtl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-2 bg-accent/20 backdrop-blur-sm rounded-full text-accent font-medium text-sm md:text-base">
            منذ عام ٢٠٠١
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
        >
          تجربة قهوة
          <span className="block text-gradient-gold">استثنائية</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl lg:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
        >
          نقدم لكم أجود أنواع القهوة العربية والعالمية
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="hero"
            size="xl"
            onClick={scrollToMenu}
            className="min-w-[200px]"
          >
            استكشف المنيو
          </Button>
          <Button
            variant="outline-light"
            size="lg"
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            اكتشف قصتنا
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-primary-foreground/60"
        >
          <span className="text-sm">اكتشف المزيد</span>
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
