
import React, { useState } from 'react';
import { X, Send, Phone, User, Mail, MessageSquare } from 'lucide-react';
import { contactService } from '../../services/api';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    car: {
        _id: string;
        brand: string;
        carModel: string;
        price: number | string;
        imageUrl?: string;
    };
}

export default function InquiryModal({ isOpen, onClose, car }: InquiryModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: `I am interested in the ${car.brand} ${car.carModel}. Please provide more details.`
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await contactService.submit({
                ...formData,
                service: `Car Inquiry: ${car.brand} ${car.carModel}`
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Inquiry failed", error);
            alert("Failed to send inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Modal Content */}
            <div style={{
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: 'modalFadeIn 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc'
                }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#004e82', margin: 0 }}>Interested in this car?</h2>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Send an inquiry for {car.brand} {car.carModel}</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: '#64748b'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {success ? (
                    <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: '#f0fdf4',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: '#166534'
                        }}>
                            <Send size={32} />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Inquiry Sent!</h3>
                        <p style={{ color: '#64748b', lineHeight: 1.6 }}>Our vehicle experts have received your interest and will contact you shortly via phone or email.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {/* Inputs */}
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px 12px 42px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                                <input
                                    required
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px 12px 42px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '15px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                                <input
                                    required
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px 12px 42px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '15px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <MessageSquare size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                                <textarea
                                    rows={3}
                                    placeholder="Message (Optional)"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px 12px 42px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '15px',
                                        outline: 'none',
                                        resize: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => window.open(`https://wa.me/917350232331?text=${encodeURIComponent(formData.message)}`, '_blank')}
                                    style={{
                                        padding: '14px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        color: '#166534'
                                    }}
                                >
                                    WhatsApp
                                </button>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    style={{
                                        padding: '14px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: '#004e82',
                                        color: 'white',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {loading ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
