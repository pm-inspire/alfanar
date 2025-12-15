import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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

const MenuSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
      </div>
    </section>
  );
};

export default MenuSection;
