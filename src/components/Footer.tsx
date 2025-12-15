import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Instagram,
  Twitter,
} from 'lucide-react';
import alfanarLogo from '@/assets/alfanar-logo.svg';

const quickLinks = [
  { name: 'الرئيسية', href: '#home' },
  { name: 'من نحن', href: '#about' },
  { name: 'المنيو', href: '#menu' },
  { name: 'خدماتنا', href: '#services' },
  { name: 'معرض الصور', href: '#gallery' },
];

const contactInfo = [
  { icon: MapPin, text: 'الجبيل الصناعية، المملكة العربية السعودية' },
  { icon: Phone, text: '+966 XX XXX XXXX' },
  { icon: Mail, text: 'info@alfanar-coffee.com' },
  { icon: Clock, text: 'يومياً: ٦ صباحاً - ١٢ منتصف الليل' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'انستغرام' },
  { icon: Twitter, href: '#', label: 'تويتر' },
];

const Footer = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-primary pt-16 pb-8">
      <div className="container-rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <img 
              src={alfanarLogo} 
              alt="الفنار للقهوة" 
              className="h-16 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              منذ عام ٢٠٠١ نقدم لكم أجود أنواع القهوة العربية والعالمية مع التزامنا الدائم بالجودة والتميز.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-primary-foreground mb-6">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-primary-foreground/70 hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-lg font-bold text-primary-foreground mb-6">
              تواصل معنا
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-primary-foreground/70 pt-2">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-primary-foreground/10 pt-8 text-center"
        >
          <p className="text-primary-foreground/60">
            © ٢٠٢٥ الفنار للقهوة. جميع الحقوق محفوظة
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
