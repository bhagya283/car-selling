import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carService } from '../../services/api';
import { Plus, Edit2, Trash2, Eye, DollarSign, Package, CheckCircle, Car, Search, Hash, Calendar, Gauge, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OwnerInventory() {
    const navigate = useNavigate();
    const { user } = useAuth() as any;
    const [myCars, setMyCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCar, setEditingCar] = useState<any>(null);

    const initialFormData = {
        brand: '',
        carModel: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        vin: '',
        fuelType: 'Gasoline',
        status: 'Available',
        imageUrl: '',
        images: ['', '', '', '']
    };

    const [formData, setFormData] = useState(initialFormData);

    const fetchMyCars = async () => {
        try {
            setLoading(true);
            const res = await carService.getAll();
            setMyCars(res.data);
        } catch (err) {
            console.error("Failed to fetch inventory", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyCars(); }, []);

    const handleAddOrEditCar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Use the first valid image as the main imageUrl if not provided
            const firstValidImage = formData.images.find(img => img.trim() !== '') || formData.imageUrl;

            const data = {
                ...formData,
                imageUrl: firstValidImage,
                price: Number(formData.price),
                mileage: Number(formData.mileage),
                year: Number(formData.year),
                sellerId: user?._id || user?.sub
            };

            if (editingCar) {
                await carService.update(editingCar._id, data);
                alert("Car updated successfully!");
            } else {
                await carService.create(data);
                alert("Car added to inventory!");
            }

            setShowModal(false);
            setEditingCar(null);
            setFormData(initialFormData);
            fetchMyCars();
        } catch (err) {
            console.error("Failed to save car", err);
            alert("Error saving car details.");
        }
    };

    const openEditModal = (car: any) => {
        setEditingCar(car);
        setFormData({
            brand: car.brand,
            carModel: car.carModel,
            year: car.year,
            price: car.price,
            mileage: car.mileage,
            vin: car.vin || '',
            fuelType: car.fuelType || 'Gasoline',
            status: car.status || 'Available',
            imageUrl: car.imageUrl || '',
            images: car.images && car.images.length >= 4 ? car.images :
                (car.images?.length > 0 ? [...car.images, ...Array(4 - car.images.length).fill('')] : ['', '', '', ''])
        });
        setShowModal(true);
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await carService.updateStatus(id, status);
            fetchMyCars();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this vehicle from inventory?")) {
            try {
                await carService.delete(id);
                fetchMyCars();
            } catch (err) {
                console.error("Failed to delete car", err);
            }
        }
    };

    const filteredCars = myCars.filter(car =>
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.carModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.vin?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {[
                    { label: 'Active Inventory', value: myCars.length, icon: Package, color: '#0070f3', bg: '#f0f7ff' },
                    { label: 'Inventory Value', value: 'Rs.' + (myCars.reduce((acc, curr) => acc + (curr.price || 0), 0) / 1000000).toFixed(1) + 'M', icon: DollarSign, color: '#10b981', bg: '#f0fdf4' },
                    { label: 'Avg. Days on Lot', value: '14 Days', icon: Calendar, color: '#6366f1', bg: '#f5f5ff' },
                    { label: 'Sales Status', value: 'Online', icon: CheckCircle, color: '#f59e0b', bg: '#fffbeb' },
                ].map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>{stat.label}</span>
                            <div style={{ width: '36px', height: '36px', background: stat.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <stat.icon size={18} color={stat.color} />
                            </div>
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Vehicle Inventory</h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Manage your dealership's available stock</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '11px' }} />
                        <input
                            type="text"
                            placeholder="Search by model or VIN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px 16px 10px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', width: '240px' }}
                        />
                    </div>
                    <button onClick={() => { setEditingCar(null); setFormData(initialFormData); setShowModal(true); }} style={{ background: '#0070f3', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add Vehicle
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>VEHICLE DETAILS</th>
                            <th style={{ padding: '20px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>VIN / ID</th>
                            <th style={{ padding: '20px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>STATUS</th>
                            <th style={{ padding: '20px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>PRICE</th>
                            <th style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 700, color: '#64748b', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Loading inventory...</td></tr>
                        ) : filteredCars.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>No vehicles match your search.</td></tr>
                        ) : filteredCars.map(car => (
                            <tr key={car._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#f1f5f9', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                        {car.imageUrl ? <img src={car.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><Car size={24} /></div>}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{car.brand} {car.carModel}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{car.year} • {car.mileage?.toLocaleString()} mi</div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{car.vin || `INV-${car._id?.substr(-5)}`}</td>
                                <td style={{ padding: '20px 16px' }}>
                                    <span style={{
                                        background: (!car.status || car.status.toLowerCase() === 'available') ? '#f0fdf4' :
                                            car.status.toLowerCase() === 'booked' ? '#f5f3ff' :
                                                car.status.toLowerCase() === 'reserved' ? '#fff7ed' : '#fef2f2',
                                        color: (!car.status || car.status.toLowerCase() === 'available') ? '#10b981' :
                                            car.status.toLowerCase() === 'booked' ? '#6366f1' :
                                                car.status.toLowerCase() === 'reserved' ? '#f59e0b' : '#ef4444',
                                        padding: '4px 10px',
                                        borderRadius: '80px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase'
                                    }}>{car.status || 'Available'}</span>
                                </td>
                                <td style={{ padding: '20px 16px', fontWeight: '800', color: '#0f172a' }}>
                                    Rs.{car.price?.toLocaleString()}
                                    {car.status?.toLowerCase() === 'reserved' && (
                                        <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '2px' }}>[IN CHECKOUT]</div>
                                    )}
                                    {car.status?.toLowerCase() === 'sold' && (
                                        <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '2px' }}>[PURCHASED]</div>
                                    )}
                                </td>
                                <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <select
                                            value={car.status || 'Available'}
                                            onChange={(e) => handleStatusUpdate(car._id, e.target.value)}
                                            style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Booked">Booked</option>
                                            <option value="Reserved">Reserved</option>
                                            <option value="Sold">Sold</option>
                                        </select>
                                        <button
                                            onClick={() => navigate(`/car/${car._id}`)}
                                            style={{ padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer' }} title="View Public Page"><Eye size={16} /></button>
                                        <button
                                            onClick={() => openEditModal(car)}
                                            style={{ padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#0070f3', cursor: 'pointer' }} title="Edit"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(car._id)} style={{ padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Add/Edit */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '560px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}>
                            <X size={20} color="#64748b" />
                        </button>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Enter the vehicle specifications to publish to inventory</p>
                        </div>

                        <form onSubmit={handleAddOrEditCar}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>BRAND</label>
                                    <div style={{ position: 'relative' }}>
                                        <Car size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                                        <input
                                            required
                                            placeholder="e.g. Porsche"
                                            value={formData.brand}
                                            onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>MODEL</label>
                                    <input
                                        required
                                        placeholder="e.g. 911 GT3"
                                        value={formData.carModel}
                                        onChange={e => setFormData({ ...formData, carModel: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>YEAR</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                                        <input
                                            required
                                            type="number"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>PRICE (Rs.)</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#22c55e' }} />
                                        <input
                                            required
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>MILEAGE (MI)</label>
                                    <div style={{ position: 'relative' }}>
                                        <Gauge size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                                        <input
                                            required
                                            type="number"
                                            placeholder="0"
                                            value={formData.mileage}
                                            onChange={e => setFormData({ ...formData, mileage: e.target.value })}
                                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>VIN</label>
                                    <div style={{ position: 'relative' }}>
                                        <Hash size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                                        <input
                                            required
                                            placeholder="17-char VIN"
                                            value={formData.vin}
                                            onChange={e => setFormData({ ...formData, vin: e.target.value })}
                                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>VEHICLE IMAGES (4 ANGLES)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {formData.images.map((url, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>#{idx + 1}</div>
                                                <input
                                                    placeholder={`Image URL for Angle ${idx + 1}`}
                                                    value={url}
                                                    onChange={e => {
                                                        const newImages = [...formData.images];
                                                        newImages[idx] = e.target.value;
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    style={{ width: '100%', padding: '10px 10px 10px 30px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '13px' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>At least 1 image is required. These will be displayed in the vehicle gallery.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: '#0f172a', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                                    {editingCar ? 'Update Vehicle' : 'Publish to Inventory'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
