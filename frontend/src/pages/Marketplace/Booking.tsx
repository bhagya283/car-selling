import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carService, orderService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
    Wallet, ShieldCheck,
    ChevronLeft, Lock, Info
} from 'lucide-react';

export default function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth() as any;

    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const tokenAmount = 500; // Standard refundable deposit

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await carService.getById(id as string);
                const status = res.data.status?.toLowerCase();
                if (status !== 'available' && status !== undefined) {
                    alert("This vehicle is already booked or reserved.");
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

    const handleBooking = async () => {
        if (!car || !agreedToTerms) return;
        setIsProcessing(true);
        try {
            // 1. Create Booking Record (Stage 1)
            // Using a generic create for now, assuming the API supports this or we'll wrap it
            await orderService.create({
                carId: car._id,
                buyerId: user?._id || user?.id,
                totalAmount: car.price,
                depositAmount: tokenAmount,
                type: 'booking',
                status: 'paid'
            });

            // 2. Update Vehicle Status to 'Booked'
            await carService.updateStatus(car._id, 'Booked');

            // 3. Success Feedback
            alert("Vehicle Booked Successfully! You have 48 hours to complete the full purchase.");
            navigate('/dashboard/orders');
        } catch (err) {
            console.error("Booking failed", err);
            alert("Booking process failed. Please contact our support.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading || !car) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate(`/car/${car._id}`)}
                    style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '32px' }}
                >
                    <ChevronLeft size={20} /> Back to Specs
                </button>

                <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
                    {/* Header */}
                    <div style={{ background: '#0f172a', padding: '40px', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#38bdf8' }}>
                            <Wallet size={24} />
                            <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Priority Reservation</span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Book Your {car.brand} {car.carModel}</h1>
                        <p style={{ color: '#94a3b8' }}>Secure this vehicle while you finalize your financing and inspection.</p>
                    </div>

                    <div style={{ padding: '40px' }}>
                        {/* Vehicle Preview */}
                        <div style={{ display: 'flex', gap: '24px', background: '#f8fafc', padding: '24px', borderRadius: '24px', marginBottom: '40px', border: '1px solid #e2e8f0' }}>
                            <div style={{ width: '120px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src={car.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{car.brand} {car.carModel}</h3>
                                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>{car.year} • {car.mileage?.toLocaleString()} miles</div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>Rs.{car.price?.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Reservation Summary</h2>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Refundable Deposit</span>
                                    <span style={{ fontWeight: 800, fontSize: '18px' }}>Rs.{tokenAmount.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', background: '#f0f9ff', padding: '20px', borderRadius: '16px' }}>
                                    <Info size={20} color="#0070f3" style={{ flexShrink: 0 }} />
                                    <p style={{ fontSize: '13px', color: '#1e40af', lineHeight: 1.6 }}>By paying this token, the vehicle status will change to **BOOKED**. We will hold this car for you for exactly **48 hours**. If you don't proceed to checkout or visit the showroom, the car will return to the inventory.</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Simulation */}
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <Lock size={16} color="#64748b" />
                                <span style={{ fontSize: '14px', fontWeight: 800 }}>Secure Payment Simulation</span>
                            </div>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        style={{ marginTop: '4px', width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>I understand that this Rs.500 deposit secures the vehicle for 48 hours and is fully refundable if I choose not to proceed after inspection.</span>
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={!agreedToTerms || isProcessing}
                            style={{
                                width: '100%',
                                padding: '20px',
                                borderRadius: '16px',
                                background: !agreedToTerms ? '#cbd5e1' : '#0070f3',
                                color: 'white',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '17px',
                                cursor: agreedToTerms ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px'
                            }}
                        >
                            {isProcessing ? 'Processing Securely...' : 'Pay Deposit & Book Vehicle'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px', fontSize: '12px', color: '#94a3b8' }}>
                            <ShieldCheck size={14} color="#059669" /> 256-bit SSL Encrypted Payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
