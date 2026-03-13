import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carService, orderService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
    CheckCircle2,
    Circle,
    ShieldCheck
} from 'lucide-react';

export default function Checkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth() as any;

    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            const names = user.name?.split(' ') || ['', ''];
            setContactInfo({
                firstName: names[0] || '',
                lastName: names[1] || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await carService.getById(id as string);
                const status = res.data.status?.toLowerCase();
                if (status && status !== 'available' && status !== 'live') {
                    alert("This vehicle is no longer available.");
                    navigate('/inventory');
                }
                setCar(res.data);
            } catch (err) {
                console.error("Failed to fetch car", err);
                navigate('/inventory');
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id, navigate]);

    const handlePlaceOrder = async () => {
        if (!car) return;
        setIsProcessing(true);
        try {
            // 1. Create Order
            const userId = user?._id || user?.id || localStorage.getItem('userId');
            const orderRes = await orderService.create({
                carId: car._id,
                buyerId: userId,
                buyerName: `${contactInfo.firstName} ${contactInfo.lastName}`,
                buyerEmail: contactInfo.email,
                totalAmount: totalPrice,
                depositAmount: 500, // Deposit
                status: 'paid', // Simulate success for this prototype
                deliveryMethod,
                paymentDetails: paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'
            });

            // 2. Update Car Status to Sold
            await carService.updateStatus(car._id, 'Sold');

            // 3. Navigate to Success
            navigate('/order-success', { state: { order: orderRes.data, car } });
        } catch (err) {
            console.error("Checkout failed", err);
            alert("Failed to process order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading || !car) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
            <p>Securing your checkout session...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const docFee = 499.00;
    const taxTitle = car.price * 0.07;
    const deliveryFee = deliveryMethod === 'delivery' ? 499.00 : 0;
    const totalPrice = car.price + docFee + taxTitle + deliveryFee;
    const deposit = 500.00;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-1px' }}>Finalize Your Purchase</h1>
                    <p style={{ color: '#64748b', fontSize: '15px' }}>You're moments away from securing your {car.brand} {car.carModel}. A Rs.500 refundable deposit is required.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {/* Step 1: Contact */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', background: '#0070f3', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>1</div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Buyer Information</h2>
                                </div>
                                {!isEditingContact && (
                                    <button onClick={() => setIsEditingContact(true)} style={{ background: 'none', border: 'none', color: '#0070f3', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                                )}
                            </div>

                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px' }}>
                                {isEditingContact ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <input type="text" value={contactInfo.firstName} onChange={e => setContactInfo({ ...contactInfo, firstName: e.target.value })} placeholder="First Name" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                            <input type="text" value={contactInfo.lastName} onChange={e => setContactInfo({ ...contactInfo, lastName: e.target.value })} placeholder="Last Name" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                            <input type="email" value={contactInfo.email} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder="Email" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                            <input type="text" value={contactInfo.phone} onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })} placeholder="Phone" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                        </div>
                                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px' }}>
                                            <button onClick={() => setIsEditingContact(false)} className="btn btn-primary" style={{ padding: '10px 24px' }}>Confirm</button>
                                            <button onClick={() => setIsEditingContact(false)} className="btn btn-outline" style={{ padding: '10px 24px' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</div>
                                            <div style={{ fontWeight: 600 }}>{contactInfo.firstName} {contactInfo.lastName}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</div>
                                            <div style={{ fontWeight: 600 }}>{contactInfo.email}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Step 2: Delivery */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '32px', height: '32px', background: '#0070f3', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>2</div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Fulfillment</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div onClick={() => setDeliveryMethod('pickup')} style={{ background: deliveryMethod === 'pickup' ? '#f0f7ff' : 'white', border: deliveryMethod === 'pickup' ? '2px solid #0070f3' : '1px solid #e2e8f0', borderRadius: '24px', padding: '24px', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 800, fontSize: '15px' }}>Dealership Pickup</span>
                                        {deliveryMethod === 'pickup' ? <CheckCircle2 size={20} color="#0070f3" /> : <Circle size={20} color="#e2e8f0" />}
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748b' }}>Pick up from our Denver location. Ready within 24 hours.</p>
                                    <div style={{ fontWeight: 800, color: '#059669', fontSize: '13px', marginTop: '12px' }}>FREE</div>
                                </div>
                                <div onClick={() => setDeliveryMethod('delivery')} style={{ background: deliveryMethod === 'delivery' ? '#f0f7ff' : 'white', border: deliveryMethod === 'delivery' ? '2px solid #0070f3' : '1px solid #e2e8f0', borderRadius: '24px', padding: '24px', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 800, fontSize: '15px' }}>Home Delivery</span>
                                        {deliveryMethod === 'delivery' ? <CheckCircle2 size={20} color="#0070f3" /> : <Circle size={20} color="#e2e8f0" />}
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748b' }}>Premium enclosed transport to your doorstep.</p>
                                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px', marginTop: '12px' }}>+Rs.499.00</div>
                                </div>
                            </div>
                        </section>

                        {/* Step 3: Payment */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '32px', height: '32px', background: '#0070f3', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>3</div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Payment Method</h2>
                            </div>
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                                    <button onClick={() => setPaymentMethod('card')} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: paymentMethod === 'card' ? '2px solid #0070f3' : '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Credit Card</button>
                                    <button onClick={() => setPaymentMethod('bank')} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: paymentMethod === 'bank' ? '2px solid #0070f3' : '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Bank Transfer</button>
                                </div>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <input type="text" placeholder="Card Number" style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <input type="text" placeholder="MM/YY" style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                        <input type="text" placeholder="CVC" style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT: Summary */}
                    <div style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ width: '80px', height: '60px', borderRadius: '12px', overflow: 'hidden', background: '#f1f5f9' }}>
                                    <img src={car.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '15px' }}>{car.brand} {car.carModel}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{car.year} • {car.city}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '24px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b' }}>Vehicle Price</span>
                                    <span style={{ fontWeight: 600 }}>Rs.{car.price?.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b' }}>Doc Fee</span>
                                    <span style={{ fontWeight: 600 }}>Rs.{docFee.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b' }}>Taxes & Title</span>
                                    <span style={{ fontWeight: 600 }}>Rs.{taxTitle.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, marginTop: '8px' }}>
                                    <span>Total Amount</span>
                                    <span>Rs.{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '16px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '15px', color: '#0070f3' }}>
                                    <span>Due Today</span>
                                    <span>Rs.{deposit.toLocaleString()}</span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#1e40af', marginTop: '8px', lineHeight: 1.5 }}>Reservation deposit. Fully refundable if your circumstances change.</div>
                            </div>

                            <button onClick={handlePlaceOrder} disabled={isProcessing} className="btn btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 800 }}>
                                {isProcessing ? 'Processing Securely...' : 'Secure Vehicle Now'}
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px', fontSize: '12px', color: '#94a3b8' }}>
                                <ShieldCheck size={14} color="#059669" /> TLS Secured Connection
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

