import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import envs from './utils/envs';

const CouponDistributionApp = () => {
  // State for user interaction
  const [userCoupon, setUserCoupon] = useState(null);
  const [message, setMessage] = useState('Welcome! Claim your coupon below.');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Backend API URL

//   const API_URL = envs.API_URL;
  const API_URL = "https://couponbackend-n276.onrender.com/";
//   console.log("API_URL" , envs.API_URL);
  
  // Set favicon
  useEffect(() => {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="80" font-size="80">🎟️</text></svg>';
    document.head.appendChild(favicon);
    
    // Check for user's preferred color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    return () => {
      document.head.removeChild(favicon);
    };
  }, []);
  
  // Function to claim a coupon
  const claimCoupon = async () => {
    if (isClaiming) return;
    
    try {
      setIsClaiming(true);
      setIsLoading(true);
      
      const response = await axios.get(API_URL+"claim");
      
      if (response.data.success) {
        setUserCoupon(response.data.coupon);
        setMessage('Coupon claimed successfully!');
        startCountdown(60*60); // Assuming 60 seconds cooldown based on your server code
      } else {
        setMessage(response.data.message);
        
        // Extract time remaining from error message if available
        const timeMatch = response.data.message.match(/(\d+) seconds/);
        if (timeMatch && timeMatch[1]) {
          startCountdown(parseInt(timeMatch[1]));
        }
      }
    } catch (error) {
      setMessage('Error claiming coupon. Please try again later.');
      console.error('Error claiming coupon:', error);
    } finally {
      setIsLoading(false);
      setIsClaiming(false);
    }
  };
  
  // Function to start countdown timer
  const startCountdown = (seconds) => {
    setTimeRemaining(seconds);
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return null;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Format time remaining in a readable format
  const formatTimeRemaining = () => {
    if (!timeRemaining) return '';
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };
  
  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <div className={`flex flex-col h-screen w-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-800'}`}>
      {/* Header with theme toggle */}
      <header className={`w-full p-4 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎟️</span>
          <h1 className="text-xl font-bold">Coupon Distribution</h1>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      {/* Main content - centered coupon claiming interface */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className={`w-full max-w-md rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-8 transition-colors`}>
          <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Claim Your Coupon
          </h2>
          
          <div className="text-center">
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{message}</p>
            
            {userCoupon && (
              <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'} border rounded-lg p-6 mb-6`}>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Coupon Code:</p>
                <p className={`text-2xl font-mono font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{userCoupon}</p>
              </div>
            )}
            
            {timeRemaining && (
              <div className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Please wait {formatTimeRemaining()} before claiming another coupon
              </div>
            )}
            
            <button 
              onClick={claimCoupon}
              disabled={isLoading || timeRemaining !== null}
              className={`font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLoading || timeRemaining !== null 
                  ? `${darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'} cursor-not-allowed` 
                  : `${darkMode ? 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500' : 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500'} text-white shadow-lg`
              }`}
            >
              {isLoading ? 'Processing...' : 'Claim Your Coupon'}
            </button>
          </div>
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className={`w-full p-3 text-center ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400 shadow-inner'}`}>
        <p className="text-xs">Round-Robin Coupon Distribution with Abuse Prevention</p>
      </footer>
    </div>
  );
};

export default CouponDistributionApp;

// import { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [message, setMessage] = useState('');
//   const [coupon, setCoupon] = useState(null);
  
//   const claimCoupon = async () => {
//     try {
//       const response = await axios.get('https://couponbackend-n276.onrender.com/claim');
//       if(response.data.success){
//         setCoupon(response.data.coupon);
//         setMessage('Coupon claimed successfully!');
//       } else {
//         setMessage(response.data.message);
//       }
//     } catch(err){
//       setMessage('Error claiming coupon. Please try again later.');
//     }
//   };
  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md text-center">
//         <h1 className="text-2xl mb-4">Claim Your Coupon</h1>
//         {coupon && (
//           <div className="text-xl text-green-600 font-bold mb-4">
//             {coupon}
//           </div>
//         )}
//         <button onClick={claimCoupon} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           Claim Coupon
//         </button>
//         {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default App;
