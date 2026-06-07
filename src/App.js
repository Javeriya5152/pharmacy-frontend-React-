import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MedicineList from './pages/MedicineList';
import CurrentOrders from './pages/CurrentOrders';
import OrderHistory from './pages/OrderHistory';
import ManageMedicines from './pages/ManageMedicines';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h1>💊 Pharmacy Order Manager</h1>
        <div>
          <Link to="/">Medicines</Link>
          <Link to="/orders">Current Orders</Link>
          <Link to="/history">Order History</Link>
          <Link to="/manage">Manage</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<MedicineList />} />
        <Route path="/orders" element={<CurrentOrders />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/manage" element={<ManageMedicines />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
