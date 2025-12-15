import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Eye, Target, Award } from 'lucide-react';

const visionItems = [
  {
    icon: Eye,
    title: 'رؤيتنا',
    content: 'أن نرسخ مكانتنا في مجال صناعة القهوة بجميع أنواعها بمقاييس عالمية عالية الجودة',
  },
  {
    icon: Target,
    title: 'رسالتنا',
    content: 'أن نتفهم احتياجات عملائنا لتقديم أفضل أنواع القهوة في العالم مع خدمة استثنائية',
  },
  {
    icon: Award,
    title: 'أهدافنا',
    content: 'تحقيق التميز في علاقتنا مع العملاء مؤكدين مبدأ إرضاء العميل وتجاوز توقعاته',
  },
];

const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="section-padding bg-gradient-cream relative overflow-hidden"
    >
      {/* Coffee Pattern Background */}
      <div className="absolute inset-0 bg-coffee-pattern opacity-30" />
      
      <div className="container-rtl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
            نهجنا
          </span>
          <h2 className="section-title">رؤيتنا ورسالتنا</h2>
        </motion.div>

        {/* Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {visionItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * index }}
              className="bg-card rounded-3xl p-8 lg:p-10 shadow-card text-center relative overflow-hidden group"
            >
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-gold opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-10 w-10 text-coffee-dark" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {item.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
