"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [bgColor, setBgColor] = useState('white');
  const [showTitle, setShowTitle] = useState(true);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  // Function to generate random colors
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color; 
  };

  useEffect(() => {
    // Fetch coins data
    const fetchCoins = async () => {
      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': apiKey
        }
      };

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        
        if (res.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        // Ensure data is an array
        if (Array.isArray(data)) {
          setCoins(data);
        } else {                                                              
          throw new Error('API did not return an array');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    // const price = setInterval(() => {
      fetchCoins();
    // }, 1000);

    // Change background color every 1 second
    const interval = setInterval(() => {
      setBgColor(getRandomColor());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const remove = () => {
    setShowTitle(false);
  };

  return (

    <div
      style={{ backgroundColor: bgColor }}
      className="grid items-center justify-items-center min-h-screen p-4 gap-16 font-[family-name:var(--font-geist-sans)]"
    >
     <div className='bg-white w-full text-lg h-8 -mt-4'><h1 className=' text-black text-center'> To Get price alerts  <Link href="https://discord.gg/tCgJHRZf" rel="noopener noreferrer" target="_blank">
     CLICK_HERE 
      </Link> </h1></div>


      {showTitle && (
        <h1 onClick={remove} className="glitch mt-12 text-left cursor-pointer">
          Crypto Price Screener
        </h1>
      )}

      <div className="h-full bg-white w-full text-black p-8">
      <div className='text-right mb-6 '> <input type="text" className='border border-black '/> search </div>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && coins.length > 0 && (  
       <ul className="grid grid-cols-5 gap-4 w-full align-middle">
       <li className="font-bold text-xl uppercase ">Symbol</li>
       <li className="font-bold text-xl uppercase ">Name</li>
       <li className="font-bold text-xl uppercase ">Price</li>
       <li className="font-bold text-xl uppercase ">Day Change</li>
       <li className="font-bold text-xl uppercase ">Volume</li>
     
       {coins.map((coin) => (
        
         <>
           <li className=' bg-black text-white w-24 text-center font-semibolld'>{coin.symbol.toUpperCase()}</li>
           <li>{coin.name}</li>
           <li>${coin.current_price}</li>
           <li className={coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
             {coin.price_change_percentage_24h.toFixed(2)}%
           </li>
           <li>${coin.total_volume.toLocaleString()}</li>
         </>
       ))}
     </ul>
        )}
        {!loading && !error && coins.length === 0 && <p>No coins found.</p>}
      </div>
    </div>
  );
}
