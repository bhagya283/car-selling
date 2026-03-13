import { useEffect, useState } from 'react';
import { contactService } from '../../services/api';
import { Mail, Phone, User, MessageCircle, Calendar, CheckCircle2, Trash2, ExternalLink } from 'lucide-react';

export default function SellerLeads() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await contactService.getAll();
                setLeads(res.data);
            } catch (err) {
                console.error("Failed to fetch leads", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const markAsContacted = async (id: string) => {
        try {
            await contactService.markContacted(id);
            setLeads(leads.map(l => l._id === id ? { ...l, status: 'contacted' } : l));
        } catch (err) {
            console.error("Failed to update lead", err);
        }
    };

    const deleteLead = async (id: string) => {
        if (!window.confirm("Are you sure you want to remove this inquiry?")) return;
        try {
            await contactService.delete(id);
            setLeads(leads.filter(l => l._id !== id));
        } catch (err) {
            console.error("Failed to delete lead", err);
        }
    };

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Sales Leads & Inquiries</h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Manage incoming messages from interested buyers</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '8px 16px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600 }}>
                        Total Leads: {leads.length}
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p style={{ color: '#64748b' }}>Fetching your latest inquiries...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : leads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <MessageCircle size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>No inquiries yet</h3>
                    <p style={{ color: '#64748b' }}>When buyers use the "Inquiry" button on car listings, they will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                    {leads.map((lead) => (
                        <div key={lead._id} style={{
                            background: 'white',
                            padding: '28px',
                            borderRadius: '24px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            position: 'relative',
                            opacity: lead.status === 'contacted' ? 0.7 : 1
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: '#f0f7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0070f3' }}>
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{lead.name}</h3>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={12} /> {new Date(lead.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    background: lead.status === 'contacted' ? '#f0fdf4' : '#fff7ed',
                                    color: lead.status === 'contacted' ? '#16a34a' : '#c2410c'
                                }}>
                                    {lead.status === 'contacted' ? 'CONTACTED' : 'NEW'}
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Enquiry About</div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#004e82', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {lead.service || 'General Inquiry'}
                                </div>
                                <div style={{ marginTop: '12px', fontSize: '13px', color: '#475569', lineHeight: 1.5, fontStyle: 'italic' }}>
                                    "{lead.message}"
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                    <Mail size={14} /> {lead.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                    <Phone size={14} /> {lead.phone}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                                {lead.status !== 'contacted' ? (
                                    <button
                                        onClick={() => markAsContacted(lead._id)}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '10px', background: '#0070f3', color: 'white',
                                            border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        <CheckCircle2 size={16} /> Mark Contacted
                                    </button>
                                ) : (
                                    <div style={{ flex: 1, textAlign: 'center', color: '#16a34a', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <CheckCircle2 size={16} /> Contacted
                                    </div>
                                )}
                                <button
                                    onClick={() => deleteLead(lead._id)}
                                    style={{
                                        padding: '10px', borderRadius: '10px', background: 'white', border: '1px solid #fee2e2',
                                        color: '#ef4444', cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')}
                                    style={{
                                        padding: '10px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #dcfce7',
                                        color: '#16a34a', cursor: 'pointer'
                                    }}
                                >
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
