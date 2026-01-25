import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MenuSection from '@/components/MenuSection';
import ServicesSection from '@/components/ServicesSection';
import VisionSection from '@/components/VisionSection';
import GallerySection from '@/components/GallerySection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>الفنار للقهوة | تجربة قهوة استثنائية منذ ٢٠٠١</title>
        <meta 
          name="description" 
          content="الفنار للقهوة - سلسلة مقاهٍ سعودية رائدة تقدم أجود أنواع القهوة العربية والعالمية منذ عام ٢٠٠١. اكتشف تجربة قهوة استثنائية." 
        />
        <meta name="keywords" content="قهوة, مقهى, الفنار, قهوة عربية, كوفي شوب, السعودية, الجبيل" />
        <meta property="og:title" content="الفنار للقهوة | تجربة قهوة استثنائية" />
        <meta property="og:description" content="نقدم لكم أجود أنواع القهوة العربية والعالمية منذ ٢٠٠١" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://alfanar-coffee.com" />
      </Helmet>
      
      <div className="overflow-hidden">
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <ServicesSection />
        <VisionSection />
        <GallerySection />
      </div>
    </>
  );
};

export default Index;
