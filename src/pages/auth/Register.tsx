import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import alfanarLogo from '@/assets/alfanar-logo.svg';

interface FormData {
  phone: string;
  otp: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  phone?: string;
  otp?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    otp: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);

  const steps = [
    { number: 1, title: 'رقم الجوال' },
    { number: 2, title: 'كود التحقق' },
    { number: 3, title: 'البيانات الشخصية' },
  ];

  const validatePhone = (value: string): boolean => {
    const phoneRegex = /^(05|5|\+9665)\d{8}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  };

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الجوال مطلوب';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'رقم الجوال غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.otp || formData.otp.length < 4) {
      newErrors.otp = 'الرجاء إدخال كود التحقق كاملاً';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'يجب الموافقة على الشروط والأحكام';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: استدعاء API لإرسال كود التحقق
      // await api.sendOtp({ phone: formData.phone });
      console.log('Sending OTP to:', formData.phone);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep(2);
      startResendCountdown();
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إرسال كود التحقق' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: استدعاء API للتحقق من الكود
      // await api.verifyOtp({ phone: formData.phone, otp: formData.otp });
      console.log('Verifying OTP:', formData.otp);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep(3);
    } catch (error) {
      setErrors({ otp: 'كود التحقق غير صحيح' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: استدعاء API للتسجيل
      // const response = await api.register({
      //   phone: formData.phone,
      //   fullName: formData.fullName,
      //   email: formData.email,
      //   password: formData.password,
      // });
      console.log('Registering user:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: حفظ token وتوجيه المستخدم
      // localStorage.setItem('token', response.token);
      // navigate('/');
      
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء التسجيل، الرجاء المحاولة لاحقاً' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    setIsLoading(true);
    try {
      // TODO: استدعاء API لإعادة إرسال الكود
      // await api.resendOtp({ phone: formData.phone });
      console.log('Resending OTP to:', formData.phone);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      startResendCountdown();
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إرسال كود التحقق' });
    } finally {
      setIsLoading(false);
    }
  };

  const startResendCountdown = () => {
    setCanResendOtp(false);
    setResendCountdown(60);
    
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResendOtp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-block">
              <img 
                src={alfanarLogo} 
                alt="الفنار" 
                className="h-14 w-auto mx-auto mb-4"
              />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">تسجيل حساب جديد</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-1 mx-2 rounded transition-colors ${
                        currentStep > step.number ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              الخطوة {currentStep} من 3: {steps[currentStep - 1].title}
            </p>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm">{errors.general}</p>
            </motion.div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Phone Number */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    رقم الجوال
                  </Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="05xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className={`pr-10 text-right ${errors.phone ? 'border-destructive' : ''}`}
                      dir="ltr"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone}</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-coffee-dark/30 border-t-coffee-dark rounded-full animate-spin" />
                      جاري الإرسال...
                    </span>
                  ) : (
                    'إرسال كود التحقق'
                  )}
                </Button>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    تم إرسال كود التحقق إلى رقم {formData.phone}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground block text-center">
                    كود التحقق
                  </Label>
                  <div className="flex justify-center" dir="ltr">
                    <InputOTP
                      maxLength={6}
                      value={formData.otp}
                      onChange={(value) => updateFormData('otp', value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {errors.otp && (
                    <p className="text-destructive text-sm text-center">{errors.otp}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 border-2 border-coffee-dark/30 border-t-coffee-dark rounded-full animate-spin" />
                        جاري التحقق...
                      </span>
                    ) : (
                      'تأكيد الكود'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={!canResendOtp || isLoading}
                    className="text-muted-foreground"
                  >
                    {canResendOtp ? (
                      'إعادة إرسال الكود'
                    ) : (
                      `إعادة الإرسال بعد ${resendCountdown} ثانية`
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 ml-2" />
                    تعديل رقم الجوال
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Complete Profile */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
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
                      placeholder="أدخل اسمك الكامل"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      className={`pr-10 ${errors.fullName ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-destructive text-sm">{errors.fullName}</p>
                  )}
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
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`pr-10 text-left ${errors.email ? 'border-destructive' : ''}`}
                      dir="ltr"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="أدخل كلمة المرور"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className={`pr-10 pl-10 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="أعد إدخال كلمة المرور"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className={`pr-10 pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => updateFormData('acceptTerms', checked as boolean)}
                      className={errors.acceptTerms ? 'border-destructive' : ''}
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                    >
                      بالضغط على تسجيل فإنك توافق على{' '}
                      <Link to="/privacy-policy" className="text-primary hover:underline">
                        سياسة الخصوصية
                      </Link>{' '}
                      و{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        الشروط والأحكام
                      </Link>
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-destructive text-sm">{errors.acceptTerms}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="button"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={handleRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 border-2 border-coffee-dark/30 border-t-coffee-dark rounded-full animate-spin" />
                        جاري التسجيل...
                      </span>
                    ) : (
                      'تسجيل'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 ml-2" />
                    الرجوع
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Link */}
          <div className="mt-6 text-center border-t border-border pt-6">
            <p className="text-muted-foreground">
              لديك حساب بالفعل؟{' '}
              <Link
                to="/auth/login"
                className="text-primary font-semibold hover:text-accent transition-colors"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
