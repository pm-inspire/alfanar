import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

import menuFrenchToast from '@/assets/menu-french-toast.jpg';
import menuBrownie from '@/assets/menu-brownie.jpg';
import menuCroissant from '@/assets/menu-croissant.jpg';
import menuHalloumi from '@/assets/menu-halloumi.jpg';

const menuItems = [
  {
    id: '1',
    name: 'فرنش توست الفرنسي',
    price: 33,
    image: menuFrenchToast,
    category: 'حلويات',
  },
  {
    id: '2',
    name: 'براوني شوكلت',
    price: 28,
    image: menuBrownie,
    category: 'حلويات',
  },
  {
    id: '3',
    name: 'كرواسون بيض مميز',
    price: 31,
    image: menuCroissant,
    category: 'فطور',
  },
  {
    id: '4',
    name: 'توست حلوم وأفوكادو',
    price: 32,
    image: menuHalloumi,
    category: 'فطور',
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
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <ProductCard
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                category={item.category}
              />
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
          <Button variant="default" size="lg" className="group">
            عرض القائمة الكاملة
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
