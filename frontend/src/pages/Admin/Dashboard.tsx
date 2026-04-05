import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { carService, userService, bookingService, contactService, reviewService } from '../../services/api';
import {
    TrendingUp, Package, ShieldAlert,
    MoreHorizontal, CheckCircle2, AlertCircle,
    UserPlus, Calendar, Star, Trash2, MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [listings, setListings] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [leadsCount, setLeadsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('2026');
    const [reviews, setReviews] = useState<any[]>([]);
    const [deletingReview, setDeletingReview] = useState<string | null>(null);

    const [totalInventory, setTotalInventory] = useState(0);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Fetch stats and cars independently to prevent one failure from breaking everything
                const statsPromise = userService.getStats().catch(err => {
                    console.warn("Stats fetch failed, using fallbacks", err);
                    return { data: null };
                });

                const carsPromise = carService.getAll().catch(err => {
                    console.error("Cars fetch failed", err);
                    return { data: [] };
                });

                const [statsRes, carsRes, bookingsRes, leadsRes, reviewsRes] = await Promise.all([
                    statsPromise,
                    carsPromise,
                    bookingService.getAll().catch(() => ({ data: [] })),
                    contactService.getAll().catch(() => ({ data: [] })),
                    reviewService.getBySeller('').catch(() => ({ data: [] })) // fetch all
                ]);

                if (statsRes && statsRes.data) setStats(statsRes.data);

                const allCars = Array.isArray(carsRes.data) ? carsRes.data : [];
                setListings(allCars.slice(0, 5));
                setTotalInventory(allCars.length);

                const allBookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
                setBookings(allBookings.slice(0, 4));

                if (leadsRes && leadsRes.data) setLeadsCount(leadsRes.data.length);
                if (reviewsRes && Array.isArray(reviewsRes.data)) setReviews(reviewsRes.data);
            } catch (err) {
                console.error("Dashboard load failed", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const handleDeleteReview = async (id: string) => {
        if (!window.confirm('Delete this review?')) return;
        setDeletingReview(id);
        try {
            await reviewService.delete(id);
            setReviews(prev => prev.filter(r => r._id !== id));
        } catch {
            alert('Failed to delete review.');
        } finally {
            setDeletingReview(null);
        }
    };

    // Mock data sets for different years
    const yearlyPerformance: Record<string, number[]> = {
        '2026': [65, 85, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Jan, Feb, Mar (partial), rest 0
        '2025': [30, 40, 45, 50, 65, 70, 60, 55, 45, 50, 55, 60],
        '2024': [25, 35, 30, 45, 50, 40, 35, 45, 40, 35, 40, 45]
    };

    const barHeights = yearlyPerformance[selectedYear] || yearlyPerformance['2026'];

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
            <p style={{ fontWeight: 600, color: '#64748b' }}>Loading Analytics...</p>
        </div>
    );

    const kpiStats = [
        { label: 'Total Revenue', val: stats?.revenue || 'Rs.2.4M', change: '+12.5% from last month', icon: TrendingUp, color: '#0070f3', bg: '#f0f7ff' },
        { label: 'Live Inventory', val: stats?.activeListings || totalInventory, change: '+12 new this month', icon: Package, color: '#6366f1', bg: '#f5f5ff' },
        { label: 'Test Drives', val: bookings.length, change: 'Upcoming sessions', icon: CheckCircle2, color: '#10b981', bg: '#f0fdf4' },
        { label: 'Lead Inquiries', val: leadsCount, change: 'Waiting for response', icon: ShieldAlert, color: '#ef4444', bg: '#fef2f2' }
    ];

    return (
        <div style={{ padding: '0' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                {kpiStats.map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>{stat.label}</span>
                            <div style={{ width: '40px', height: '40px', background: stat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <stat.icon size={22} color={stat.color} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{stat.val}</h2>
                        <div style={{ fontSize: '12px', color: i === 3 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px', marginBottom: '32px' }}>
                {/* Performance Chart */}
                <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Revenue Breakdown</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Performance for fiscal year {selectedYear}</p>
                        </div>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="2026">2026 Fiscal Year</option>
                            <option value="2025">2025 Fiscal Year</option>
                            <option value="2024">2024 Fiscal Year</option>
                        </select>
                    </div>

                    <div style={{ height: '260px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '20px' }}>
                        {barHeights.map((h, i) => (
                            <div key={i} style={{
                                flex: 1,
                                background: (selectedYear === '2026' && i === 10) ? '#0070f3' : '#e2e8f0',
                                height: `${h}%`,
                                borderRadius: '6px',
                                transition: 'height 0.4s ease-out, background 0.3s'
                            }}></div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 5px' }}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                            <span key={m} style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>{m}</span>
                        ))}
                    </div>
                </div>

                {/* Recent Bookings */}
                <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Bookings</h3>
                        <Link to="/owner/bookings" style={{ fontSize: '13px', fontWeight: 700, color: '#0070f3', textDecoration: 'none' }}>View All</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {bookings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>No recent bookings found.</div>
                        ) : bookings.map((booking, i) => (
                            <div key={booking._id || i} style={{ display: 'flex', gap: '16px', borderBottom: i === bookings.length - 1 ? 'none' : '1px solid #f8fafc', paddingBottom: i === bookings.length - 1 ? 0 : '16px' }}>
                                <div style={{ minWidth: '44px', height: '44px', background: booking.type === 'Test Drive' ? '#f5f3ff' : '#f0f7ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {booking.type === 'Test Drive' ? <Calendar size={20} color="#8b5cf6" /> : <UserPlus size={20} color="#0070f3" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{booking.buyerId?.name || 'Guest'}</div>
                                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>{new Date(booking.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                        {booking.type}: {booking.car?.brand} {booking.car?.carModel}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        color: booking.status === 'Confirmed' ? '#10b981' : booking.status === 'Cancelled' ? '#ef4444' : '#f59e0b',
                                        marginTop: '6px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {booking.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Inventory</h3>
                    <button style={{
                        background: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '10px',
                        fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer'
                    }} onClick={() => navigate('/owner/inventory')}>Manage Full Inventory</button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ textAlign: 'left', padding: '16px 40px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>VEHICLE</th>
                            <th style={{ textAlign: 'left', padding: '16px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>VIN / ID</th>
                            <th style={{ textAlign: 'left', padding: '16px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>ACQUISITION</th>
                            <th style={{ textAlign: 'left', padding: '16px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>FIXED PRICE</th>
                            <th style={{ textAlign: 'left', padding: '16px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>STATUS</th>
                            <th style={{ textAlign: 'right', padding: '16px 40px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.length > 0 ? listings.map((car, i) => (
                            <tr key={car._id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 40px' }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#f1f5f9', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                            <img src={car.imageUrl || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=100'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{car.brand} {car.carModel}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{car.year} • {car.mileage?.toLocaleString()} mi</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{car.vin || `INV-${car._id?.substr(-5)}`}</td>
                                <td style={{ padding: '16px 16px', fontSize: '13px', color: '#64748b' }}>{new Date().toLocaleDateString()}</td>
                                <td style={{ padding: '16px 16px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Rs.{car.price?.toLocaleString()}</td>
                                <td style={{ padding: '16px 16px' }}>
                                    <span style={{
                                        background: car.status === 'available' || !car.status ? '#f0fdf4' : '#fffbeb',
                                        color: car.status === 'available' || !car.status ? '#10b981' : '#f59e0b',
                                        padding: '6px 12px',
                                        borderRadius: '80px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase'
                                    }}>{car.status || 'available'}</span>
                                </td>
                                <td style={{ padding: '16px 40px', textAlign: 'right' }}>
                                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No vehicles in inventory.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reviews Management Table */}
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: '32px' }}>
                <div style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MessageSquare size={20} color="#0070f3" />
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Customer Reviews</h3>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>
                            {reviews.length} total
                        </span>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ textAlign: 'left', padding: '14px 40px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>REVIEWER</th>
                            <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>RATING</th>
                            <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>COMMENT</th>
                            <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>DATE</th>
                            <th style={{ textAlign: 'right', padding: '14px 40px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                                    <MessageSquare size={32} style={{ marginBottom: '12px', opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                                    No reviews yet.
                                </td>
                            </tr>
                        ) : reviews.map((review, i) => (
                            <tr key={review._id || i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                                onMouseOver={e => (e.currentTarget.style.background = '#fafafa')}
                                onMouseOut={e => (e.currentTarget.style.background = 'white')}
                            >
                                <td style={{ padding: '16px 40px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{review.buyerName || 'Anonymous'}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>ID: {review.buyerId?.slice(-6) || '—'}</div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={14}
                                                fill={review.rating >= s ? '#f59e0b' : 'none'}
                                                color={review.rating >= s ? '#f59e0b' : '#cbd5e1'}
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginLeft: '6px' }}>{review.rating}/5</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', maxWidth: '300px' }}>
                                    <p style={{ fontSize: '13px', color: '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {review.comment || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No comment</span>}
                                    </p>
                                </td>
                                <td style={{ padding: '16px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '—'}
                                </td>
                                <td style={{ padding: '16px 40px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleDeleteReview(review._id)}
                                        disabled={deletingReview === review._id}
                                        style={{
                                            background: '#fef2f2', border: '1px solid #fecaca',
                                            color: '#ef4444', padding: '8px 14px', borderRadius: '10px',
                                            fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            opacity: deletingReview === review._id ? 0.5 : 1
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        {deletingReview === review._id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
