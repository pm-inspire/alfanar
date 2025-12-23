import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Coffee, Heart, Users, Award, Target, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import cafe1 from '@/assets/cafe-1.jpg';
import cafe2 from '@/assets/cafe-2.jpg';

const values = [
  {
    icon: Coffee,
    title: 'الجودة',
    description: 'نختار أفضل حبوب القهوة من مصادر عالمية موثوقة لضمان تجربة استثنائية'
  },
  {
    icon: Heart,
    title: 'الشغف',
    description: 'نحب ما نقدمه ونسعى دائماً لإسعاد عملائنا بكل كوب قهوة'
  },
  {
    icon: Users,
    title: 'المجتمع',
    description: 'نؤمن بأن القهوة تجمع الناس، ونسعى لخلق مساحة دافئة للجميع'
  },
  {
    icon: Award,
    title: 'التميز',
    description: 'نلتزم بأعلى معايير الجودة في كل ما نقدمه من مشروبات ومأكولات'
  }
];

const milestones = [
  { year: '٢٠٠١', event: 'تأسيس أول فرع للفنار في الجبيل' },
  { year: '٢٠٠٨', event: 'افتتاح الفرع الثاني وتوسيع القائمة' },
  { year: '٢٠١٥', event: 'إطلاق خط القهوة المختصة' },
  { year: '٢٠٢٠', event: 'افتتاح فروع جديدة في المنطقة' },
  { year: '٢٠٢٤', event: 'إطلاق الهوية الجديدة والتوسع المستمر' }
];

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>من نحن | الفنار للقهوة</title>
        <meta 
          name="description" 
          content="تعرف على قصة الفنار للقهوة - رحلتنا من ٢٠٠١ إلى اليوم. نحن نقدم أجود أنواع القهوة بشغف وحب." 
        />
      </Helmet>
      
      <main className="overflow-hidden">
        <Header />
        
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={cafe1} 
              alt="الفنار للقهوة" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
          </div>
          
          <motion.div 
            className="relative z-10 text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
              قصتنا
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              رحلة شغف بدأت منذ أكثر من عقدين
            </p>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
                  <Sparkles className="inline w-4 h-4 ml-2" />
                  منذ ٢٠٠١
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  قهوة بطعم الأصالة
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    بدأت قصة الفنار في عام ٢٠٠١ برؤية بسيطة: تقديم قهوة استثنائية في أجواء دافئة وترحيبية. 
                    منذ ذلك الحين، أصبحنا جزءاً لا يتجزأ من مجتمعنا، نشارك الناس لحظاتهم الخاصة كوباً بعد كوب.
                  </p>
                  <p>
                    نؤمن بأن القهوة أكثر من مجرد مشروب - إنها تجربة تجمع الأصدقاء والعائلات، 
                    وتخلق ذكريات لا تُنسى. لهذا نحرص على اختيار أجود حبوب القهوة من مصادر عالمية، 
                    وتحميصها بعناية فائقة لنقدم لكم كوباً مثالياً في كل مرة.
                  </p>
                  <p>
                    فريقنا من الباريستا المحترفين يعمل بشغف لتقديم أفضل تجربة قهوة ممكنة، 
                    مع الحفاظ على الأصالة العربية والانفتاح على النكهات العالمية.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-card">
                  <img 
                    src={cafe2} 
                    alt="أجواء الفنار" 
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Target className="w-16 h-16 text-accent mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                رسالتنا
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                نسعى لأن نكون الوجهة الأولى لعشاق القهوة في المنطقة، من خلال تقديم تجربة 
                فريدة تجمع بين الجودة العالية والأجواء المميزة والخدمة الاستثنائية. نحن ملتزمون 
                بالتطوير المستمر والحفاظ على ثقة عملائنا الكرام.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                قيمنا
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                المبادئ التي نؤمن بها ونعمل وفقها كل يوم
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="bg-card p-6 rounded-2xl border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-card group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                    <value.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                رحلتنا عبر السنين
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className="flex items-center gap-6 mb-8 last:mb-0"
                  initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-gold">
                    <span className="text-lg font-bold text-accent-foreground">{milestone.year}</span>
                  </div>
                  <div className="flex-1 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-primary-foreground">{milestone.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default AboutUs;
