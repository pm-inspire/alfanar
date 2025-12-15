import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';

import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

const galleryImages = [
  { src: gallery1, alt: 'باريستا يعد القهوة', span: 'col-span-1 row-span-1' },
  { src: gallery2, alt: 'ديكور المقهى الداخلي', span: 'col-span-1 row-span-2' },
  { src: gallery3, alt: 'القهوة العربية التقليدية', span: 'col-span-1 row-span-1' },
  { src: gallery4, alt: 'المعجنات الطازجة', span: 'col-span-2 row-span-1' },
  { src: gallery5, alt: 'حبوب القهوة', span: 'col-span-1 row-span-1' },
  { src: gallery6, alt: 'واجهة المقهى', span: 'col-span-1 row-span-1' },
];

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <section
      id="gallery"
      ref={ref}
      className="section-padding bg-background"
    >
      <div className="container-rtl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
            لقطاتنا
          </span>
          <h2 className="section-title">معرض الصور</h2>
          <p className="section-subtitle mx-auto text-center">
            لمحات من أجواء مقاهينا وتجربتنا المميزة
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`${image.span} rounded-2xl overflow-hidden cursor-pointer group relative`}
              onClick={() => setLightboxImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-coffee-dark/0 group-hover:bg-coffee-dark/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                  عرض الصورة
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-coffee-dark/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 left-6 text-primary-foreground hover:text-accent transition-colors"
            onClick={() => setLightboxImage(null)}
            aria-label="إغلاق"
          >
            <X className="h-8 w-8" />
          </button>
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={lightboxImage}
            alt="صورة مكبرة"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </section>
  );
};

export default GallerySection;
