import { useEffect, useState } from 'react';
import { User, Eye, X, MapPin, Info, Mail, Phone } from 'lucide-react';
import { orderService } from '../../services/api';

export default function OwnerOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const res = await orderService.getMyOrders(); // This maps to /orders/me which currently returns all for admin
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch all orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            await orderService.updateStatus(orderId, newStatus);
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            alert("Order status updated successfully!");
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const openDetails = (order: any) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading orders...</div>;

    return (
        <div style={{ padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Manage Orders</h1>
                <p style={{ color: '#64748b' }}>Monitor and process customer vehicle reservations</p>
            </div>

            <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Vehicle</th>
                            <th style={{ padding: '20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Customer</th>
                            <th style={{ padding: '20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total</th>
                            <th style={{ padding: '20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={order.car?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{order.car?.brand} {order.car?.carModel}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>ID: {order._id.slice(-6).toUpperCase()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={14} color="#64748b" />
                                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{order.user?.name || 'Customer'}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Rs.{(order.totalAmount > 500 ? order.totalAmount : (order.car?.price || order.totalAmount))?.toLocaleString()}</div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        padding: '6px 10px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        background: order.status === 'completed' ? '#dcfce7' : '#fef3c7',
                                        color: order.status === 'completed' ? '#166534' : '#92400e'
                                    }}>
                                        {order.status?.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <select
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            value={order.status}
                                            style={{ padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={() => openDetails(order)}
                                            style={{ padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer' }}
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No orders found in the system.</div>
                )}
            </div>

            {/* Order Details Modal (Seller View) */}
            {showModal && selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        background: 'white', width: '650px', borderRadius: '32px',
                        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }} onClick={e => e.stopPropagation()}>

                        <div style={{ background: '#0f172a', padding: '32px', color: 'white', position: 'relative' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Order Management</h2>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Order Ref: {selectedOrder._id.toUpperCase()}</p>
                        </div>

                        <div style={{ padding: '32px' }}>
                            {/* Customer Section */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Customer Information</label>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <User size={16} color="#64748b" />
                                            <span style={{ fontWeight: 700 }}>{selectedOrder.user?.name || 'Full Name N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Mail size={16} color="#64748b" />
                                            <span style={{ fontSize: '14px' }}>{selectedOrder.user?.email || 'email@example.com'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Phone size={16} color="#64748b" />
                                            <span style={{ fontSize: '14px' }}>+91 98765 43210</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Vehicle Details</label>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ width: '80px', height: '60px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                                            <img src={selectedOrder.car?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{selectedOrder.car?.brand} {selectedOrder.car?.carModel}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>VIN: {selectedOrder.car?.vin || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', marginBottom: '32px' }} />

                            {/* Logistics Section */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Billing & Payment</label>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '13px', color: '#64748b' }}>Car Value:</span>
                                            <span style={{ fontWeight: 700 }}>Rs.{selectedOrder.totalAmount?.toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '13px', color: '#64748b' }}>Token Paid:</span>
                                            <span style={{ fontWeight: 800, color: '#10b981' }}>Rs.{selectedOrder.depositAmount?.toLocaleString() || '500'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 700 }}>Due Amount:</span>
                                            <span style={{ fontWeight: 800, color: '#ef4444' }}>Rs.{(selectedOrder.totalAmount - (selectedOrder.depositAmount || 500)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Delivery address</label>
                                    <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                                        <MapPin size={18} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span style={{ fontSize: '14px', lineHeight: 1.5, fontWeight: 500 }}>
                                            {selectedOrder.deliveryAddress || 'Customer opted for Showroom Pickup'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px' }}>
                                <Info size={18} color="#d97706" />
                                <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
                                    <strong>Action Required:</strong> Please verify the documents and cross-check the VIN before marking the order as 'Confirmed' or 'Completed'.
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '0 32px 32px', display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Close Detail
                            </button>
                            <button
                                onClick={() => { alert("Invoice generated and sent to " + selectedOrder.user?.email); }}
                                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#0f172a', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Generate Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
