import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';

interface ProfileData {
  fullName: string;
  phone: string;
  email: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: 'محمد الفهد',
    phone: '0501234567',
    email: 'mohammed@example.com',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profile.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(profile.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // TODO: استدعاء API لتحديث البيانات
      // await api.updateProfile(profile);
      console.log('Updating profile:', profile);

      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('تم حفظ التغييرات بنجاح');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ fullName: 'حدث خطأ أثناء الحفظ' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <AccountSidebar activeItem="profile" />

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft"
              >
                <h1 className="text-2xl font-bold text-foreground mb-6">
                  البيانات الشخصية
                </h1>

                {/* Success Message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800">{successMessage}</p>
                  </motion.div>
                )}

                <div className="space-y-6 max-w-xl">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">
                      الاسم الكامل
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => updateProfile('fullName', e.target.value)}
                        className={`pr-10 ${errors.fullName ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-destructive text-sm">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone (Readonly) */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      رقم الجوال
                    </Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        disabled
                        className="pr-10 text-left bg-muted"
                        dir="ltr"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      لا يمكن تغيير رقم الجوال
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className={`pr-10 text-left ${errors.email ? 'border-destructive' : ''}`}
                        dir="ltr"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-destructive text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Save Button */}
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 border-2 border-coffee-dark/30 border-t-coffee-dark rounded-full animate-spin" />
                        جاري الحفظ...
                      </span>
                    ) : (
                      <>
                        <Save className="h-5 w-5 ml-2" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
