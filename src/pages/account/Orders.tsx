import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemsCount: number;
}

// بيانات وهمية للطلبات
const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-20',
    status: 'delivered',
    total: 1656,
    itemsCount: 3,
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-18',
    status: 'shipped',
    total: 890,
    itemsCount: 2,
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-15',
    status: 'processing',
    total: 420,
    itemsCount: 1,
  },
  {
    id: 'ORD-2024-004',
    date: '2024-01-10',
    status: 'cancelled',
    total: 350,
    itemsCount: 1,
  },
];

const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'تم الشحن', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const Orders = () => {
  const [orders] = useState<Order[]>(mockOrders);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <AccountSidebar activeItem="orders" />

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft"
              >
                <h1 className="text-2xl font-bold text-foreground mb-6">
                  طلباتي
                </h1>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      لا توجد طلبات
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      لم تقم بأي طلبات بعد
                    </p>
                    <Link to="/">
                      <Button variant="gold">تصفح المنتجات</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => {
                      const status = statusConfig[order.status];
                      const StatusIcon = status.icon;

                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-border rounded-lg p-4 hover:shadow-soft transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-bold text-foreground" dir="ltr">
                                  #{order.id}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {status.label}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(order.date)} • {order.itemsCount} منتج
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <span className="font-bold text-primary text-lg">
                                {formatPrice(order.total)}
                              </span>
                              <Link to={`/account/orders/${order.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 ml-2" />
                                  التفاصيل
                                </Button>
                              </Link>
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

export default Orders;
