import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';

const CATEGORIES = ['GENERIC', 'ETHICAL', 'GENERAL'];

const CATEGORY_LABELS = {
  GENERIC: '💊 Generic',
  ETHICAL: '💉 Ethical',
  GENERAL: '🛒 General Items'
};

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [activeTab, setActiveTab] = useState('GENERIC');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [qtyPopup, setQtyPopup] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    axios.get(`${API}/medicines`).then(r => setMedicines(r.data));
  }, []);

  const handleAddClick = (medicine) => {
    setQtyPopup(medicine);
    setQty(1);
  };

  const confirmAdd = async () => {
    await axios.post(`${API}/orders/items`, {
      category: activeTab,
      medicineId: qtyPopup.id,
      quantity: qty
    });
    setMessage(`✅ ${qtyPopup.name} (x${qty}) added to ${CATEGORY_LABELS[activeTab]} order!`);
    setQtyPopup(null);
    setTimeout(() => setMessage(''), 2500);
  };

  const filtered = medicines.filter(m =>
    m.category.toUpperCase() === activeTab &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <p className="page-title">Medicine List</p>

      {/* Tabs */}
      <div style={{display:'flex',gap:'8px',marginBottom:'1.5rem'}}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveTab(cat); setSearch(''); }}
            style={{
              padding:'8px 20px',
              borderRadius:'20px',
              border: activeTab === cat ? 'none' : '1.5px solid #ddd',
              background: activeTab === cat ? '#1a73e8' : 'white',
              color: activeTab === cat ? 'white' : '#555',
              fontWeight: activeTab === cat ? 600 : 400,
              cursor:'pointer',
              fontSize:'0.9rem'
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Success message */}
      {message && (
        <div style={{background:'#e8f5e9',padding:'10px 16px',borderRadius:'8px',marginBottom:'1rem',color:'#2e7d32'}}>
          {message}
        </div>
      )}

      {/* Quantity Popup */}
      {qtyPopup && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'white',borderRadius:'12px',padding:'2rem',width:'300px',textAlign:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.2)'}}>
            <h3 style={{marginBottom:'0.5rem'}}>{qtyPopup.name}</h3>
            <p style={{color:'#666',fontSize:'0.9rem',marginBottom:'4px'}}>{qtyPopup.unit}</p>
            <p style={{color:'#1a73e8',fontSize:'0.85rem',marginBottom:'1.5rem'}}>Adding to {CATEGORY_LABELS[activeTab]} order</p>
            <p style={{marginBottom:'1rem',fontWeight:500}}>Enter Quantity:</p>
            <div className="qty-control" style={{justifyContent:'center',marginBottom:'1.5rem'}}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
              <button className="btn btn-primary" onClick={confirmAdd}>Add to Order</button>
              <button className="btn btn-outline" onClick={() => setQtyPopup(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <input
        className="search-bar"
        placeholder={`Search ${CATEGORY_LABELS[activeTab]} medicines...`}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Medicine Cards */}
      {filtered.length === 0 && (
        <div className="empty-state">No medicines found in this category</div>
      )}
      {filtered.map(m => (
        <div className="card" key={m.id}>
          <div className="card-info">
            <h3>{m.name}</h3>
            <p>{m.unit}</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleAddClick(m)}>+ Add</button>
        </div>
      ))}
    </div>
  );
}