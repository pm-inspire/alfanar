import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { cn } from '@/lib/utils';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  isDefault: boolean;
}

// بيانات وهمية للعناوين
const mockAddresses: Address[] = [
  {
    id: '1',
    label: 'المنزل',
    street: 'شارع الأمير محمد بن فهد، مبنى رقم 5، شقة 3',
    city: 'الجبيل الصناعية',
    isDefault: true,
  },
  {
    id: '2',
    label: 'العمل',
    street: 'شارع الملك عبدالعزيز، برج الأعمال، الطابق 12',
    city: 'الدمام',
    isDefault: false,
  },
];

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.label.trim()) newErrors.label = 'اسم العنوان مطلوب';
    if (!formData.street.trim()) newErrors.street = 'الشارع مطلوب';
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    if (!validateForm()) return;

    // TODO: استدعاء API لإضافة العنوان
    // const response = await api.addAddress(formData);
    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
      isDefault: addresses.length === 0,
    };

    setAddresses(prev => [...prev, newAddress]);
    setIsAdding(false);
    setFormData({ label: '', street: '', city: '' });
  };

  const handleEditAddress = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city,
    });
  };

  const handleSaveEdit = () => {
    if (!validateForm()) return;

    // TODO: استدعاء API لتحديث العنوان
    // await api.updateAddress(editingId, formData);
    setAddresses(prev =>
      prev.map(a =>
        a.id === editingId ? { ...a, ...formData } : a
      )
    );
    setEditingId(null);
    setFormData({ label: '', street: '', city: '' });
  };

  const handleDeleteAddress = (addressId: string) => {
    // TODO: استدعاء API لحذف العنوان
    // await api.deleteAddress(addressId);
    setAddresses(prev => prev.filter(a => a.id !== addressId));
  };

  const handleSetDefault = (addressId: string) => {
    // TODO: استدعاء API لتعيين العنوان الافتراضي
    // await api.setDefaultAddress(addressId);
    setAddresses(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === addressId,
      }))
    );
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ label: '', street: '', city: '' });
    setErrors({});
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <AccountSidebar activeItem="addresses" />

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft"
              >
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-foreground">
                    عناويني
                  </h1>
                  {!isAdding && !editingId && (
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => setIsAdding(true)}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة عنوان
                    </Button>
                  )}
                </div>

                {/* Add/Edit Form */}
                <AnimatePresence>
                  {(isAdding || editingId) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-border rounded-lg p-4 mb-6 bg-secondary/30"
                    >
                      <h3 className="font-bold text-foreground mb-4">
                        {isAdding ? 'إضافة عنوان جديد' : 'تعديل العنوان'}
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="label">اسم العنوان (مثال: المنزل، العمل)</Label>
                          <Input
                            id="label"
                            value={formData.label}
                            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                            className={errors.label ? 'border-destructive' : ''}
                          />
                          {errors.label && <p className="text-destructive text-sm">{errors.label}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="street">الشارع / العنوان التفصيلي</Label>
                          <Input
                            id="street"
                            value={formData.street}
                            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                            className={errors.street ? 'border-destructive' : ''}
                          />
                          {errors.street && <p className="text-destructive text-sm">{errors.street}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">المدينة</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            className={errors.city ? 'border-destructive' : ''}
                          />
                          {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="gold"
                            onClick={isAdding ? handleAddAddress : handleSaveEdit}
                          >
                            <Check className="h-4 w-4 ml-2" />
                            حفظ
                          </Button>
                          <Button variant="ghost" onClick={cancelForm}>
                            <X className="h-4 w-4 ml-2" />
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Addresses List */}
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      لا توجد عناوين
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      قم بإضافة عنوان لتسهيل عملية التوصيل
                    </p>
                    <Button variant="gold" onClick={() => setIsAdding(true)}>
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة عنوان
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address, index) => (
                      <motion.div
                        key={address.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          'border rounded-lg p-4 transition-colors',
                          address.isDefault
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                              address.isDefault ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                            )}>
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-foreground">
                                  {address.label}
                                </h3>
                                {address.isDefault && (
                                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                    افتراضي
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground mt-1">
                                {address.street}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {!address.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetDefault(address.id)}
                                className="text-muted-foreground hover:text-primary"
                              >
                                تعيين كافتراضي
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditAddress(address)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Addresses;
