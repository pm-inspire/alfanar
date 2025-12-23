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
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactSchema = z.object({
  name: z.string().trim().min(1, 'الاسم مطلوب').max(100, 'الاسم طويل جداً'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح').max(255, 'البريد الإلكتروني طويل جداً'),
  phone: z.string().trim().min(1, 'رقم الهاتف مطلوب').max(20, 'رقم الهاتف غير صحيح'),
  message: z.string().trim().min(1, 'الرسالة مطلوبة').max(1000, 'الرسالة طويلة جداً'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const branches = [
  {
    id: 'jubail-main',
    name: 'فرع الجبيل الرئيسي',
    address: 'شارع الملك فهد، الجبيل الصناعية',
    phone: '013-123-4567',
    hours: '٦ صباحاً - ١٢ منتصف الليل',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.7!2d49.65!3d27.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDAwJzM2LjAiTiA0OcKwMzknMDAuMCJF!5e0!3m2!1sen!2ssa!4v1234567890'
  },
  {
    id: 'jubail-north',
    name: 'فرع الجبيل الشمالي',
    address: 'حي الفناتير، شارع الأمير سلطان',
    phone: '013-234-5678',
    hours: '٧ صباحاً - ١١ مساءً',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.7!2d49.66!3d27.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDAxJzEyLjAiTiA0OcKwMzknMzYuMCJF!5e0!3m2!1sen!2ssa!4v1234567891'
  },
  {
    id: 'dammam',
    name: 'فرع الدمام',
    address: 'طريق الملك عبدالعزيز، حي الشاطئ',
    phone: '013-345-6789',
    hours: '٦ صباحاً - ١ صباحاً',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.7!2d50.10!3d26.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDI1JzQ4LjAiTiA1MMKwMDYnMDAuMCJF!5e0!3m2!1sen!2ssa!4v1234567892'
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
        <title>اتصل بنا | الفنار للقهوة</title>
        <meta 
          name="description" 
          content="تواصل معنا في الفنار للقهوة. اكتشف فروعنا ومواقعنا. نسعد بخدمتكم." 
        />
      </Helmet>
      
      <main className="overflow-hidden">
        <Header />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <motion.div 
            className="container mx-auto px-4 text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              تواصل معنا
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              نسعد بتواصلكم ونرحب باستفساراتكم واقتراحاتكم
            </p>
          </motion.div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-border hover:border-accent/30 transition-colors">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      أرسل لنا رسالة
                    </h2>
                    
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
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                          <p className="text-destructive text-sm mt-1">{errors.name}</p>
                        )}
                      </div>

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
                          className={errors.email ? 'border-destructive' : ''}
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
                          placeholder="05xxxxxxxx"
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && (
                          <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-foreground mb-2">
                          <MessageSquare className="w-4 h-4 ml-2 text-accent" />
                          الرسالة
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="اكتب رسالتك هنا..."
                          rows={5}
                          className={errors.message ? 'border-destructive' : ''}
                        />
                        {errors.message && (
                          <p className="text-destructive text-sm mt-1">{errors.message}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        variant="gold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'جارِ الإرسال...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 ml-2" />
                            إرسال الرسالة
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Info */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-card p-6 rounded-2xl border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">معلومات التواصل</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">الهاتف الموحد</p>
                        <p className="text-muted-foreground" dir="ltr">+966 13 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">البريد الإلكتروني</p>
                        <p className="text-muted-foreground">info@alfanar-coffee.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">أوقات العمل</p>
                        <p className="text-muted-foreground">يومياً من ٦ صباحاً حتى ١٢ منتصف الليل</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-primary/90 p-6 rounded-2xl text-primary-foreground">
                  <h3 className="text-xl font-bold mb-3">هل لديك اقتراح؟</h3>
                  <p className="text-primary-foreground/90 text-sm">
                    نحن نقدر آراءكم واقتراحاتكم. ساعدونا لنصبح أفضل! 
                    كل تعليق يصلنا يساهم في تحسين تجربتكم معنا.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Branches Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                فروعنا
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                نتشرف بخدمتكم في جميع فروعنا
              </p>
            </motion.div>

            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {branches.map((branch, index) => (
                  <AccordionItem 
                    key={branch.id} 
                    value={branch.id}
                    className="bg-background border border-border rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/5">
                      <div className="flex items-center gap-4 text-right">
                        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{branch.name}</h3>
                          <p className="text-muted-foreground text-sm">{branch.address}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-accent" />
                            <span className="text-foreground" dir="ltr">{branch.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-accent" />
                            <span className="text-foreground">{branch.hours}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-accent" />
                            <span className="text-foreground">{branch.address}</span>
                          </div>
                        </div>
                        <div className="h-[200px] rounded-xl overflow-hidden border border-border">
                          <iframe
                            src={branch.mapSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`خريطة ${branch.name}`}
                          />
                        </div>
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
