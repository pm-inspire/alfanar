import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Send, Mail, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import cafe3 from '@/assets/cafe-3.jpg';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'الاسم مطلوب').max(100, 'الاسم طويل جداً'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح').max(255, 'البريد الإلكتروني طويل جداً'),
  phone: z.string().trim().min(1, 'رقم الهاتف مطلوب').max(20, 'رقم الهاتف غير صحيح'),
  message: z.string().trim().min(1, 'الرسالة مطلوبة').max(1000, 'الرسالة طويلة جداً'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const branches = [
  {
    id: 'main',
    name: 'الفرع الرئيسي',
    address: 'الجبيل الصناعية، حي الفناتير، شارع الملك فهد',
    phone: '+966 13 341 0000',
    hours: 'يومياً: ٦ صباحاً - ١٢ منتصف الليل',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.0!2d49.66!3d27.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDAwJzM2LjAiTiA0OcKwMzknMzYuMCJF!5e0!3m2!1sen!2ssa!4v1234567890'
  },
  {
    id: 'branch2',
    name: 'فرع الفيحاء',
    address: 'الجبيل الصناعية، حي الفيحاء، بجوار مركز التسوق',
    phone: '+966 13 342 0000',
    hours: 'يومياً: ٧ صباحاً - ١١ مساءً',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.0!2d49.67!3d27.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDAxJzEyLjAiTiA0OcKwNDAnMTIuMCJF!5e0!3m2!1sen!2ssa!4v1234567890'
  },
  {
    id: 'branch3',
    name: 'فرع الدانة',
    address: 'الجبيل الصناعية، حي الدانة، شارع الأمير سلطان',
    phone: '+966 13 343 0000',
    hours: 'يومياً: ٦ صباحاً - ١٢ منتصف الليل',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.0!2d49.68!3d27.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDAxJzQ4LjAiTiA0OcKwNDAnNDguMCJF!5e0!3m2!1sen!2ssa!4v1234567890'
  }
];

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<ContactFormData> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "تم إرسال رسالتك بنجاح",
      description: "سنتواصل معك في أقرب وقت ممكن",
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>اتصل بنا - الفنار للقهوة</title>
        <meta 
          name="description" 
          content="تواصل معنا في الفنار للقهوة، زورنا في أحد فروعنا أو راسلنا وسنرد عليك في أقرب وقت" 
        />
      </Helmet>
      
      <main className="overflow-hidden">
        <Header />
        
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <img
              src={cafe3}
              alt="تواصل معنا"
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
              نحن هنا لخدمتك
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6"
            >
              تواصل <span className="text-gradient-gold">معنا</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              نسعد بتواصلكم واستفساراتكم
            </motion.p>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="section-padding bg-background">
          <div className="container-rtl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-accent/10 rounded-full text-accent font-medium text-sm mb-4">
                  راسلنا
                </span>
                <h2 className="section-title mb-6">أرسل لنا رسالة</h2>
                <p className="text-muted-foreground mb-8">
                  أرسل لنا استفسارك أو ملاحظاتك وسنرد عليك في أقرب وقت ممكن
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-foreground mb-2">
                      <User className="w-4 h-4 ml-2 text-accent" />
                      الاسم الكامل
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك الكامل"
                      className={`bg-card border-border focus:border-accent ${errors.name ? 'border-destructive' : ''}`}
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-foreground mb-2">
                        <Mail className="w-4 h-4 ml-2 text-accent" />
                        البريد الإلكتروني
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className={`bg-card border-border focus:border-accent ${errors.email ? 'border-destructive' : ''}`}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-foreground mb-2">
                        <Phone className="w-4 h-4 ml-2 text-accent" />
                        رقم الهاتف
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+966 5X XXX XXXX"
                        className={`bg-card border-border focus:border-accent ${errors.phone ? 'border-destructive' : ''}`}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-foreground mb-2">
                      <MessageSquare className="w-4 h-4 ml-2 text-accent" />
                      رسالتك
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                      className={`bg-card border-border focus:border-accent resize-none ${errors.message ? 'border-destructive' : ''}`}
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
                    size="lg"
                  >
                    {isSubmitting ? (
                      'جاري الإرسال...'
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
                  معلومات التواصل
                </span>
                <h2 className="section-title mb-6">طرق التواصل</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">هاتف الحجز</p>
                      <p className="font-bold text-foreground">+966 13 341 0000</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                      <p className="font-bold text-foreground">info@alfanar-coffee.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ساعات العمل</p>
                      <p className="font-bold text-foreground">يومياً: ٦ صباحاً - ١٢ منتصف الليل</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Image */}
                <div className="relative rounded-2xl overflow-hidden h-48 shadow-card">
                  <img
                    src={cafe3}
                    alt="أجواء الفنار"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  <div className="absolute bottom-4 right-4 text-primary-foreground">
                    <p className="font-bold text-lg">نسعد بزيارتكم</p>
                    <p className="text-primary-foreground/80 text-sm">في أي من فروعنا</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Branches Section */}
        <section className="section-padding bg-secondary/50">
          <div className="container-rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 bg-accent/10 rounded-full text-accent font-medium text-sm mb-4">
                مواقعنا
              </span>
              <h2 className="section-title">فروعنا</h2>
              <p className="section-subtitle mx-auto mt-4">
                زورونا في أقرب فرع إليكم
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-4">
                {branches.map((branch) => (
                  <AccordionItem
                    key={branch.id}
                    value={branch.id}
                    className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-soft"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 text-right">
                        <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center flex-shrink-0 shadow-gold">
                          <MapPin className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{branch.name}</h3>
                          <p className="text-sm text-muted-foreground">{branch.address}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-accent" />
                            <span className="text-foreground">{branch.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-accent" />
                            <span className="text-foreground">{branch.hours}</span>
                          </div>
                        </div>

                        {/* Map Embed */}
                        <div className="rounded-xl overflow-hidden h-48 bg-muted">
                          <iframe
                            src={branch.mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`خريطة ${branch.name}`}
                          />
                        </div>

                        <Button
                          variant="outline"
                          className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                          onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(branch.address)}`, '_blank')}
                        >
                          <MapPin className="h-4 w-4 ml-2" />
                          فتح في خرائط جوجل
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ContactUs;
