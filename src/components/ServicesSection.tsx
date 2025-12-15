import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Ship, 
  Flame, 
  Coffee, 
  Building2, 
  Cookie, 
  Store 
} from 'lucide-react';

const services = [
  {
    icon: Ship,
    title: 'استيراد القهوة والشاي',
    description: 'نستورد أجود أنواع القهوة والشاي من مصادر عالمية موثوقة',
  },
  {
    icon: Flame,
    title: 'تحميص وتعبئة القهوة',
    description: 'تحميص احترافي للقهوة في محامصنا الخاصة',
  },
  {
    icon: Coffee,
    title: 'بيع أجود الأنواع',
    description: 'تشكيلة واسعة من أفضل أنواع الشاي والقهوة',
  },
  {
    icon: Building2,
    title: 'إدارة فروع الشركات',
    description: 'إدارة فروع متخصصة في المستشفيات والشركات',
  },
  {
    icon: Cookie,
    title: 'تصنيع الحلويات والفطائر',
    description: 'إنتاج أشهى الحلويات والمخبوزات الطازجة يومياً',
  },
  {
    icon: Store,
    title: 'تشغيل مقاهٍ فاخرة',
    description: 'تشغيل وإدارة مقاهٍ بطراز مميز وراقي',
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="services"
      ref={ref}
      className="section-padding bg-primary relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container-rtl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
            ما نقدمه
          </span>
          <h2 className="section-title text-primary-foreground">خدماتنا</h2>
          <p className="section-subtitle mx-auto text-center text-primary-foreground/70">
            نقدم مجموعة شاملة من الخدمات في عالم القهوة والضيافة
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6 lg:p-8 hover:bg-primary-foreground/10 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="h-7 w-7 text-coffee-dark" />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground mb-3 text-right">
                {service.title}
              </h3>
              <p className="text-primary-foreground/70 text-right leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
