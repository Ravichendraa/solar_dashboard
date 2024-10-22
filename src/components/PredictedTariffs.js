import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';

const PredictedTariffs = () => {
    const [tariffs, setTariffs] = useState([]);

    useEffect(() => {
        const fetchTariffs = async () => {
            const response = await fetch('http://localhost:5000/api/tariffs'); // Update with your backend URL
            const data = await response.json();
            setTariffs(data);
        };

        fetchTariffs();
    }, []);

    return (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6">Predicted Tariffs for Tomorrow</Typography>
            {tariffs.length > 0 ? (
                <ul>
                    {tariffs.map(tariff => (
                        <li key={tariff._id}>
                            Hour: {tariff.hour} - Predicted Tariff: ₹{tariff.predicted_tariff.toFixed(2)}
                        </li>
                    ))}
                </ul>
            ) : (
                <Typography>No predictions available.</Typography>
            )}
        </Paper>
    );
};

export default PredictedTariffs;
