import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
    ShieldCheck, Calendar, Gauge,
    Heart, Info, MapPin, CheckCircle2,
    Star, Zap, Settings, Car, BadgeCheck, Fuel
} from 'lucide-react';
import InquiryModal from '../../components/common/InquiryModal';

export default function VehicleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth() as any;
    const [activeImage, setActiveImage] = useState(0);
    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [inquiryCar, setInquiryCar] = useState<any>(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('buy') === 'true') {
            // Small delay to ensure render is complete
            setTimeout(() => {
                const actionCard = document.getElementById('purchase-panel');
                if (actionCard) {
                    actionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    actionCard.style.outline = '4px solid #0070f3';
                    actionCard.style.outlineOffset = '4px';
                    actionCard.style.transition = 'outline 0.5s';
                    setTimeout(() => { actionCard.style.outline = '4px solid transparent'; }, 3000);
                }
            }, 500);
        }
    }, [id]);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await carService.getById(id as string);
                setCar(res.data);
            } catch (err) {
                console.error("Failed to fetch car details", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleAction = async (type: string) => {
        if (!user) {
            alert("Please login to perform this action.");
            navigate('/login');
            return;
        }
        try {
            await bookingService.create({
                carId: car._id,
                buyerId: user._id || user.id,
                type: type,
                status: 'Pending',
                bookingDate: new Date()
            });
            alert(`${type === 'Wishlist' ? 'Added to Wishlist!' : type === 'Inquiry' ? 'Inquiry Sent Successfully!' : 'Test Drive Request Sent!'}`);
        } catch (err) {
            console.error(`Failed to ${type}`, err);
            alert("Action failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <p>Retrieving vehicle specifications...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error || !car) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Vehicle not found</h2>
                <p style={{ color: '#64748b' }}>The vehicle you're looking for might have been sold or removed.</p>
                <button onClick={() => navigate('/inventory')} className="btn btn-primary" style={{ marginTop: '24px' }}>Back to Inventory</button>
            </div>
        );
    }

    const status = car.status?.toLowerCase() || 'available';
    const isAvailable = status === 'available' || status === 'live';
    const isBooked = status === 'booked';
    const isReserved = status === 'reserved';
    const isSold = status === 'sold';

    const images = car.images?.length > 0 ? car.images : [car.imageUrl || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1200'];

    const specs = [
        { label: 'Year', val: car.year, icon: Calendar },
        { label: 'Mileage', val: `${car.mileage?.toLocaleString()} mi`, icon: Gauge },
        { label: 'Fuel Type', val: car.fuelType || 'Gasoline', icon: Fuel },
        { label: 'Transmission', val: car.transmission || 'Automatic', icon: Settings },
        { label: 'Drivetrain', val: car.drivetrain || 'AWD', icon: Zap },
        { label: 'Drivetrain Type', val: car.engine || 'Turbocharged', icon: Info }
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '48px' }}>
                    {/* LEFT COLUMN */}
                    <div>
                        <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', background: '#e2e8f0', height: '520px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                            <img src={images[activeImage]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        </div>

                        {images.length > 1 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '40px' }}>
                                {images.map((img: string, i: number) => (
                                    <div key={i} onClick={() => setActiveImage(i)} style={{ height: '80px', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', border: activeImage === i ? '3px solid #0070f3' : '3px solid transparent' }}>
                                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>CERTIFIED</span>
                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>NEW ARRIVAL</span>
                            </div>
                            <h1 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '12px', letterSpacing: '-1.5px' }}>{car.brand} {car.carModel}</h1>
                            <div style={{ color: '#64748b', fontSize: '15px', display: 'flex', gap: '20px', fontWeight: 500 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {car.city || 'Available Locally'}</span>
                                <span>• {car.year}</span>
                                <span>• VIN: {car.vin || 'Pending'}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
                            {specs.slice(0, 3).map((spec, i) => (
                                <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ color: '#94a3b8', marginBottom: '12px' }}><spec.icon size={20} /></div>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{spec.label}</div>
                                    <div style={{ fontWeight: 800, fontSize: '16px' }}>{spec.val}</div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>Premium Features</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                {['Advanced Safety Pack', 'Premium Sound System', 'Adaptive Cruise Control', 'Heated Seats & Steering', 'Panoramic Roof'].map((feat, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#334155', fontWeight: 500 }}>
                                        <CheckCircle2 size={18} color="#059669" /> {feat}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Action Card) */}
                    <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        <div id="purchase-panel" style={{ background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Purchase Price</div>
                                <div style={{ fontSize: '42px', fontWeight: 900, color: '#0f172a' }}>Rs.{car.price?.toLocaleString()}</div>
                                {isAvailable && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '14px', marginTop: '8px', fontWeight: 700 }}>
                                        <Zap size={14} fill="#059669" /> Ready for Immediate Delivery
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {/* Stage 1: Book Now (Token) */}
                                <div style={{ marginBottom: '8px' }}>
                                    <button
                                        onClick={() => isAvailable && navigate(`/booking/${car._id}`)}
                                        disabled={!isAvailable}
                                        style={{
                                            width: '100%', padding: '18px', borderRadius: '14px', fontWeight: 800, fontSize: '16px',
                                            background: isAvailable ? '#0070f3' : '#cbd5e1', color: 'white', border: 'none',
                                            cursor: isAvailable ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                                            boxShadow: isAvailable ? '0 10px 15px -3px rgba(0, 112, 243, 0.3)' : 'none'
                                        }}
                                    >
                                        {isAvailable ? 'Book Now (Refundable Deposit)' : 'Booking Unavailable'}
                                    </button>
                                    <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '8px', fontWeight: 600 }}>Reserve for 48 Hours • ₹500 Token</p>
                                </div>

                                {/* Stage 2: Place Order (Full) */}
                                <div style={{ marginBottom: '16px' }}>
                                    <button
                                        onClick={() => (isAvailable || isBooked) && navigate(`/checkout/${car._id}`)}
                                        disabled={isReserved || isSold}
                                        style={{
                                            width: '100%', padding: '18px', borderRadius: '14px', fontWeight: 800, fontSize: '16px',
                                            background: 'white', border: `2px solid ${(isReserved || isSold) ? '#e2e8f0' : '#0070f3'}`,
                                            color: (isReserved || isSold) ? '#94a3b8' : '#0070f3',
                                            cursor: (isReserved || isSold) ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isReserved ? 'Vehicle Reserved' : isSold ? 'Vehicle Sold' : 'Buy Full (Proceed to Checkout)'}
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleAction('Test Drive')}
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '14px', background: '#f8fafc',
                                        border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 700, fontSize: '14px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                    }}
                                >
                                    <Calendar size={18} /> Schedule Test Drive
                                </button>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        onClick={() => handleAction('Wishlist')}
                                        style={{
                                            padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                            background: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                        }}
                                    >
                                        <Heart size={14} /> Wishlist
                                    </button>
                                    <button
                                        onClick={() => setInquiryCar(car)}
                                        style={{
                                            padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                            background: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                        }}
                                    >
                                        <Info size={14} /> Inquiry
                                    </button>
                                </div>
                            </div>

                            {inquiryCar && (
                                <InquiryModal
                                    isOpen={!!inquiryCar}
                                    onClose={() => setInquiryCar(null)}
                                    car={inquiryCar}
                                />
                            )}

                            <div style={{ marginTop: '32px', borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0070f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '15px' }}>AutoSmart Premium</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#f59e0b', fontWeight: 700 }}>
                                            <Star size={14} fill="#f59e0b" /> 5.0 Rating
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                                        <ShieldCheck size={16} color="#0070f3" /> 7-Day Money Back Guarantee
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                                        <BadgeCheck size={16} color="#0070f3" /> Secure Dealership Transaction
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
