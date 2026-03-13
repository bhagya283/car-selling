import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService, bookingService } from '../../services/api';
import {
    Package, Heart, Calendar, CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BuyerOverview() {
    const { user } = useAuth() as any;
    const [stats, setStats] = useState({
        orders: 0,
        wishlist: 0,
        testDrives: 0,
        totalSpent: 0,
        totalPaid: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [nextTestDrive, setNextTestDrive] = useState<any>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const currentUserId = user._id || user.id;

                // 1. Get Orders
                const orderRes = await orderService.getMyOrders(currentUserId);
                const orders = orderRes.data;

                // Filter specifically for this user (now redundant but kept for safety)
                const myOrders = Array.isArray(orders) ? orders.filter((o: any) => {
                    const orderUserId = o.user?._id || o.user;
                    return orderUserId === currentUserId;
                }) : [];

                setRecentOrders(myOrders.slice(0, 3));
                const total = myOrders.reduce((acc: number, curr: any) => acc + (curr.totalAmount || curr.car?.price || 0), 0);
                const paidTotal = myOrders.reduce((acc: number, curr: any) => acc + (curr.depositAmount || 0), 0);

                // 2. Get Bookings (Test Drives & Wishlist)
                const bookingRes = await bookingService.getAll(currentUserId);
                const bookings = bookingRes.data;

                // Filter specifically for this user - handle both string and populated object
                const myBookings = Array.isArray(bookings) ? bookings.filter((b: any) => {
                    const bid = b.buyerId?._id || b.buyerId;
                    return bid === currentUserId;
                }) : [];

                const wishlistCount = myBookings.filter((b: any) => b.type === 'Wishlist' || b.type === 'Inquiry').length;
                const testDriveList = myBookings.filter((b: any) => b.type === 'Test Drive');

                setNextTestDrive(testDriveList[0] || null);

                setStats({
                    orders: myOrders.length,
                    wishlist: wishlistCount,
                    testDrives: testDriveList.length,
                    totalSpent: total,
                    totalPaid: paidTotal
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchDashboardData();
    }, [user]);

    const cards = [
        { label: 'Active Orders', value: stats.orders, icon: Package, color: '#004e82', bg: '#f0f7ff', path: '/dashboard/orders' },
        { label: 'Saved Vehicles', value: stats.wishlist, icon: Heart, color: '#f43f5e', bg: '#fff1f2', path: '/dashboard/wishlist' },
        { label: 'Test Drives', value: stats.testDrives, icon: Calendar, color: '#8b5cf6', bg: '#f5f3ff', path: '/dashboard/test-drives' },
        { label: 'Total Value', value: 'Rs.' + stats.totalSpent.toLocaleString(), icon: CreditCard, color: '#004e82', bg: '#f0f7ff', path: '/dashboard/orders' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>Welcome back, {user?.name}!</h1>
                <p style={{ color: '#64748b' }}>Here's what's happening with your vehicle reservations.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {cards.map((card, i) => (
                    <Link
                        key={i}
                        to={card.path}
                        style={{
                            background: 'white',
                            padding: '24px',
                            borderRadius: '24px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: card.bg,
                            color: card.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{card.label}</div>
                            <div style={{ fontSize: '20px', fontWeight: 800 }}>{card.value}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Recent Orders</h2>
                        <Link to="/dashboard/orders" style={{ fontSize: '14px', fontWeight: 700, color: '#0070f3', textDecoration: 'none' }}>View All</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recentOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No recent orders found.</div>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={order.car?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '15px' }}>{order.car?.brand} {order.car?.carModel}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Rs.{(order.totalAmount > 500 ? order.totalAmount : (order.car?.price || order.totalAmount))?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '6px 12px',
                                        borderRadius: '80px',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        background: order.status === 'completed' ? '#dcfce7' : '#fef3c7',
                                        color: order.status === 'completed' ? '#166534' : '#92400e'
                                    }}>
                                        {order.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', padding: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Next Test Drive</h2>
                    {nextTestDrive ? (
                        <div style={{ background: '#f0f7ff', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#0070f3' }}>
                                <Calendar size={24} />
                            </div>
                            <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>
                                {nextTestDrive.car?.brand} {nextTestDrive.car?.carModel}
                            </h4>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                                {new Date(nextTestDrive.bookingDate).toLocaleDateString()} at 10:30 AM
                            </p>
                            <Link to="/dashboard/test-drives" style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '12px', background: '#0070f3', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>Manage Schedule</Link>
                        </div>
                    ) : (
                        <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '40px', textAlign: 'center', border: '1px dashed #e2e8f0' }}>
                            <p style={{ color: '#64748b', fontSize: '14px' }}>No upcoming test drives.</p>
                            <Link to="/inventory" style={{ color: '#0070f3', fontSize: '14px', fontWeight: 700, textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>Find a Car</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
