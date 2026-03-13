import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { carService } from '../../services/api';
import {
  Truck, Zap,
  ShieldCheck, Wallet, Truck as Delivery,
  Clock, Eye
} from 'lucide-react';
import InquiryModal from '../../components/common/InquiryModal';

export default function Marketplace() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [inquiryCar, setInquiryCar] = useState<any>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await carService.getAll();
        setCars(res.data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      }
    };
    fetchCars();
  }, []);

  const auctionCars = cars.length > 0 ? cars.slice(0, 4) : [
    { _id: '1', title: '2021 BMW M3 Competition', price: 'Rs.68,500', location: 'Los Angeles, CA', image: 'https://images.unsplash.com/photo-1555215695-3004980ad94e?q=80&w=1200&auto=format&fit=crop', brand: 'BMW', carModel: 'M3' },
    { _id: '2', title: '2022 Ferrari SF90 Stradale', price: 'Rs.425,000', location: 'Miami, FL', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop', brand: 'Ferrari', carModel: 'SF90' },
    { _id: '3', title: '2021 Lamborghini Huracán', price: 'Rs.249,900', location: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1544636331-e268592033c2?q=80&w=1200&auto=format&fit=crop', brand: 'Lamborghini', carModel: 'Huracán' },
    { _id: '4', title: '2019 Mercedes-AMG C63 S', price: 'Rs.54,200', location: 'Chicago, IL', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop', brand: 'Mercedes', carModel: 'C63' }
  ];

  const [searchState, setSearchState] = useState({
    brand: 'Select Brand',
    model: 'Select Model',
    budget: 'Any Price'
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchState.brand !== 'Select Brand') params.append('brand', searchState.brand);
    if (searchState.model !== 'Select Model') params.append('model', searchState.model);
    if (searchState.budget !== 'Any Price') params.append('budget', searchState.budget);
    navigate(`/inventory?${params.toString()}`);
  };

  return (
    <div className="landing-page" style={{ background: '#f8fafc', color: '#0f172a', paddingTop: '40px' }}>
      <div className="container">
        {/* 2. Hero Section */}
        <section className="section-padding" style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '100px' }}>
          <h1 className="hero-title animate" style={{ marginBottom: '16px', fontSize: '56px', lineHeight: 1.1 }}>
            Your Destination for<br />
            <span style={{ color: '#004e82' }}>Premium Certified Cars</span>
          </h1>
          <p className="hero-subtitle animate" style={{ marginBottom: '48px', opacity: 0.8, fontSize: '18px', maxWidth: '700px', margin: '0 auto 48px' }}>
            Experience the finest selection of hand-picked, verified vehicles.
            Transparent pricing, heritage of trust, and seamless doorstep delivery.
          </p>

          <div className="search-box animate" style={{
            display: 'flex', gap: '20px', background: 'white', padding: '24px',
            borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            maxWidth: '1000px', margin: '0 auto'
          }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>BRAND</label>
              <select
                value={searchState.brand}
                onChange={(e) => setSearchState({ ...searchState, brand: e.target.value })}
                style={{ width: '100%', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', outline: 'none', background: 'white' }}
              >
                <option>Select Brand</option>
                <option>Porsche</option>
                <option>BMW</option>
                <option>Mercedes-Benz</option>
                <option>Audi</option>
                <option>Tesla</option>
                <option>Range Rover</option>
              </select>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>MODEL</label>
              <select
                value={searchState.model}
                onChange={(e) => setSearchState({ ...searchState, model: e.target.value })}
                style={{ width: '100%', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', outline: 'none', background: 'white' }}
              >
                <option>Select Model</option>
                <option>911 Carrera S</option>
                <option>M3 Competition</option>
                <option>C63 AMG S</option>
                <option>Model S Plaid</option>
                <option>RS 7 Sportback</option>
              </select>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>BUDGET</label>
              <select
                value={searchState.budget}
                onChange={(e) => setSearchState({ ...searchState, budget: e.target.value })}
                style={{ width: '100%', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', outline: 'none', background: 'white' }}
              >
                <option>Any Price</option>
                <option>Rs. 25,000 - Rs. 50,000</option>
                <option>Rs. 50,000 - Rs. 100,000</option>
                <option>Rs. 100,000 - Rs. 200,000</option>
                <option>Above Rs. 200,000</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ height: '48px', marginTop: '24px', padding: '0 32px', background: '#004e82', border: 'none' }} onClick={handleSearch}>
              Browse Inventory
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '60px', fontSize: '13px', fontWeight: 700, color: '#004e82' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> Certified Quality</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> Fast Reservation</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={18} /> National Delivery</span>
          </div>
        </section>

        {/* 3. Featured Inventory */}
        <section className="section-padding">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Featured Selection</h2>
              <p style={{ color: '#64748b', fontSize: '15px' }}>Our most exclusive and popular vehicles this week</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/inventory')}>View All Inventory</button>
          </div>

          <div className="auction-grid">
            {auctionCars
              .filter(c => c.status?.toLowerCase() !== 'sold')
              .map((car, i) => (
                <div key={car._id || i} className="card" style={{ cursor: 'default' }}>
                  <div style={{ position: 'relative', height: '220px', cursor: 'pointer' }} onClick={() => navigate(`/car/${car._id}`)}>
                    <img src={car.image || car.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                      <span style={{ background: '#10b981', color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px' }}>FEATURED</span>
                      {car.status && car.status.toLowerCase() !== 'available' && (
                        <span style={{ background: car.status.toLowerCase() === 'sold' ? '#ef4444' : '#f59e0b', color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px' }}>{car.status.toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>{car.title || `${car.brand} ${car.carModel}`}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{car.mileage ? `${car.mileage.toLocaleString()} miles` : '24k miles'} • {car.location || car.city || 'Los Angeles, CA'}</p>
                      <div style={{ fontWeight: 800, fontSize: '22px', color: '#004e82' }}>{car.price ? (typeof car.price === 'number' ? `Rs.${car.price.toLocaleString()}` : car.price) : 'Rs.45,000'}</div>
                    </div>

                    <div style={{ display: 'grid', gap: '10px' }}>
                      <button
                        onClick={() => navigate(`/car/${car._id}`)}
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '12px', fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Eye size={16} /> View Details
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                        <button
                          onClick={() => navigate(`/car/${car._id}?buy=true`)}
                          disabled={car.status && car.status.toLowerCase() !== 'available'}
                          className="btn btn-primary"
                          style={{ padding: '12px', fontSize: '12px', fontWeight: 800, background: '#004e82', border: 'none' }}
                        >
                          {car.status && car.status.toLowerCase() !== 'available' ? (car.status.toLowerCase() === 'reserved' ? 'Reserved' : 'Booked') : 'Buy Now'}
                        </button>
                        <button
                          onClick={() => setInquiryCar(car)}
                          className="btn btn-outline"
                          style={{ padding: '12px', fontSize: '12px', fontWeight: 700 }}
                        >
                          Inquiry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* 4. Why Choose Us */}
        <section style={{ padding: '80px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', background: 'white', borderRadius: '40px', margin: '40px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Why Choose Sai Automobiles?</h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>We pride ourselves on providing the most transparent and professional car buying experience in the industry.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', padding: '0 40px' }}>
            {[
              { icon: ShieldCheck, title: 'Certified Quality', text: 'Every vehicle in our showroom is hand-picked and verified for excellence.' },
              { icon: Wallet, title: 'No Hidden Fees', text: 'The price you see is the price you pay. Total transparency at every step.' },
              { icon: Zap, title: 'Online Reservation', text: 'Secure your favorite car online instantly with a small refundable deposit.' },
              { icon: Delivery, title: 'Premium Logistics', text: 'White-glove delivery service right to your driveway, nationwide.' }
            ].map((feat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ color: '#004e82', marginBottom: '24px', background: '#f0f7ff', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <feat.icon size={28} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>{feat.title}</h4>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{feat.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Latest Arrivals */}
        <section className="section-padding">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Latest Arrivals</h2>
              <p style={{ color: '#64748b', fontSize: '15px' }}>Freshly verified and ready for their new home</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/inventory')}>View Full Collection</button>
          </div>

          <div className="arrivals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {cars.slice(0, 4).map((car, i) => (
              <div key={car._id || i} className="card">
                <div style={{ position: 'relative', height: '180px', cursor: 'pointer' }} onClick={() => navigate(`/car/${car._id}`)}>
                  <img src={car.imageUrl || [
                    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop'
                  ][i % 4]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className="badge badge-verified"><ShieldCheck size={12} /> VERIFIED</span>
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{car.brand} {car.carModel}</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>{car.year} • {car.mileage?.toLocaleString()} miles</p>
                  <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '16px', color: '#004e82' }}>Rs.{car.price?.toLocaleString()}</div>

                  <div style={{ display: 'grid', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/car/${car._id}`)}
                      className="btn btn-outline"
                      style={{ padding: '8px', fontSize: '11px', fontWeight: 700, width: '100%' }}
                    >
                      View Details
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        onClick={() => navigate(`/car/${car._id}?buy=true`)}
                        className="btn btn-primary"
                        style={{ padding: '8px', fontSize: '11px', fontWeight: 800, background: '#004e82', border: 'none' }}
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => setInquiryCar(car)}
                        className="btn btn-outline"
                        style={{ padding: '8px', fontSize: '11px', fontWeight: 700 }}
                      >
                        Inquiry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {inquiryCar && (
        <InquiryModal
          isOpen={!!inquiryCar}
          onClose={() => setInquiryCar(null)}
          car={inquiryCar}
        />
      )}
    </div>
  );
}
