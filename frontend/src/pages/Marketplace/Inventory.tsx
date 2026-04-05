import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { carService } from '../../services/api';
import {
    Search, SlidersHorizontal, ChevronLeft,
    ChevronRight, ShieldCheck, Calendar, Gauge,
    Heart, Eye
} from 'lucide-react';
import InquiryModal from '../../components/common/InquiryModal';

export default function Inventory() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [allCars, setAllCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('brand') || '');
    const [sortBy, setSortBy] = useState('newest');
    const [inquiryCar, setInquiryCar] = useState<any>(null);

    const initialMakes = searchParams.get('brand') ? [searchParams.get('brand')!] : [];
    const budgetParam = searchParams.get('budget');
    let initialPrice = 25000000; // Default to 2.5 Crore
    if (budgetParam) {
        if (budgetParam.includes('50,000')) initialPrice = 50000;
        else if (budgetParam.includes('100,000')) initialPrice = 100000;
        else if (budgetParam.includes('200,000')) initialPrice = 200000;
        else if (budgetParam.includes('Above')) initialPrice = 25000000;
    }

    const [filters, setFilters] = useState({
        makes: initialMakes,
        bodyTypes: [] as string[],
        priceRange: initialPrice
    });
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 6;

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await carService.getAll();
                setAllCars(res.data);
            } catch (err) {
                console.error("Failed to fetch cars", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    // Filter and Sort Logic
    const filteredCars = useMemo(() => {
        let result = [...allCars];

        // Search
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.brand?.toLowerCase().includes(lowSearch) ||
                c.carModel?.toLowerCase().includes(lowSearch)
            );
        }

        // Make Filter
        if (filters.makes.length > 0) {
            result = result.filter(c => filters.makes.includes(c.brand));
        }

        // Body Type Filter
        if (filters.bodyTypes.length > 0) {
            result = result.filter(c => filters.bodyTypes.includes(c.bodyType || 'SUV'));
        }

        // Price Filter
        result = result.filter(c => (c.price || 0) <= filters.priceRange);

        // Status Filter: Hide Sold vehicles
        result = result.filter(c => c.status?.toLowerCase() !== 'sold');

        // Sorting
        switch (sortBy) {
            case 'price-low': result.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
            case 'price-high': result.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
            case 'mileage-low': result.sort((a, b) => (a.mileage || 0) - (b.mileage || 0)); break;
            default: result.sort((a, b) => b._id.localeCompare(a._id)); // Newest
        }

        return result;
    }, [allCars, searchTerm, filters, sortBy]);

    // Pagination
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
    const totalPages = Math.ceil(filteredCars.length / carsPerPage);

    const toggleFilter = (type: 'makes' | 'bodyTypes', value: string) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value]
        }));
        setCurrentPage(1);
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* Search & Header */}
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '40px 0' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px', letterSpacing: '-1px' }}>Premium Inventory</h1>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search our world-class collection..."
                                style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '16px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '40px' }}>
                {/* Filters Sidebar */}
                <aside style={{ width: '280px', flexShrink: 0 }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'sticky', top: '100px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Filters</h3>
                            <SlidersHorizontal size={18} color="#94a3b8" />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Price: Rs.{filters.priceRange.toLocaleString()}</label>
                            <input
                                type="range"
                                min="0"
                                max="25000000"
                                step="50000"
                                value={filters.priceRange}
                                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: Number(e.target.value) }))}
                                style={{ width: '100%', accentColor: '#0070f3' }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MAKE</label>
                            {['Porsche', 'Mercedes', 'BMW', 'Audi', 'Tesla', 'Land Rover'].map(make => (
                                <label key={make} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px', cursor: 'pointer', fontWeight: filters.makes.includes(make) ? 700 : 500 }}>
                                    <input
                                        type="checkbox"
                                        checked={filters.makes.includes(make)}
                                        onChange={() => toggleFilter('makes', make)}
                                        style={{ width: '18px', height: '18px', borderRadius: '4px' }}
                                    /> {make}
                                </label>
                            ))}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BODY TYPE</label>
                            {['SUV', 'Sedan', 'Coupe', 'Convertible', 'Hatchback'].map(type => (
                                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px', cursor: 'pointer', fontWeight: filters.bodyTypes.includes(type) ? 700 : 500 }}>
                                    <input
                                        type="checkbox"
                                        checked={filters.bodyTypes.includes(type)}
                                        onChange={() => toggleFilter('bodyTypes', type)}
                                        style={{ width: '18px', height: '18px', borderRadius: '4px' }}
                                    /> {type}
                                </label>
                            ))}
                        </div>

                        <button
                            className="btn btn-outline"
                            onClick={() => { setFilters({ makes: [], bodyTypes: [], priceRange: 25000000 }); setSearchTerm(''); }}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 700 }}
                        >
                            Reset All
                        </button>
                    </div>
                </aside>

                {/* Inventory Grid */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>Showing <b>{indexOfFirstCar + 1}-{Math.min(indexOfLastCar, filteredCars.length)}</b> of <b>{filteredCars.length}</b> vehicles</span>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <label style={{ fontSize: '14px', color: '#64748b' }}>Sort:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: 'white', fontWeight: 600 }}
                            >
                                <option value="newest">Latest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="mileage-low">Lowest Mileage</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '20px' }}>
                            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <p style={{ color: '#64748b', fontWeight: 600 }}>Curation in progress...</p>
                        </div>
                    ) : filteredCars.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '100px 0', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>No vehicles match your criteria</p>
                            <p style={{ color: '#64748b' }}>Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            {currentCars.map((car) => {
                                const isSold = car.status?.toLowerCase() === 'sold';
                                const isReserved = car.status?.toLowerCase() === 'reserved';
                                const isBooked = car.status?.toLowerCase() === 'booked';

                                return (
                                    <div
                                        key={car._id}
                                        className="card"
                                        style={{
                                            cursor: 'default',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            opacity: isSold ? 0.7 : 1,
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <div
                                            onClick={() => navigate(`/car/${car._id}`)}
                                            style={{ position: 'relative', height: '220px', overflow: 'hidden', cursor: 'pointer' }}
                                        >
                                            <img
                                                src={car.imageUrl || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=600'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                className="hover-zoom"
                                                alt={`${car.brand} ${car.carModel}`}
                                            />
                                            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                                                {isReserved ? (
                                                    <span style={{ background: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>RESERVED</span>
                                                ) : isBooked ? (
                                                    <span style={{ background: '#6366f1', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>BOOKED</span>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <span className="badge badge-verified" style={{ background: '#059669', color: 'white' }}><ShieldCheck size={12} /> CERTIFIED</span>
                                                        <span style={{ background: '#004e82', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>9.5/10</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); /* Wishlist */ }}
                                                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}
                                                >
                                                    <Heart size={18} color="#ef4444" />
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>{car.brand} {car.carModel}</h3>
                                                    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{car.year} • {car.mileage?.toLocaleString()} mi</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#0070f3' }}>Rs.{car.price?.toLocaleString()}</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: '16px 0', padding: '16px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                                                    <Calendar size={14} /> <span style={{ fontWeight: 600 }}>{car.year}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                                                    <Gauge size={14} /> <span style={{ fontWeight: 600 }}>{car.mileage?.toLocaleString()} mi</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gap: '10px', marginTop: 'auto' }}>
                                                <button
                                                    onClick={() => navigate(`/car/${car._id}?report=true`)}
                                                    className="btn btn-outline"
                                                    style={{ width: '100%', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                >
                                                    <Eye size={16} /> View Details
                                                </button>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                                                    <button
                                                        onClick={() => navigate(`/car/${car._id}?buy=true`)}
                                                        disabled={isReserved || car.status?.toLowerCase() === 'booked'}
                                                        className="btn btn-primary"
                                                        style={{
                                                            padding: '10px', borderRadius: '10px', fontWeight: 800, fontSize: '12px',
                                                            background: (isReserved || car.status?.toLowerCase() === 'booked') ? '#e2e8f0' : '#0070f3',
                                                            border: 'none',
                                                            cursor: (isReserved || car.status?.toLowerCase() === 'booked') ? 'not-allowed' : 'pointer',
                                                            color: (isReserved || car.status?.toLowerCase() === 'booked') ? '#94a3b8' : 'white'
                                                        }}
                                                    >
                                                        {isReserved ? 'Reserved' : car.status?.toLowerCase() === 'booked' ? 'Booked' : 'Buy Now'}
                                                    </button>
                                                    <button
                                                        onClick={() => setInquiryCar(car)}
                                                        className="btn btn-outline"
                                                        style={{ padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '12px' }}
                                                    >
                                                        Inquiry
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '60px' }}>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="btn btn-outline"
                                style={{ padding: '10px', borderRadius: '12px', opacity: currentPage === 1 ? 0.5 : 1 }}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            border: '1px solid #e2e8f0',
                                            background: currentPage === i + 1 ? '#0070f3' : 'white',
                                            color: currentPage === i + 1 ? 'white' : '#0f172a',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="btn btn-outline"
                                style={{ padding: '10px', borderRadius: '12px', opacity: currentPage === totalPages ? 0.5 : 1 }}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {inquiryCar && (
                <InquiryModal
                    isOpen={!!inquiryCar}
                    onClose={() => setInquiryCar(null)}
                    car={inquiryCar}
                />
            )}

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .hover-zoom:hover { transform: scale(1.05); }
            `}</style>
        </div>
    );
}

