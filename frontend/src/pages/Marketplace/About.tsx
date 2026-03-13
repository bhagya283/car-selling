import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, Wallet, Car,
    Users, Phone, Mail,
    Heart, Search, ClipboardCheck,
    Calendar, Lock, Truck,
    Award, Star, MapPin,
    ChevronRight, ArrowRight,
    CheckCircle2, Info
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function About() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const fadeInUp = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
    };

    return (
        <div style={{ background: '#fcfcfd', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* --- HERO SECTION --- */}
            <section style={{
                position: 'relative',
                height: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                overflow: 'hidden',
                background: '#0f172a'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    transform: 'scale(1.1)',
                    filter: 'brightness(0.5)'
                }}>
                    <img
                        src="/C:/Users/BHAGSHREE%20MAHAJAN/.gemini/antigravity/brain/516b1beb-4c38-46f9-a04e-3981e085abfc/sai_automobiles_showroom_hero_1772975808380.png"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="Sai Automobiles Showroom"
                    />
                </div>

                {/* Gradient Overlay for Depth */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #0f172a 0%, transparent 60%), linear-gradient(to right, rgba(15, 23, 42, 0.8) 0%, transparent 100%)',
                    zIndex: 1
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
                    <div style={{ ...fadeInUp, transitionDelay: '0.2s' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            padding: '8px 20px',
                            borderRadius: '100px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            fontSize: '14px',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            marginBottom: '32px'
                        }}>
                            <Star size={14} fill="#f59e0b" color="#f59e0b" /> SINCE 2025 • AMBERNATH'S FINEST
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(40px, 8vw, 84px)',
                            fontWeight: 900,
                            lineHeight: 1.1,
                            marginBottom: '24px',
                            letterSpacing: '-0.02em',
                            color: '#ffffff',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}>
                            <span style={{ color: '#38bdf8' }}>SAI</span> AUTOMOBILES
                        </h1>
                        <p style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            maxWidth: '700px',
                            margin: '0 auto 48px',
                            opacity: 0.8,
                            lineHeight: 1.6,
                            fontWeight: 500
                        }}>
                            Revolutionizing the pre-owned vehicle market with transparency,
                            integrity, and a relentless focus on quality engineering.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button
                                onClick={() => navigate('/inventory')}
                                className="nav-btn-premium"
                                style={{
                                    background: '#38bdf8',
                                    color: '#0f172a',
                                    padding: '18px 40px',
                                    borderRadius: '16px',
                                    fontWeight: 800,
                                    fontSize: '16px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 20px 40px -10px rgba(56, 189, 248, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                Explore Collection <ChevronRight size={20} />
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                style={{
                                    background: 'transparent',
                                    color: 'white',
                                    padding: '18px 40px',
                                    borderRadius: '16px',
                                    fontWeight: 800,
                                    fontSize: '16px',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                Get in Touch
                            </button>
                        </div>
                    </div>
                </div>

                {/* Animated Scroll Indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    animation: 'bounce 2s infinite'
                }}>
                    <div style={{ width: '30px', height: '50px', borderRadius: '15px', border: '2px solid rgba(255,255,255,0.3)', position: 'relative' }}>
                        <div style={{ width: '4px', height: '8px', background: 'white', borderRadius: '2px', position: 'absolute', top: '8px', left: '11px', animation: 'scroll 2s infinite' }}></div>
                    </div>
                </div>
            </section>

            {/* --- STATS RIBBON --- */}
            <section style={{
                background: 'white',
                padding: '0',
                marginTop: '-50px',
                position: 'relative',
                zIndex: 10,
                maxWidth: '1200px',
                margin: '-50px auto 0',
                borderRadius: '32px',
                boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '40px' }}>
                    {[
                        { val: '250+', label: 'Verified Cars', icon: Car },
                        { val: '100%', label: 'Transparency', icon: ShieldCheck },
                        { val: '4.9/5', label: 'Client Rating', icon: Star },
                        { val: '24h', label: 'Hassle-Free', icon: Truck },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            textAlign: 'center',
                            borderRight: i === 3 ? 'none' : '1px solid #f1f5f9',
                            padding: '0 20px'
                        }}>
                            <div style={{ color: '#38bdf8', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                                <stat.icon size={24} />
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a' }}>{stat.val}</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- ABOUT DESCRIPTION --- */}
            <section style={{ padding: '120px 0' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '100%',
                                height: '500px',
                                borderRadius: '40px',
                                overflow: 'hidden',
                                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.2)'
                            }}>
                                <img src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Quality Check" />
                            </div>
                            {/* Floating Card */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '-30px',
                                background: '#0f172a',
                                color: 'white',
                                padding: '32px',
                                borderRadius: '24px',
                                width: '260px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                            }}>
                                <Award color="#38bdf8" size={32} style={{ marginBottom: '16px' }} />
                                <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Unmatched Quality</h4>
                                <p style={{ fontSize: '13px', opacity: 0.7, lineHeight: 1.5 }}>Every single vehicle passes a rigorous 150-point technical inspection before it joins our elite inventory.</p>
                            </div>
                        </div>

                        <div>
                            <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>OUR STORY</div>
                            <h2 style={{ fontSize: '48px', fontWeight: 900, color: '#0f172a', marginBottom: '32px', lineHeight: 1.1, letterSpacing: '-1px' }}>
                                A Legacy Built on <br />
                                <span style={{ color: '#004e82' }}>Second Chances.</span>
                            </h2>
                            <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.8, marginBottom: '24px' }}>
                                Based in the heart of <b>Ambernath</b>, Maharashtra, <b>Sai Automobiles</b> was founded with a singular vision: to eliminate the uncertainty associated with buying pre-owned vehicles.
                            </p>
                            <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.8, marginBottom: '40px' }}>
                                Under the leadership of <b>Harsh S. Vajani</b>, we have grown into a tech-forward dealership that combines old-school integrity with modern digital convenience. Whether it's your first car or a luxury upgrade, we treat every transaction as a partnership.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {[
                                    '150-Point Technical Check',
                                    'Instant Digital Paperwork',
                                    '7-Day Money Back Trial',
                                    'Pan-India Delivery Network'
                                ].map((tick, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 700, color: '#334155' }}>
                                        <CheckCircle2 size={18} color="#22c55e" /> {tick}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE PROPRIETOR / MISSION --- */}
            <section style={{ padding: '120px 0', background: '#0f172a', color: 'white', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>

                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Users color="#38bdf8" size={48} style={{ marginBottom: '32px' }} />
                    <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '48px' }}>Proprietor's Vision</h2>
                    <p style={{ fontSize: '24px', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.6, marginBottom: '48px', color: '#cbd5e1' }}>
                        "At Sai Automobiles, we don't just sell cars; we sell confidence. Our goal is to ensure that every mile you drive is powered by the trust you placed in us. We are building the future of pre-owned automotive commerce, one happy customer at a time."
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#38bdf8', overflow: 'hidden', border: '2px solid white' }}>
                            <img src="https://ui-avatars.com/api/?name=Harsh+Vajani&background=38bdf8&color=fff" style={{ width: '100%', height: '100%' }} alt="Harsh S. Vajani" />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800 }}>Harsh S. Vajani</div>
                            <div style={{ fontSize: '14px', color: '#38bdf8', fontWeight: 700 }}>Founder & Proprietor</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INTERACTIVE PROCESS --- */}
            <section style={{ padding: '120px 0' }}>
                <div className="container" style={{ padding: '0 40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#0f172a' }}>The Sai Automobiles Experience</h2>
                        <p style={{ color: '#64748b', fontSize: '17px' }}>Fast, Transparent, and Professional</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {[
                            { icon: Search, title: 'Discovery', text: 'Browse our curated collection of verified vehicles online.' },
                            { icon: ClipboardCheck, title: 'Inspection', text: 'Review detailed inspection reports and vehicle history.' },
                            { icon: Calendar, title: 'Test Drive', text: 'Schedule a personalized viewing at our Ambernath lounge.' },
                            { icon: Truck, title: 'Take Home', text: 'Complete digital paperwork and drive home in 45 mins.' }
                        ].map((step, i) => (
                            <div key={i} className="hover-card" style={{
                                padding: '40px',
                                background: 'white',
                                borderRadius: '32px',
                                border: '1px solid #f1f5f9',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: '#f8fafc',
                                    borderRadius: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px',
                                    color: '#004e82'
                                }}>
                                    <step.icon size={28} />
                                </div>
                                <h4 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>{step.title}</h4>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CONTACT STRIP --- */}
            <section style={{ padding: '100px 0', borderTop: '1px solid #f1f5f9' }}>
                <div className="container" style={{ padding: '0 40px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #004e82 100%)',
                        borderRadius: '40px',
                        padding: '80px',
                        color: 'white',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '60px',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '24px' }}>Visit Our Showroom</h2>
                            <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px', lineHeight: 1.6 }}>
                                Experience the quality firsthand. Visit us in Ambernath for a premium car-buying experience unlike any other.
                            </p>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={24} color="#38bdf8" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Our Location</div>
                                        <div style={{ fontSize: '15px', fontWeight: 600 }}>Pawar Section, Near Jai Malhar Dhaba,<br />Pipeline Road, Ambernath East, Thane - 421501</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone size={24} color="#38bdf8" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Phone</div>
                                        <div style={{ fontSize: '15px', fontWeight: 600 }}>+91 7350232331</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Mail size={24} color="#38bdf8" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Email</div>
                                        <div style={{ fontSize: '15px', fontWeight: 600 }}>harsh.s.vajani@gmail.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '60px 40px',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                            backdropFilter: 'blur(20px)'
                        }}>
                            <h3 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>Ready to Find Your Next Car?</h3>
                            <p style={{ opacity: 0.7, fontSize: '16px', marginBottom: '40px' }}>Our specialists are waiting to help you make the right choice.</p>

                            <button
                                onClick={() => navigate('/contact')}
                                style={{
                                    padding: '20px 40px',
                                    borderRadius: '16px',
                                    background: '#ffffff',
                                    color: '#0f172a',
                                    border: 'none',
                                    fontWeight: 900,
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    margin: '0 auto',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                                }}
                            >
                                Contact Our Team <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GLOBAL STYLES & ANIMATIONS --- */}
            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0) translateX(-50%);}
                    40% {transform: translateY(-10px) translateX(-50%);}
                    60% {transform: translateY(-5px) translateX(-50%);}
                }
                @keyframes scroll {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(15px); opacity: 0; }
                }
                .hover-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.1);
                    border-color: #38bdf8;
                }
                .nav-btn-premium:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 25px 50px -12px rgba(56, 189, 248, 0.5);
                }
            `}</style>
        </div>
    );
}
