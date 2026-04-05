import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/api';
import {
    Package, Clock, CheckCircle2, ChevronRight, Car,
    X, MapPin, CreditCard, Calendar, Info, ShieldCheck, AlertTriangle
} from 'lucide-react';

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await orderService.getMyOrders();
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const openDetails = (order: any) => {
        setSelectedOrder(order);
        setShowModal(false);
        setTimeout(() => setShowModal(true), 10);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        setCancelling(true);
        try {
            await orderService.cancelOrder(selectedOrder._id);
            setOrders(prev => prev.map(o =>
                o._id === selectedOrder._id ? { ...o, status: 'cancelled' } : o
            ));
            setSelectedOrder((prev: any) => ({ ...prev, status: 'cancelled' }));
            setShowCancelConfirm(false);
        } catch (err) {
            console.error('Failed to cancel order', err);
            alert('Could not cancel order. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your orders...</div>;
    }

    return (
        <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>My Orders</h1>
                    <p style={{ color: '#64748b' }}>Track and manage your vehicle reservations</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div style={{ padding: '80px 0', textAlign: 'center', background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Package size={32} color="#94a3b8" />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No orders found</h2>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((order) => (
                        <div key={order._id} style={{
                            background: 'white',
                            borderRadius: '24px',
                            border: '1px solid #e2e8f0',
                            padding: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                        }}
                            onClick={() => openDetails(order)}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = '#0070f3'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '80px',
                                    height: '60px',
                                    background: '#f1f5f9',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {order.car?.imageUrl ? (
                                        <img src={order.car.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    ) : (
                                        <Car size={24} color="#94a3b8" />
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                                    <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{order.car?.brand} {order.car?.carModel}</h3>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>Rs.{(order.totalAmount > 500 ? order.totalAmount : (order.car?.price || order.totalAmount))?.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: order.status === 'completed' ? '#10b981' : order.status === 'cancelled' ? '#ef4444' : order.status === 'pending' ? '#f59e0b' : '#3b82f6'
                                    }}>
                                        {order.status === 'completed' ? <CheckCircle2 size={16} /> : order.status === 'cancelled' ? <X size={16} /> : <Clock size={16} />}
                                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openDetails(order); }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        background: 'white', width: '600px', borderRadius: '32px',
                        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div style={{ background: '#0f172a', padding: '32px', color: 'white', position: 'relative' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#0070f3' }}>
                                <ShieldCheck size={24} />
                                <span style={{ fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Verified Transaction</span>
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Order Details</h2>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>ID: #{selectedOrder._id.toUpperCase()}</p>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <div style={{ width: '120px', height: '90px', background: '#e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                    <img src={selectedOrder.car?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{selectedOrder.car?.brand} {selectedOrder.car?.carModel}</h3>
                                    <div style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                                        <span>{selectedOrder.car?.year}</span>
                                        <span>•</span>
                                        <span>{selectedOrder.car?.mileage?.toLocaleString()} mi</span>
                                    </div>
                                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0070f3', marginTop: '12px' }}>
                                        Rs.{(selectedOrder.totalAmount > 500 ? selectedOrder.totalAmount : selectedOrder.car?.price)?.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Order Information</div>
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Calendar size={18} color="#64748b" />
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>Purchase Date</div>
                                                <div style={{ fontWeight: 700, fontSize: '14px' }}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <CreditCard size={18} color="#64748b" />
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>Deposit Paid</div>
                                                <div style={{ fontWeight: 700, fontSize: '14px', color: '#10b981' }}>Rs.{selectedOrder.depositAmount?.toLocaleString() || '500'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Fulfillment</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <MapPin size={18} color="#64748b" style={{ marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>Delivery Location</div>
                                            <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.4 }}>
                                                {selectedOrder.deliveryAddress || 'Pickup from Dealership'}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Sai Automobiles Premium Lounge</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', background: '#f0f9ff', padding: '20px', borderRadius: '16px', display: 'flex', gap: '16px' }}>
                                <Info size={20} color="#0070f3" style={{ flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e40af', marginBottom: '4px' }}>Next Steps</div>
                                    <p style={{ fontSize: '13px', color: '#1e40af', opacity: 0.8, lineHeight: 1.5 }}>
                                        Our manager will contact you within 24 hours to schedule the final vehicle inspection and handover. Your reservation deposit is secured.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {showCancelConfirm ? (
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '16px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#991b1b', marginBottom: '4px' }}>Confirm Cancellation</div>
                                            <p style={{ fontSize: '13px', color: '#991b1b', margin: 0, lineHeight: 1.5 }}>Are you sure you want to cancel this order? Our team will process your refund as per policy.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => setShowCancelConfirm(false)}
                                            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                                        >
                                            Go Back
                                        </button>
                                        <button
                                            onClick={handleCancelOrder}
                                            disabled={cancelling}
                                            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '13px', opacity: cancelling ? 0.6 : 1 }}
                                        >
                                            {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => navigate('/contact')}
                                        style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#0070f3', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Contact Dealer
                                    </button>
                                </div>
                            )}
                            {selectedOrder?.status !== 'cancelled' && selectedOrder?.status !== 'completed' && !showCancelConfirm && (
                                <button
                                    onClick={() => setShowCancelConfirm(true)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <X size={16} /> Cancel This Order
                                </button>
                            )}
                            {selectedOrder?.status === 'cancelled' && (
                                <div style={{ textAlign: 'center', padding: '10px', background: '#fef2f2', borderRadius: '12px', color: '#ef4444', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <X size={16} /> This order has been cancelled
                                </div>
                            )}
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
