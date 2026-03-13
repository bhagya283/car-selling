import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Info, ShieldAlert, Clock } from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        // Demo notifications
        setNotifications([
            { title: 'Listing Approved', message: 'Your BMW M3 listing has been approved and is now live.', type: 'success', time: '1 hour ago' },
            { title: 'New Inquiry', message: 'You have a new test drive request for the Tesla Model 3.', type: 'info', time: '3 hours ago' },
            { title: 'Inspection Required', message: 'An inspection has been requested for your Audi Q8.', type: 'alert', time: '5 hours ago' },
        ]);
    }, []);

    return (
        <div className="animate-up">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Notifications</h1>
                <p style={{ color: 'var(--text-muted)' }}>Stay updated with your car listings and booking activity.</p>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                {notifications.map((n, i) => (
                    <div key={i} className="premium-card" style={{ padding: '24px', display: 'flex', gap: '20px' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '14px',
                            background: n.type === 'success' ? '#dcfce7' : n.type === 'alert' ? '#fee2e2' : '#e0e7ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {n.type === 'success' ? <CheckCircle color="#166534" /> : n.type === 'alert' ? <ShieldAlert color="#991b1b" /> : <Info color="#4338ca" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{n.title}</h3>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} /> {n.time}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{n.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
