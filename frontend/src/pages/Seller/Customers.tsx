import { useEffect, useState } from 'react';
import { bookingService, orderService } from '../../services/api';
import { Search, User, Mail, ShoppingBag, Calendar } from 'lucide-react';

export default function SellerCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const [bookRes, orderRes] = await Promise.all([
                    bookingService.getAll(),
                    orderService.getMyOrders()
                ]);

                // Map and unique by buyerId (which is basically the userId or sub)
                const customerMap = new Map();

                bookRes.data.forEach((b: any) => {
                    const id = b.buyerId?._id || b.buyerId;
                    if (!customerMap.has(id)) {
                        customerMap.set(id, {
                            id,
                            name: b.buyerId?.name || 'Anonymous Customer',
                            email: b.buyerId?.email || 'contact@dealer.com',
                            bookings: 0,
                            purchases: 0,
                            lastActive: b.createdAt
                        });
                    }
                    const c = customerMap.get(id);
                    c.bookings += 1;
                    if (new Date(b.createdAt) > new Date(c.lastActive)) c.lastActive = b.createdAt;
                });

                orderRes.data.forEach((o: any) => {
                    const id = o.user?._id || o.user;
                    if (!customerMap.has(id)) {
                        customerMap.set(id, {
                            id,
                            name: o.user?.name || id,
                            email: o.user?.email || 'N/A',
                            bookings: 0,
                            purchases: 0,
                            lastActive: o.createdAt
                        });
                    }
                    const c = customerMap.get(id);
                    c.purchases += 1;
                    if (new Date(o.createdAt) > new Date(c.lastActive)) c.lastActive = o.createdAt;
                });

                setCustomers(Array.from(customerMap.values()));
            } catch (err) {
                console.error("Failed to compile customer list", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filtered = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Customer CRM</h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Relationship management for your dealership</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '11px' }} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px 16px 10px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', width: '280px' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>Analyzing cluster data...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No customers found in your portfolio.</div>
                ) : filtered.map(customer => (
                    <div key={customer.id} style={{ background: 'white', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
                            <div style={{ width: '56px', height: '56px', background: '#f0f7ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0070f3' }}>
                                <User size={28} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{customer.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
                                    <Mail size={12} /> {customer.email}
                                </div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>
                                VIP
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                                    <ShoppingBag size={12} /> Purchases
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{customer.purchases}</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                                    <Calendar size={12} /> Bookings
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{customer.bookings}</div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                Last Active: {new Date(customer.lastActive).toLocaleDateString()}
                            </div>
                            <button style={{ background: 'none', border: 'none', color: '#0070f3', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>View Activity</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
