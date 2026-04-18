import React, { useState, useEffect } from 'react';
import InputForm from '../components/InputForm';
import DataTable from '../components/DataTable';
import { getHistoricalData } from '../services/api';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const logs = await getHistoricalData();
      setData(logs);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrediction = (result) => {
    setPrediction(result);
  };

  return (
    <div className="grid">
      <div>
        <InputForm onPrediction={handlePrediction} />
        
        {prediction && (
          <div className="glass-card animate-fade" style={{ marginTop: '2rem', borderLeft: '4px solid var(--success)' }}>
            <h3 className="card-title">Predicted Requirements</h3>
            <p className="stats-label" style={{ marginBottom: '1rem' }}>Based on historical trends for {prediction.meal_type}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {Object.entries(prediction.predictions).map(([ing, qty]) => (
                <div key={ing} className="result-badge">
                  {ing}: {qty} kg
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <DataTable data={data} />
    </div>
  );
};

export default Analytics;
