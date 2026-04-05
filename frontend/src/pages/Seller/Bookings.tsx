import { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import { Calendar, User, Tag, CheckCircle2, Clock, X } from 'lucide-react';

export default function SellerBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingService.getAll(); // For admin/owner, this usually returns all
            setBookings(res.data);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await bookingService.updateStatus(id, status);
            fetchBookings();
            if (selectedBooking && selectedBooking._id === id) {
                setShowModal(false);
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Manage Bookings</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Track test drives and vehicle inquiries</p>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>CUSTOMER</th>
                            <th style={{ padding: '20px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>VEHICLE</th>
                            <th style={{ padding: '20px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>TYPE</th>
                            <th style={{ padding: '20px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>DATE</th>
                            <th style={{ padding: '20px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>STATUS</th>
                            <th style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 700, color: '#64748b', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Loading bookings...</td></tr>
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>No bookings found.</td></tr>
                        ) : bookings.map(booking => (
                            <tr key={booking._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '20px 32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={18} color="#64748b" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{booking.buyerId?.name || booking.buyerId || 'Guest User'}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>INV-{booking._id.substr(-6)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 16px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{booking.car?.brand} {booking.car?.carModel}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{booking.car?.year}</div>
                                </td>
                                <td style={{ padding: '20px 16px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: booking.type === 'Test Drive' ? '#8b5cf6' : '#0ea5e9', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {booking.type === 'Test Drive' ? <Clock size={14} /> : <Tag size={14} />}
                                        {booking.type}
                                    </span>
                                </td>
                                <td style={{ padding: '20px 16px', fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                                    {new Date(booking.bookingDate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '20px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: booking.status === 'Confirmed' ? '#10b981' : booking.status === 'Cancelled' ? '#ef4444' : '#f59e0b' }}></div>
                                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{booking.status}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                                        style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                                    >View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedBooking && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}>
                            <X size={20} color="#64748b" />
                        </button>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Booking Details</h3>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Review and update the status of this request</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', display: 'flex', gap: '16px' }}>
                                <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                    <img src={selectedBooking.car?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{selectedBooking.car?.brand} {selectedBooking.car?.carModel}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Rs.{selectedBooking.car?.price?.toLocaleString()}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Requested Date</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700 }}>
                                        <Calendar size={16} /> {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Booking Type</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{selectedBooking.type}</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Customer Message</div>
                                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', fontSize: '14px', color: '#475569', minHeight: '60px' }}>
                                    {selectedBooking.message || "No specific message provided."}
                                </div>
                            </div>

                            <div style={{ marginTop: '24px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Update Status</div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking._id, 'Confirmed')}
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#10b981', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <CheckCircle2 size={18} /> Confirm
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking._id, 'Cancelled')}
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ef4444', background: 'white', color: '#ef4444', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <X size={18} /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
