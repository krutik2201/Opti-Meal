import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { getHistoricalData, getStats } from '../services/api';

const Home = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHistoricalData();
        const s = await getStats();
        setHistoricalData(data);
        setStats(s);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Dashboard historicalData={historicalData} stats={stats} />
    </div>
  );
};

export default Home;
