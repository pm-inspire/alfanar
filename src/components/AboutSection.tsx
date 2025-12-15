import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';

const stats = [
  { icon: MapPin, value: '+٢٠', label: 'فرع في المملكة' },
  { icon: Calendar, value: '+٢٣', label: 'عاماً من الخبرة' },
  { icon: Users, value: '+١M', label: 'عميل راضٍ' },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="section-padding bg-gradient-cream relative overflow-hidden"
    >
      {/* Decorative Pattern */}
      <div className="absolute inset-0 bg-coffee-pattern opacity-30" />
      
      <div className="container-rtl relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
              تعرف علينا
            </span>
            <h2 className="section-title">
              قصتنا
            </h2>
            <p className="section-subtitle text-right leading-relaxed mb-8">
              انطلقت سلسلة الفنار للقهوة عام ٢٠٠١ من مدينة الجبيل الصناعية، والتزمت منذ البداية بتقديم تجربة قهوة متميزة تجمع بين جودة المنتج وكفاءة الطاقم مما جعلها علامة تجارية موثوقة في عالم القهوة.
            </p>
            <p className="text-muted-foreground text-right leading-relaxed">
              نحرص على اختيار أجود حبوب القهوة من مختلف أنحاء العالم، ونعمل على تحميصها بعناية فائقة في محامصنا الخاصة لنقدم لكم تجربة قهوة لا تُنسى.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-soft card-hover flex items-center gap-5"
                >
                  <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
                    <stat.icon className="h-7 w-7 text-coffee-dark" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl md:text-4xl font-bold text-gradient-gold">{stat.value}</p>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
