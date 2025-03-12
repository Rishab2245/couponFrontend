import { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [coupon, setCoupon] = useState(null);
  
  const claimCoupon = async () => {
    try {
      const response = await axios.get('https://couponbackend-n276.onrender.com/claim');
      if(response.data.success){
        setCoupon(response.data.coupon);
        setMessage('Coupon claimed successfully!');
      } else {
        setMessage(response.data.message);
      }
    } catch(err){
      setMessage('Error claiming coupon. Please try again later.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl mb-4">Claim Your Coupon</h1>
        {coupon && (
          <div className="text-xl text-green-600 font-bold mb-4">
            {coupon}
          </div>
        )}
        <button onClick={claimCoupon} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Claim Coupon
        </button>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}

export default App;
