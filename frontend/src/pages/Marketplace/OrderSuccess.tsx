import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Calendar, ArrowRight, Home, Receipt, FileText } from 'lucide-react';
import { reportService } from '../../services/api';
import { useState } from 'react';

export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDownloading, setIsDownloading] = useState(false);
    const { order, car } = location.state || {};

    // Mock order number fallback if not available
    const orderNumber = order?._id?.slice(-8).toUpperCase() || "ASN-" + Math.floor(Math.random() * 900000 + 100000);

    const handleDownloadInvoice = async () => {
        if (!order?._id) return;
        setIsDownloading(true);
        try {
            const res = await reportService.getInvoice(order._id);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-SaiAuto-${orderNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            console.error("Download failed", err);
            alert("Could not download invoice. It has been sent to your email.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div style={{ maxWidth: '600px', width: '100%', background: 'white', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', padding: '48px', textAlign: 'center' }}>

                {/* Success Icon */}
                <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                    <CheckCircle2 color="#22c55e" size={48} />
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Order Placed Successfully!</h1>
                <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '40px' }}>
                    Your deposit of <strong>Rs.{order?.depositAmount?.toLocaleString() || '500.00'}</strong> has been received securely.
                </p>

                {/* Order Details Card */}
                <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '32px', textAlign: 'left', marginBottom: '40px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                        <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Order ID</span>
                        <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 800 }}>#{orderNumber}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '60px', borderRadius: '12px', overflow: 'hidden', background: 'white', border: '1px solid #e2e8f0' }}>
                                <img src={car?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{car?.brand} {car?.carModel}</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Reserved for you</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                <FileText size={20} color="#0070f3" />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Invoice Status</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>E-mailed to your address</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                <Calendar size={20} color="#0070f3" />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Status</div>
                                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 700 }}>PAID & RESERVED</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={handleDownloadInvoice}
                        disabled={isDownloading}
                        style={{
                            background: '#0070f3', color: 'white', border: 'none', padding: '18px', borderRadius: '16px',
                            fontWeight: 700, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                        }}
                    >
                        {isDownloading ? 'Generating Bill...' : <><Receipt size={20} /> Download Bill</>}
                    </button>

                    <button
                        onClick={() => navigate('/dashboard/orders')}
                        style={{
                            background: '#0f172a', color: 'white', border: 'none', padding: '18px', borderRadius: '16px',
                            fontWeight: 700, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                        }}
                    >
                        View My Orders <ArrowRight size={20} />
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'white', color: '#0f172a', border: '1px solid #e2e8f0', padding: '18px', borderRadius: '16px',
                            fontWeight: 700, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                        }}
                    >
                        <Home size={20} /> Back to Homepage
                    </button>
                </div>

                <p style={{ marginTop: '32px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                    A confirmation has been logged. Our delivery agent will contact you within 24 hours to schedule the final handover of your vehicle.
                </p>
            </div>
        </div>
    );
}
