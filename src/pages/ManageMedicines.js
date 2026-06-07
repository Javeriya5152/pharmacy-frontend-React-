import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://pharmacy-order-backend.onrender.com/api';

const CATEGORIES = ['GENERIC', 'ETHICAL', 'GENERAL'];
const CATEGORY_LABELS = {
  GENERIC: '💊 Generic',
  ETHICAL: '💉 Ethical',
  GENERAL: '🛒 General Items'
};

const emptyForm = { name: '', category: 'GENERIC', unit: '', available: true };

export default function ManageMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [activeTab, setActiveTab] = useState('GENERIC');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = () => {
    axios.get(`${API}/medicines`).then(r => setMedicines(r.data));
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2500);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.unit.trim()) {
      alert('Please fill in all fields!');
      return;
    }
    if (editId) {
      await axios.put(`${API}/medicines/${editId}`, form);
      showMessage('✅ Medicine updated successfully!');
    } else {
      await axios.post(`${API}/medicines`, form);
      showMessage('✅ Medicine added successfully!');
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
    fetchMedicines();
  };

  const handleEdit = (medicine) => {
    setForm({
      name: medicine.name,
      category: medicine.category,
      unit: medicine.unit,
      available: medicine.available
    });
    setEditId(medicine.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/medicines/${id}`);
    setConfirmDelete(null);
    showMessage('🗑️ Medicine deleted!');
    fetchMedicines();
  };

  const filtered = medicines.filter(m =>
    m.category.toUpperCase() === activeTab &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <p className="page-title" style={{margin:0}}>Manage Medicines</p>
        <button
          className="btn btn-primary"
          onClick={() => { setForm({...emptyForm, category: activeTab}); setEditId(null); setShowForm(true); }}
        >
          + Add Medicine
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div style={{background:'#e8f5e9',padding:'10px 16px',borderRadius:'8px',marginBottom:'1rem',color:'#2e7d32'}}>
          {message}
        </div>
      )}

      {/* Add/Edit Form Popup */}
      {showForm && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'white',borderRadius:'12px',padding:'2rem',width:'360px',boxShadow:'0 4px 20px rgba(0,0,0,0.2)'}}>
            <h3 style={{marginBottom:'1.5rem',color:'#1a73e8'}}>{editId ? 'Edit Medicine' : 'Add New Medicine'}</h3>

            {/* Name */}
            <div style={{marginBottom:'1rem'}}>
              <label style={{fontSize:'0.85rem',fontWeight:500,color:'#555',display:'block',marginBottom:'6px'}}>Medicine Name *</label>
              <input
                style={{width:'100%',padding:'9px 12px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'0.95rem',outline:'none',boxSizing:'border-box'}}
                placeholder="e.g. Paracetamol 500mg"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            {/* Category */}
            <div style={{marginBottom:'1rem'}}>
              <label style={{fontSize:'0.85rem',fontWeight:500,color:'#555',display:'block',marginBottom:'6px'}}>Category *</label>
              <select
                style={{width:'100%',padding:'9px 12px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'0.95rem',outline:'none',background:'white',boxSizing:'border-box'}}
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div style={{marginBottom:'1rem'}}>
              <label style={{fontSize:'0.85rem',fontWeight:500,color:'#555',display:'block',marginBottom:'6px'}}>Unit *</label>
              <input
                style={{width:'100%',padding:'9px 12px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'0.95rem',outline:'none',boxSizing:'border-box'}}
                placeholder="e.g. Strip, Bottle, Box, Pair"
                value={form.unit}
                onChange={e => setForm({...form, unit: e.target.value})}
              />
            </div>

            {/* Available toggle */}
            <div style={{marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'10px'}}>
              <label style={{fontSize:'0.85rem',fontWeight:500,color:'#555'}}>Available:</label>
              <input
                type="checkbox"
                checked={form.available}
                onChange={e => setForm({...form, available: e.target.checked})}
                style={{width:'16px',height:'16px',cursor:'pointer'}}
              />
              <span style={{fontSize:'0.85rem',color: form.available ? '#2e7d32' : '#e53935'}}>
                {form.available ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Buttons */}
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editId ? 'Update' : 'Add Medicine'}
              </button>
              <button className="btn btn-outline" onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {confirmDelete && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'white',borderRadius:'12px',padding:'2rem',width:'320px',textAlign:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.2)'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🗑️</div>
            <h3 style={{marginBottom:'0.5rem'}}>Delete Medicine?</h3>
            <p style={{color:'#666',fontSize:'0.9rem',marginBottom:'1.5rem'}}>This will permanently remove this medicine from the list.</p>
            <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Yes, Delete</button>
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
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

      {/* Search */}
      <input
        className="search-bar"
        placeholder={`Search ${CATEGORY_LABELS[activeTab]} medicines...`}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Count */}
      <div style={{fontSize:'0.85rem',color:'#888',marginBottom:'1rem'}}>
        {filtered.length} medicine(s) in this category
      </div>

      {/* Medicine List */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No medicines found.</p>
          <br />
          <button className="btn btn-primary" onClick={() => { setForm({...emptyForm, category: activeTab}); setEditId(null); setShowForm(true); }}>
            + Add First Medicine
          </button>
        </div>
      )}

      {filtered.map(m => (
        <div className="card" key={m.id}>
          <div className="card-info">
            <h3>{m.name}</h3>
            <p>{m.unit} · {m.available ? '✅ Available' : '❌ Unavailable'}</p>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button className="btn btn-outline" style={{fontSize:'0.85rem',padding:'6px 14px'}} onClick={() => handleEdit(m)}>✏️ Edit</button>
            <button className="btn btn-danger" style={{fontSize:'0.85rem',padding:'6px 14px'}} onClick={() => setConfirmDelete(m.id)}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}