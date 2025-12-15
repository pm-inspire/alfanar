import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const AnnouncementBar = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary text-primary-foreground py-2.5 text-center text-sm md:text-base"
    >
      <div className="container-rtl flex items-center justify-center gap-2">
        <Clock className="h-4 w-4 text-accent" />
        <span>
          سيتم إتاحة خدمة <span className="text-accent font-semibold">الطلب من الموقع</span> قريباً
        </span>
      </div>
    </motion.div>
  );
};

export default AnnouncementBar;
