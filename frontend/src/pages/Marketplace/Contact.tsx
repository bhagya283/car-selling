import { useEffect, useState } from "react";
import {
    MapPin, Phone, Mail,
    MessageSquare,
    Clock, Star,
    Shield
} from "lucide-react";

import ContactForm from "../../components/contact/ContactForm";

const Contact = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        document.title = "Contact Sai Automobiles | Luxury Car Dealership";
        setIsVisible(true);
    }, []);

    const fadeInUp = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
    };

    return (
        <div style={{ background: "#fcfcfd", minHeight: "100vh", overflowX: "hidden" }}>
            {/* --- PREMIUM HERO SECTION (Theme Sync: About Us) --- */}
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
                    transform: isVisible ? 'scale(1)' : 'scale(1.1)',
                    transition: 'transform 8s ease-out',
                    filter: 'brightness(0.5)'
                }}>
                    <img
                        src="/C:/Users/BHAGSHREE%20MAHAJAN/.gemini/antigravity/brain/516b1beb-4c38-46f9-a04e-3981e085abfc/sai_automobiles_contact_hero_v3_1772976860712.png"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="Contact Sai Automobiles"
                    />
                </div>

                {/* Theme Overlay - Matches About.tsx Exactly */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #0f172a 0%, transparent 60%), linear-gradient(to right, rgba(15, 23, 42, 0.8) 0%, transparent 100%)',
                    zIndex: 1
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
                    <div style={{ ...fadeInUp, transitionDelay: '0.2s' }}>
                        {/* Floating Badge - Matches About Style */}
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
                            GET IN <span style={{ color: '#38bdf8' }}>TOUCH</span>
                        </h1>

                        <p style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            maxWidth: '700px',
                            margin: '0 auto 48px',
                            opacity: 0.8,
                            lineHeight: 1.6,
                            fontWeight: 500
                        }}>
                            Experience personalized vehicle consulting. Our experts at
                            Sai Automobiles are ready to assist you in finding your dream masterpiece.
                        </p>
                    </div>
                </div>

                {/* Animated Scroll Indicator - Matches About Theme */}
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

            {/* --- MAIN CONTENT --- */}
            <section style={{ padding: '80px 0', marginTop: '-60px', position: 'relative', zIndex: 10 }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px' }}>

                        {/* LEFT: FORM CARD */}
                        <div style={{
                            background: 'white',
                            padding: '48px',
                            borderRadius: '32px',
                            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.08)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#004e82', fontWeight: 800, fontSize: '14px', marginBottom: '12px' }}>
                                    <MessageSquare size={16} /> SEND US A MESSAGE
                                </div>
                                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '12px' }}>How can we help?</h2>
                                <p style={{ color: '#64748b' }}>Our team typically responds within 2 business hours.</p>
                            </div>
                            <ContactForm />
                        </div>

                        {/* RIGHT: INFO STACK */}
                        <div style={{ display: 'grid', gap: '24px' }}>
                            {/* Company Card */}
                            <div style={{
                                background: '#ffffff',
                                padding: '40px',
                                borderRadius: '32px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)'
                            }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '32px', color: '#0f172a' }}>Contact Information</h3>

                                <div style={{ display: 'grid', gap: '32px' }}>
                                    <ContactItem
                                        icon={MapPin}
                                        label="Our Showroom"
                                        value={<>Pawar Section, Near Jai Malhar Dhaba,<br />Pipeline Road, Ambernath East</>}
                                    />
                                    <ContactItem
                                        icon={Phone}
                                        label="Direct Line"
                                        value="+91 73502 32331"
                                    />
                                    <ContactItem
                                        icon={Mail}
                                        label="Corporate Email"
                                        value="harsh.s.vajani@gmail.com"
                                    />
                                </div>
                            </div>

                            {/* Map Card */}
                            <div style={{
                                background: 'white',
                                padding: '12px',
                                borderRadius: '32px',
                                border: '1px solid #f1f5f9',
                                height: '300px',
                                overflow: 'hidden'
                            }}>
                                <iframe
                                    title="Sai Automobiles Location"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '24px' }}
                                    loading="lazy"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.618!2d73.2!3d19.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEyJzAwLjAiTiA3M8KwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TRUST BAR --- */}
            <section style={{ padding: '80px 0', borderTop: '1px solid #f1f5f9', background: '#ffffff' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                        {[
                            { icon: Shield, title: 'Verified Experts', text: 'Our consultants are certified by automobile industry standards.' },
                            { icon: Clock, title: 'Fast Response', text: 'Get personalized vehicle advice within the hour.' },
                            { icon: Star, title: 'Client First', text: 'Every inquiry is handled with the highest level of priority.' }
                        ].map((item, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '0 20px' }} className="trust-item">
                                <div style={{
                                    color: '#004e82', // Applied Deep Dark Blue
                                    marginBottom: '20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <item.icon size={36} strokeWidth={2.5} />
                                </div>
                                <h4 style={{ fontWeight: 900, marginBottom: '12px', color: '#0f172a', fontSize: '18px' }}>{item.title}</h4>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

// Helper Component
const ContactItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: any }) => (
    <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{
            width: '52px',
            height: '52px',
            background: '#f8fafc',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#004e82',
            border: '1px solid #f1f5f9',
            flexShrink: 0
        }}>
            <Icon size={24} />
        </div>
        <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', lineHeight: 1.5 }}>{value}</div>
        </div>
    </div>
);

export default Contact;
