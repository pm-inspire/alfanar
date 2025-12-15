import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const AnnouncementBar = () => {
  // Set launch date - 30 days from now (you can change this)
  const [launchDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = launchDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-2.5 py-1.5 md:px-4 md:py-2 min-w-[40px] md:min-w-[56px]">
        <span className="text-lg md:text-2xl font-bold text-accent tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] md:text-xs text-primary-foreground/70 mt-1">{label}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-l from-primary via-coffee-medium to-primary py-4 md:py-5"
    >
      <div className="container-rtl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* Text */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-accent" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-primary-foreground font-bold text-base md:text-lg">
                خدمة الطلب من الموقع
              </p>
              <p className="text-primary-foreground/70 text-sm">
                قريباً... استعدوا لتجربة فريدة!
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2 md:gap-3">
            <TimeBlock value={timeLeft.seconds} label="ثانية" />
            <span className="text-accent text-xl font-bold mb-4">:</span>
            <TimeBlock value={timeLeft.minutes} label="دقيقة" />
            <span className="text-accent text-xl font-bold mb-4">:</span>
            <TimeBlock value={timeLeft.hours} label="ساعة" />
            <span className="text-accent text-xl font-bold mb-4">:</span>
            <TimeBlock value={timeLeft.days} label="يوم" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementBar;
