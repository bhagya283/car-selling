import { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import {
    History, Clock, CheckCircle2,
    ChevronRight, Calendar, MessageSquare, Car,
    X, Info, Phone, Mail, MapPin, ShieldCheck, Edit3, Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BuyerBookings() {
    const { user } = useAuth() as any;
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    // Modification State
    const [isEditing, setIsEditing] = useState(false);
    const [editDate, setEditDate] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchBookings = () => {
        if (!user) return;
        const currentUserId = user._id || user.id;

        bookingService.getAll(currentUserId)
            .then(res => {
                const data = res.data;
                const myBookings = Array.isArray(data)
                    ? data.filter((b: any) => {
                        const bid = b.buyerId?._id || b.buyerId;
                        return bid === currentUserId && b.type !== 'Wishlist';
                    })
                    : [];
                setBookings(myBookings);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const openDetails = (booking: any) => {
        setSelectedBooking(booking);
        setEditDate(new Date(booking.bookingDate || booking.createdAt).toISOString().split('T')[0]);
        setEditMessage(booking.message || '');
        setIsEditing(false);
        setShowModal(true);
    };

    const handleModify = async () => {
        if (!selectedBooking) {
            alert("No booking selected.");
            return;
        }
        if (!editDate) {
            alert("Please select a valid date.");
            return;
        }

        const dateObj = new Date(editDate);
        if (isNaN(dateObj.getTime())) {
            alert("Invalid date selected.");
            return;
        }

        setIsSaving(true);
        try {
            const dataToUpdate = {
                bookingDate: dateObj,
                message: editMessage
            };

            console.log("Updating booking ID:", selectedBooking._id);
            console.log("Data:", dataToUpdate);

            const response = await bookingService.update(selectedBooking._id, dataToUpdate);

            if (response.status === 200 || response.status === 204 || response.data) {
                alert("SUCCESS: Request modified successfully!");
                fetchBookings();
                setShowModal(false);
                setIsEditing(false);
            } else {
                throw new Error("Server returned non-ok status");
            }
        } catch (err: any) {
            console.error("Modify Error:", err);
            const detail = err.response?.data?.message || err.message || "Unknown error";
            alert(`FAILED TO SAVE: ${detail}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading inquiries...</div>;

    return (
        <div className="animate-up">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Inquiries & Test Drives</h1>
                <p style={{ color: '#64748b' }}>Track your car inquiries and scheduled test drive requests.</p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                {bookings.length === 0 ? (
                    <div style={{ padding: '80px', textAlign: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '32px' }}>
                        <History size={48} style={{ color: '#e2e8f0', marginBottom: '20px' }} />
                        <h3 style={{ color: '#64748b' }}>You haven't made any inquiries yet.</h3>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <div
                            key={booking._id}
                            onClick={() => openDetails(booking)}
                            style={{
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '24px',
                                padding: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={e => e.currentTarget.style.borderColor = '#0070f3'}
                            onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ width: '80px', height: '60px', borderRadius: '12px', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {booking.car?.imageUrl ? (
                                        <img src={booking.car.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    ) : (
                                        <Car size={24} color="#94a3b8" />
                                    )}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#0070f3', textTransform: 'uppercase', background: '#f0f7ff', padding: '2px 8px', borderRadius: '4px' }}>
                                            {booking.type || 'Inquiry'}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                                        {booking.car ? `${booking.car.brand} ${booking.car.carModel}` : 'Request Details'}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '14px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={14} /> Official Request</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: booking.status === 'Confirmed' ? '#dcfce7' : '#fef9c3',
                                        color: booking.status === 'Confirmed' ? '#166534' : '#854d0e',
                                        padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '700'
                                    }}>
                                        {booking.status === 'Confirmed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                                        {booking.status || 'Pending'}
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', margin: 0 }}>Review within 24 hours</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openDetails(booking); }}
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                                >
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Booking Details Modal */}
            {showModal && selectedBooking && (
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

                        <div style={{ background: '#004e82', padding: '32px', color: 'white', position: 'relative' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <ShieldCheck size={20} color="#60a5fa" />
                                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Official Request</span>
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{selectedBooking.type || 'Vehicle Inquiry'}</h2>
                        </div>

                        <div style={{ padding: '32px' }}>
                            {/* Car Card - Enhanced visibility */}
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <div style={{ width: '140px', height: '100px', borderRadius: '16px', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                                    {selectedBooking.car?.imageUrl ? (
                                        <img src={selectedBooking.car.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Car size={32} color="#94a3b8" />
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                                        {selectedBooking.car?.brand} {selectedBooking.car?.carModel}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
                                        <span>{selectedBooking.car?.year || '2024'}</span>
                                        <span>•</span>
                                        <span style={{ color: '#004e82', fontWeight: 700 }}>Rs.{selectedBooking.car?.price?.toLocaleString() || 'Priceless'}</span>
                                    </div>
                                    <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#004e82', fontWeight: 700, fontSize: '13px', background: '#e0f2fe', padding: '6px 14px', borderRadius: '10px' }}>
                                        <Info size={14} /> Status: {selectedBooking.status || 'Received'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div>
                                    <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        Request Info {isEditing && <span style={{ color: '#0070f3' }}>(Editing)</span>}
                                    </h4>
                                    <div style={{ display: 'grid', gap: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <Calendar size={18} color="#004e82" style={{ marginTop: '4px' }} />
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Scheduled Date</div>
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        value={editDate}
                                                        onChange={(e) => setEditDate(e.target.value)}
                                                        style={{ marginTop: '8px', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', fontSize: '14px' }}
                                                    />
                                                ) : (
                                                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{new Date(selectedBooking.bookingDate || selectedBooking.createdAt).toLocaleDateString()}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <MessageSquare size={18} color="#004e82" style={{ marginTop: '4px' }} />
                                            <div style={{ width: '100%' }}>
                                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Message/Notes</div>
                                                {isEditing ? (
                                                    <textarea
                                                        value={editMessage}
                                                        onChange={(e) => setEditMessage(e.target.value)}
                                                        placeholder="Add instructions or preferences..."
                                                        style={{ marginTop: '8px', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', fontSize: '14px', height: '80px', resize: 'none' }}
                                                    />
                                                ) : (
                                                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, marginTop: '4px' }}>{selectedBooking.message || 'No additional notes provided.'}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>Contact Support</h4>
                                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                                        Our sales executive will contact you at <strong>{user.email}</strong> to finalize the appointment.
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', border: '1px solid #f1f5f9' }}>
                                            <Phone size={14} color="#004e82" /> Call Agent
                                        </div>
                                        <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', border: '1px solid #f1f5f9' }}>
                                            <Mail size={14} color="#004e82" /> Support
                                        </div>
                                        <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', border: '1px solid #f1f5f9' }}>
                                            <MapPin size={14} color="#004e82" /> Location
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '0 32px 32px', display: 'flex', gap: '12px' }}>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleModify}
                                        disabled={isSaving}
                                        style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: '#0070f3', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    >
                                        {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: '#004e82', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    >
                                        <Edit3 size={18} /> Modify Request
                                    </button>
                                </>
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
