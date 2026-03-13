import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import {
    User, Lock, Shield, X
} from 'lucide-react';

export default function BuyerProfile() {
    const { user, login } = useAuth() as any;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: ''
    });

    // Security States
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [is2faEnabled, setIs2faEnabled] = useState(false);

    // Update form data when user is available
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || ''
            });
            setIs2faEnabled(user.twoFactorEnabled || false);
        }
    }, [user]);

    if (!user) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

    const handleSave = async () => {
        setLoading(true);
        try {
            const rawId = user._id || user.id;
            const userId = rawId ? String(rawId) : null;

            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }
            const res = await userService.updateProfile(userId, formData);

            // Update the local storage and context
            const updatedUser = { ...user, ...res.data, role: user.role };
            login(updatedUser);

            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err: any) {
            console.error("Failed to update profile", err);
            const message = err.response?.data?.message || err.message || "Update failed.";
            alert(`Failed: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return alert("New passwords do not match!");
        }

        setPasswordLoading(true);
        try {
            const userId = user._id || user.id;
            await userService.changePassword(userId, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            alert("Password changed successfully!");
            setIsPasswordModalOpen(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            console.error("Failed to change password", err);
            alert(err.response?.data?.message || "Failed to change password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    const toggle2FA = async () => {
        const newState = !is2faEnabled;
        try {
            const userId = user._id || user.id;
            await userService.updateProfile(userId, { twoFactorEnabled: newState });
            setIs2faEnabled(newState);
            // Update auth context
            login({ ...user, twoFactorEnabled: newState });
            alert(`Two-Factor Authentication ${newState ? 'enabled' : 'disabled'}!`);
        } catch (err) {
            alert("Failed to update security settings.");
        }
    };

    return (
        <div className="animate-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Profile Settings</h1>
                <p style={{ color: '#64748b' }}>Manage your personal information and account security.</p>
            </div>

            <div style={{ display: 'grid', gap: '32px' }}>
                {/* 1. Account Info Section */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '32px', overflow: 'hidden' }}>
                    <div style={{ height: '140px', background: '#004e82', position: 'relative' }}>
                        <div style={{
                            position: 'absolute', bottom: '-40px', left: '40px',
                            width: '100px', height: '100px', borderRadius: '24px',
                            background: 'white', border: '4px solid white',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <User size={48} color="#004e82" />
                        </div>
                    </div>

                    <div style={{ padding: '60px 40px 40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{user?.name}</h3>
                                <p style={{ color: '#64748b', fontSize: '14px' }}>Member since March 2026</p>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        padding: '10px 24px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                        background: 'white', fontWeight: 700, cursor: 'pointer'
                                    }}
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        style={{
                                            padding: '10px 24px', borderRadius: '12px', border: 'none',
                                            background: '#f1f5f9', color: '#64748b', fontWeight: 700, cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        style={{
                                            padding: '10px 24px', borderRadius: '12px', border: 'none',
                                            background: '#004e82', color: 'white', fontWeight: 700,
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* Fields remain same... */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Full Name</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: isEditing ? 'white' : '#f8fafc' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Email Address</label>
                                <input
                                    type="email"
                                    disabled={!isEditing}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: isEditing ? 'white' : '#f8fafc' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Phone Number</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: isEditing ? 'white' : '#f8fafc' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>City</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: isEditing ? 'white' : '#f8fafc' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Security Section */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '32px', padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: '#f0f7ff', color: '#004e82',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Account Security</h3>
                                <p style={{ color: '#64748b', fontSize: '14px' }}>Update your password and manage security settings.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            style={{
                                padding: '10px 24px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                background: 'white', fontWeight: 700, cursor: 'pointer'
                            }}
                        >
                            Change Password
                        </button>
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '24px', background: is2faEnabled ? '#f0fdf4' : '#f8fafc', borderRadius: '24px',
                        border: `1px solid ${is2faEnabled ? '#bbf7d0' : '#e2e8f0'}`,
                        transition: 'all 0.3s ease'
                    }}>
                        <Shield size={24} color={is2faEnabled ? '#10b981' : '#94a3b8'} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Two-Factor Authentication</div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                                {is2faEnabled ? 'Your account is protected with 2FA.' : 'Add an extra layer of security to your account.'}
                            </div>
                        </div>
                        <div
                            onClick={toggle2FA}
                            style={{
                                width: '52px', height: '28px',
                                background: is2faEnabled ? '#10b981' : '#cbd5e1',
                                borderRadius: '100px', position: 'relative', cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{
                                width: '22px', height: '22px', background: 'white',
                                borderRadius: '50%', position: 'absolute',
                                left: is2faEnabled ? '26px' : '4px', top: '3px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {isPasswordModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white', padding: '40px', borderRadius: '32px',
                        width: '100%', maxWidth: '440px', position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsPasswordModalOpen(false)}
                            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Change Password</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Enter your current and new password below.</p>

                        <form onSubmit={handlePasswordChange} style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>CURRENT PASSWORD</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>NEW PASSWORD</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>CONFIRM NEW PASSWORD</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                style={{
                                    marginTop: '12px', padding: '16px', borderRadius: '12px',
                                    background: '#004e82', color: 'white', fontWeight: 700,
                                    border: 'none', cursor: passwordLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

