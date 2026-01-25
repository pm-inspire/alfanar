import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Package, Tag, Info, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'info';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

// بيانات وهمية للإشعارات
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'تم شحن طلبك',
    message: 'طلبك رقم ORD-2024-002 في الطريق إليك',
    date: '2024-01-20T10:30:00',
    isRead: false,
  },
  {
    id: '2',
    type: 'promo',
    title: 'عرض خاص! خصم 20%',
    message: 'استخدم كود ALFANAR20 للحصول على خصم 20% على جميع المنتجات',
    date: '2024-01-19T15:00:00',
    isRead: false,
  },
  {
    id: '3',
    type: 'order',
    title: 'تم تأكيد طلبك',
    message: 'طلبك رقم ORD-2024-003 قيد المعالجة الآن',
    date: '2024-01-18T09:00:00',
    isRead: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'مرحباً بك في الفنار',
    message: 'شكراً لانضمامك إلينا! استمتع بتجربة تسوق مميزة',
    date: '2024-01-15T12:00:00',
    isRead: true,
  },
  {
    id: '5',
    type: 'order',
    title: 'تم توصيل طلبك',
    message: 'طلبك رقم ORD-2024-001 تم توصيله بنجاح',
    date: '2024-01-12T16:30:00',
    isRead: true,
  },
];

const typeConfig = {
  order: { icon: Package, color: 'text-blue-600 bg-blue-100' },
  promo: { icon: Tag, color: 'text-green-600 bg-green-100' },
  info: { icon: Info, color: 'text-yellow-600 bg-yellow-100' },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'الآن';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInHours < 48) return 'أمس';
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  };

  const handleMarkAsRead = (notificationId: string) => {
    // TODO: استدعاء API لتحديث حالة الإشعار
    // await api.markNotificationAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    // TODO: استدعاء API لتحديث جميع الإشعارات
    // await api.markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    // TODO: استدعاء API لحذف الإشعار
    // await api.deleteNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <AccountSidebar activeItem="notifications" />

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      الإشعارات
                    </h1>
                    {unreadCount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {unreadCount} إشعار غير مقروء
                      </p>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                    >
                      <CheckCheck className="h-4 w-4 ml-2" />
                      تعليم الكل كمقروء
                    </Button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      لا توجد إشعارات
                    </h2>
                    <p className="text-muted-foreground">
                      ستظهر هنا جميع الإشعارات والتنبيهات
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification, index) => {
                      const config = typeConfig[notification.type];
                      const Icon = config.icon;

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            'border rounded-lg p-4 transition-colors',
                            notification.isRead
                              ? 'border-border bg-background'
                              : 'border-primary/30 bg-primary/5'
                          )}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                        >
                          <div className="flex gap-4">
                            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', config.color)}>
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className={cn(
                                    'font-bold',
                                    notification.isRead ? 'text-foreground' : 'text-primary'
                                  )}>
                                    {notification.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification.id);
                                  }}
                                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                  aria-label="حذف الإشعار"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDate(notification.date)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
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

export default Notifications;
