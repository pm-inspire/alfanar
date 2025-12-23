import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Coffee, Heart, Users, Award, Target, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import cafe1 from '@/assets/cafe-1.jpg';
import cafe2 from '@/assets/cafe-2.jpg';

const values = [
  {
    icon: Coffee,
    title: 'الجودة',
    description: 'نختار أجود أنواع حبوب البن من أفضل المزارع حول العالم'
  },
  {
    icon: Heart,
    title: 'الشغف',
    description: 'نحب ما نقدمه ونسعى دائماً لتقديم تجربة مميزة'
  },
  {
    icon: Users,
    title: 'الضيافة',
    description: 'نستقبل كل ضيف كأنه فرد من العائلة بكل حب وترحاب'
  },
  {
    icon: Award,
    title: 'التميز',
    description: 'نسعى للتميز في كل تفاصيل ما نقدمه من خدمة ومنتجات'
  }
];

const timeline = [
  { year: '٢٠٠١', title: 'البداية', description: 'افتتاح أول فرع في الجبيل الصناعية' },
  { year: '٢٠٠٨', title: 'التوسع', description: 'افتتاح الفرع الثاني وتوسيع قائمة الطعام' },
  { year: '٢٠١٥', title: 'التطوير', description: 'تحديث الهوية البصرية وإضافة خدمات جديدة' },
  { year: '٢٠٢٣', title: 'الحاضر', description: 'نستمر في النمو مع الحفاظ على جودتنا العالية' }
];

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>من نحن - الفنار للقهوة</title>
        <meta 
          name="description" 
          content="تعرف على قصة الفنار للقهوة، رحلتنا منذ عام ٢٠٠١ في تقديم أجود أنواع القهوة العربية والعالمية" 
        />
      </Helmet>
      
      <main className="overflow-hidden">
        <Header />
        
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <img 
              src={cafe1} 
              alt="أجواء مقهى الفنار" 
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, hsla(355, 52%, 10%, 0.7) 0%, hsla(355, 52%, 15%, 0.85) 100%)',
              }}
            />
          </div>
          
          <div className="relative z-10 container-rtl text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-6 py-2 bg-accent/20 backdrop-blur-sm rounded-full text-accent font-medium text-sm mb-6"
            >
              تعرف علينا
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6"
            >
              قصتنا مع <span className="text-gradient-gold">القهوة</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              رحلة من الشغف والتميز تمتد لأكثر من عقدين
            </motion.p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="section-padding bg-background">
          <div className="container-rtl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-accent/10 rounded-full text-accent font-medium text-sm mb-4">
                  قصتنا
                </span>
                <h2 className="section-title mb-6">
                  رحلة <span className="text-gradient-gold">الفنار</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    بدأت قصة الفنار للقهوة في عام ٢٠٠١ في مدينة الجبيل الصناعية، حيث كانت الرؤية واضحة منذ اليوم الأول: تقديم تجربة قهوة استثنائية تجمع بين الأصالة العربية والحداثة العالمية.
                  </p>
                  <p>
                    على مدار أكثر من عقدين، نمت الفنار من مقهى صغير إلى وجهة مفضلة لعشاق القهوة، محافظين على التزامنا الراسخ بالجودة والضيافة الحقيقية.
                  </p>
                  <p>
                    نفتخر بأن نكون جزءاً من مجتمعنا، نستقبل ضيوفنا بابتسامة ونقدم لهم لحظات من السعادة مع كل فنجان قهوة.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-card">
                  <img
                    src={cafe2}
                    alt="داخل مقهى الفنار"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section-padding bg-secondary/50">
          <div className="container-rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">رؤيتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  أن نكون الوجهة الأولى لعشاق القهوة في المنطقة الشرقية، نقدم تجربة فريدة تجمع بين الجودة العالية والأجواء الدافئة والخدمة المتميزة.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">رسالتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  نسعى لإسعاد ضيوفنا من خلال تقديم أجود أنواع القهوة والمأكولات في أجواء مريحة، مع فريق عمل شغوف يضع رضا العميل في المقام الأول.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-background">
          <div className="container-rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 bg-accent/10 rounded-full text-accent font-medium text-sm mb-4">
                ما يميزنا
              </span>
              <h2 className="section-title">قيمنا</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 text-center shadow-soft border border-border/50 card-hover"
                >
                  <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-gold">
                    <value.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding bg-primary">
          <div className="container-rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 bg-accent/20 rounded-full text-accent font-medium text-sm mb-4">
                رحلتنا
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
                محطات في <span className="text-gradient-gold">مسيرتنا</span>
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-0 bottom-0 right-1/2 w-0.5 bg-accent/30 hidden md:block" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
                        <span className="text-accent font-bold text-2xl">{item.year}</span>
                        <h3 className="text-xl font-bold text-primary-foreground mt-2">{item.title}</h3>
                        <p className="text-primary-foreground/70 mt-2">{item.description}</p>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="hidden md:flex w-4 h-4 bg-accent rounded-full flex-shrink-0 shadow-gold" />

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default AboutUs;
