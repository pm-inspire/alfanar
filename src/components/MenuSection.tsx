import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

import menuFrenchToast from '@/assets/menu-french-toast.jpg';
import menuBrownie from '@/assets/menu-brownie.jpg';
import menuCroissant from '@/assets/menu-croissant.jpg';
import menuHalloumi from '@/assets/menu-halloumi.jpg';

const menuItems = [
  {
    name: 'فرنش توست الفرنسي',
    price: '٣٣',
    image: menuFrenchToast,
    description: 'خبز فرنسي محمص مع العسل والتوت الطازج',
  },
  {
    name: 'براوني شوكلت',
    price: '٢٨',
    image: menuBrownie,
    description: 'براوني شوكولاتة غنية بصوص الشوكولاتة',
  },
  {
    name: 'كرواسون بيض مميز',
    price: '٣١',
    image: menuCroissant,
    description: 'كرواسون طازج مع البيض والجبن',
  },
  {
    name: 'توست حلوم وأفوكادو',
    price: '٣٢',
    image: menuHalloumi,
    description: 'خبز محمص مع جبن الحلوم والأفوكادو الطازج',
  },
];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const MenuSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Countdown state
  const [launchDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = launchDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [launchDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-primary rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[50px] md:min-w-[70px]">
        <span className="text-xl md:text-3xl font-bold text-primary-foreground tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground mt-2">{label}</span>
    </div>
  );

  return (
    <section
      id="menu"
      ref={ref}
      className="section-padding bg-background"
    >
      <div className="container-rtl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
            اكتشف مذاقنا
          </span>
          <h2 className="section-title">من قائمتنا</h2>
          <p className="section-subtitle mx-auto text-center">
            تشكيلة مميزة من أشهى المأكولات والحلويات
          </p>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover"
            >
              {/* Image */}
              <div className="relative aspect-square img-zoom">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 right-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-primary-foreground text-sm">{item.description}</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-2 text-right">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">ريال</span>
                  <span className="text-2xl font-bold text-gradient-gold">{item.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="gold" size="lg" className="group">
            عرض القائمة الكاملة
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 bg-gradient-to-l from-primary via-coffee-medium to-primary rounded-2xl p-6 md:p-10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <div className="flex items-center gap-4 text-center lg:text-right">
              <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1">
                  خدمة الطلب من الموقع
                </h3>
                <p className="text-primary-foreground/70 text-sm md:text-base">
                  قريباً... استعدوا لتجربة طلب فريدة من نوعها!
                </p>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-3 md:gap-4">
              <TimeBlock value={timeLeft.seconds} label="ثانية" />
              <span className="text-accent text-2xl font-bold mb-6">:</span>
              <TimeBlock value={timeLeft.minutes} label="دقيقة" />
              <span className="text-accent text-2xl font-bold mb-6">:</span>
              <TimeBlock value={timeLeft.hours} label="ساعة" />
              <span className="text-accent text-2xl font-bold mb-6">:</span>
              <TimeBlock value={timeLeft.days} label="يوم" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
