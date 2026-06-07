import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8080/api';

const CATEGORIES = ['GENERIC', 'ETHICAL', 'GENERAL'];

const CATEGORY_LABELS = {
  GENERIC: '💊 Generic',
  ETHICAL: '💉 Ethical',
  GENERAL: '🛒 General Items'
};

const CATEGORY_COLORS = {
  GENERIC: '#1a73e8',
  ETHICAL: '#7b1fa2',
  GENERAL: '#2e7d32'
};

function OrderCard({ category, onConfirmed }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API}/orders/draft/${category}`);
      setOrder(res.data);
    } catch (e) {
      setOrder(null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrder(); }, []);

  const updateQty = async (itemId, qty) => {
    if (qty < 1) return;
    await axios.put(`${API}/orders/items/${itemId}`, { quantity: qty });
    fetchOrder();
  };

  const removeItem = async (itemId) => {
    await axios.delete(`${API}/orders/items/${itemId}`);
    fetchOrder();
  };

  const confirmOrder = async () => {
    await axios.put(`${API}/orders/${order.id}/confirm`);
    onConfirmed(category);
    fetchOrder();
  };

  const color = CATEGORY_COLORS[category];

  if (loading) return null;

  const hasItems = order && order.items && order.items.length > 0;

  return (
    <div style={{background:'white',borderRadius:'10px',boxShadow:'0 1px 4px rgba(0,0,0,0.1)',marginBottom:'1.5rem',overflow:'hidden'}}>

      {/* Card Header */}
      <div style={{background:color,padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{color:'white',fontWeight:600,fontSize:'1rem'}}>{CATEGORY_LABELS[category]} Order</span>
        {hasItems && (
          <span style={{background:'white',color:color,borderRadius:'12px',padding:'2px 10px',fontSize:'0.8rem',fontWeight:600}}>
            {order.items.length} item(s)
          </span>
        )}
      </div>

      {/* Card Body */}
      <div style={{padding:'1rem'}}>
        {!hasItems ? (
          <div style={{textAlign:'center',padding:'1.5rem',color:'#aaa',fontSize:'0.9rem'}}>
            No items added yet
          </div>
        ) : (
          <>
            {order.items.map(item => (
              <div key={item.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f5f5f5'}}>
                <div>
                  <div style={{fontWeight:500,fontSize:'0.95rem'}}>{item.medicine.name}</div>
                  <div style={{fontSize:'0.8rem',color:'#888'}}>{item.medicine.unit}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div className="qty-control">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="btn btn-danger" style={{fontSize:'0.8rem',padding:'5px 10px'}} onClick={() => removeItem(item.id)}>✕</button>
                </div>
              </div>
            ))}

            {/* Confirm Button */}
            <div style={{textAlign:'right',marginTop:'12px'}}>
              <button
                className="btn btn-success"
                onClick={confirmOrder}
              >
                Confirm {CATEGORY_LABELS[category]} Order ✓
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CurrentOrders() {
  const [confirmed, setConfirmed] = useState([]);
  const navigate = useNavigate();

  const handleConfirmed = (category) => {
    setConfirmed(prev => [...prev, category]);
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  return (
    <div className="container">
      <p className="page-title">Current Orders</p>

      {confirmed.map(cat => (
        <div key={cat} style={{background:'#e8f5e9',padding:'10px 16px',borderRadius:'8px',marginBottom:'1rem',color:'#2e7d32'}}>
          ✅ {CATEGORY_LABELS[cat]} order confirmed! Redirecting to history...
        </div>
      ))}

      {CATEGORIES.map(cat => (
        <OrderCard key={cat} category={cat} onConfirmed={handleConfirmed} />
      ))}
    </div>
  );
}