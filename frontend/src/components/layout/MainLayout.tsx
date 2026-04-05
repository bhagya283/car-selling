import { useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/api';
import { Search, LayoutDashboard, Star, MessageSquare, X, ChevronUp, Send } from 'lucide-react';

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth() as any;
    const [showReviewPanel, setShowReviewPanel] = useState(false);
    const [panelReviews, setPanelReviews] = useState<any[]>([]);
    const [panelLoading, setPanelLoading] = useState(false);

    // Review Form State
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewHover, setReviewHover] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    const handleSubmitReview = async () => {
        if (!user && !localStorage.getItem('user')) { alert('Please login to submit a review.'); return; }
        if (reviewRating === 0) { alert('Please select a star rating.'); return; }
        setSubmittingReview(true);

        let actualName = 'Anonymous Buyer';
        let actualId = 'unknown';

        const st = localStorage.getItem('user');
        if (st) {
            try {
                const p = JSON.parse(st);
                actualName = p.name || p.user?.name || p.fullName || user?.name || user?.user?.name || 'Anonymous Buyer';
                actualId = p._id || p.id || p.user?._id || user?._id || user?.id || 'unknown';
            } catch (e) {}
        } else {
            actualName = user?.name || user?.user?.name || user?.fullName || 'Anonymous Buyer';
            actualId = user?._id || user?.id || user?.user?._id || 'unknown';
        }

        try {
            // If on a car details page, associate it with the car.
            const isCarPage = location.pathname.startsWith('/car/');
            const carId = isCarPage ? location.pathname.split('/')[2] : undefined;

            const res = await reviewService.create({
                carId: carId,
                buyerId: actualId,
                buyerName: actualName,
                rating: reviewRating,
                comment: reviewComment,
            });
            
            setPanelReviews(prev => [res.data, ...prev]);
            setReviewRating(0);
            setReviewComment('');
            setReviewSuccess(true);
            setTimeout(() => {
                setReviewSuccess(false);
            }, 3000);
            
            // If on car page, hard reload so the bottom reviews section updates if needed
            if (isCarPage) {
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (err) {
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const openReviewPanel = async () => {
        setShowReviewPanel(true);
        if (panelReviews.length > 0) return;
        setPanelLoading(true);
        try {
            const res = await reviewService.getBySeller('');
            setPanelReviews(Array.isArray(res.data) ? res.data : []);
        } catch {
            setPanelReviews([]);
        } finally {
            setPanelLoading(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Inventory', path: '/inventory' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            {/* Navbar */}
            <nav style={{
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                padding: '4px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <img
                        src="/logo.png"
                        alt="Sai Automobiles"
                        onClick={() => navigate('/')}
                        style={{ height: '70px', width: 'auto', objectFit: 'contain', cursor: 'pointer' }}
                    />

                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: 600 }}>
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        textDecoration: 'none',
                                        color: isActive ? '#0f172a' : '#64748b',
                                        transition: 'color 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    {link.name}
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-4px',
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: '#004e82',
                                            borderRadius: '2px'
                                        }} />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Search size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => navigate('/inventory')} />
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => {
                                    const role = user.role?.toLowerCase();
                                    if (role === 'owner' || role === 'seller') {
                                        navigate('/owner/dashboard');
                                    } else {
                                        navigate('/dashboard');
                                    }
                                }}
                                style={{
                                    background: '#0f172a', color: 'white', border: 'none', padding: '10px 20px',
                                    borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <LayoutDashboard size={18} /> Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                style={{ background: 'none', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#64748b' }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <button
                                onClick={() => navigate('/login')}
                                style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer', color: '#0f172a' }}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                style={{ background: '#004e82', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Floating Review Button */}
            <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                {/* Review Slide-up Panel */}
                {showReviewPanel && (
                    <div style={{
                        width: '380px',
                        maxHeight: '520px',
                        background: 'white',
                        borderRadius: '24px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        {/* Panel Header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MessageSquare size={18} color="#0070f3" />
                                <span style={{ fontWeight: 800, fontSize: '16px', color: 'white' }}>Customer Reviews</span>
                            </div>
                            <button onClick={() => setShowReviewPanel(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                                <X size={16} />
                            </button>
                        </div>

                        {/* Panel Body */}
                        <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
                            {/* Input Form */}
                            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Leave a Review</div>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setReviewHover(star)}
                                            onMouseLeave={() => setReviewHover(0)}
                                            onClick={() => setReviewRating(star)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.1s' }}
                                        >
                                            <Star size={24} fill={(reviewHover || reviewRating) >= star ? '#f59e0b' : 'none'} color={(reviewHover || reviewRating) >= star ? '#f59e0b' : '#cbd5e1'} strokeWidth={1.5} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    placeholder="Share your experience..."
                                    rows={2}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
                                />
                                {reviewSuccess && (
                                    <div style={{ background: '#f0fdf4', color: '#166534', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
                                        Review submitted successfully!
                                    </div>
                                )}
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={submittingReview || reviewRating === 0}
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: reviewRating === 0 ? '#e2e8f0' : '#0070f3', color: reviewRating === 0 ? '#94a3b8' : 'white', fontWeight: 700, fontSize: '13px', cursor: reviewRating === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                                >
                                    <Send size={14} /> {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>

                            {/* Reviews List */}
                            {panelLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading reviews...</div>
                            ) : panelReviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                    <MessageSquare size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                                    <p style={{ margin: 0, fontWeight: 600 }}>No reviews yet</p>
                                </div>
                            ) : panelReviews.map((review: any, i: number) => (
                                <div key={review._id || i} style={{ padding: '16px', borderRadius: '14px', border: '1px solid #f1f5f9', marginBottom: '10px', background: '#fafafa' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{review.buyerName || 'Anonymous'}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={13}
                                                fill={review.rating >= s ? '#f59e0b' : 'none'}
                                                color={review.rating >= s ? '#f59e0b' : '#cbd5e1'}
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginLeft: '4px' }}>{['','Poor','Fair','Good','Very Good','Excellent'][review.rating]}</span>
                                    </div>
                                    {review.comment && (
                                        <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Panel Footer */}
                        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <button onClick={() => { setShowReviewPanel(false); }} style={{ fontSize: '13px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                <ChevronUp size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Close Panel
                            </button>
                        </div>
                    </div>
                )}

                {/* Floating Button */}
                <button
                    id="review-panel-toggle"
                    onClick={showReviewPanel ? () => setShowReviewPanel(false) : openReviewPanel}
                    style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: showReviewPanel ? '#0f172a' : '#0070f3',
                        border: 'none', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(0,112,243,0.4)',
                        transition: 'all 0.3s',
                        position: 'relative'
                    }}
                    title="View Customer Reviews"
                >
                    {showReviewPanel ? <X size={22} /> : <MessageSquare size={22} />}
                    {!showReviewPanel && panelReviews.length > 0 && (
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#f59e0b', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                            {panelReviews.length > 9 ? '9+' : panelReviews.length}
                        </span>
                    )}
                </button>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>

            {/* Footer */}
            <footer style={{ background: 'white', padding: '80px 40px', borderTop: '1px solid #e2e8f0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '60px', marginBottom: '60px' }}>
                        <div>
                            <div
                                onClick={() => navigate('/')}
                                style={{ cursor: 'pointer', marginBottom: '24px' }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="Sai Automobiles"
                                    style={{ height: '80px', width: 'auto' }}
                                />
                            </div>
                            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>The premier destination for high-quality certified pre-owned vehicles. Quality, transparency, and service at every turn.</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '24px' }}>Company</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                                <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
                                <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '24px' }}>Inventory</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                                <span>All Cars</span>
                                <span>SUVs</span>
                                <span>Sedans</span>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '24px' }}>Support</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                                <span>Terms of Service</span>
                                <span>Privacy Policy</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingTop: '40px', borderTop: '1px solid #f1f5f9', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        <p>© 2026 Sai Automobiles. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
