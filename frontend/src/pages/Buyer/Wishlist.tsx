import { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import {
    Heart, Trash2,
    Car, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BuyerWishlist() {
    const { user } = useAuth() as any;
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        if (!user) return;
        const currentUserId = user._id || user.id;

        try {
            const res = await bookingService.getAll(currentUserId);
            const data = res.data;
            const myWishlist = Array.isArray(data)
                ? data.filter((b: any) => {
                    const bid = b.buyerId?._id || b.buyerId;
                    return bid === currentUserId && (b.type === 'Wishlist' || b.type === 'Inquiry');
                })
                : [];
            setWishlist(myWishlist);
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const removeFromWishlist = async (id: string) => {
        if (!window.confirm("Remove this vehicle from your wishlist?")) return;
        try {
            await bookingService.delete(id);
            setWishlist(wishlist.filter(item => item._id !== id));
        } catch (err) {
            console.error("Failed to remove from wishlist", err);
            alert("Failed to remove item. Please try again.");
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your wishlist...</div>;

    return (
        <div className="animate-up">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800' }}>My Wishlist</h1>
                <p style={{ color: '#64748b' }}>Vehicles you've saved and are interested in.</p>
            </div>

            {wishlist.length === 0 ? (
                <div style={{
                    padding: '80px',
                    textAlign: 'center',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '32px'
                }}>
                    <Heart size={48} style={{ color: '#e2e8f0', marginBottom: '20px' }} />
                    <h3 style={{ color: '#64748b', marginBottom: '24px' }}>Your wishlist is empty.</h3>
                    <button
                        onClick={() => navigate('/inventory')}
                        style={{
                            background: '#004e82',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Browse Inventory
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {wishlist.map(item => (
                        <div key={item._id} style={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            transition: 'transform 0.2s'
                        }}>
                            <div style={{ height: '180px', background: '#f1f5f9', position: 'relative' }}>
                                {item.car?.imageUrl ? (
                                    <img src={item.car.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <Car size={40} color="#94a3b8" />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                    <button
                                        style={{
                                            background: 'rgba(255,255,255,0.9)',
                                            border: 'none',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            color: '#ef4444',
                                            cursor: 'pointer'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromWishlist(item._id);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                                    {item.car ? `${item.car.brand} ${item.car.carModel}` : 'Premium Vehicle'}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                                    Added on {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => navigate(`/car/${item.car?._id}`)}
                                        style={{
                                            flex: 1,
                                            background: '#004e82',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        View Details <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
