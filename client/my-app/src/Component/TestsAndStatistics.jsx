import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function StatisticsPage() {
    const { id } = useParams(); // ID של התינוק מהנתיב
    const [heightData, setHeightData] = useState({});
    const [weightData, setWeightData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:7002/baby/${id}`);
                const measurements = response.data.messure;

                const heights = measurements.map((measure, index) => ({
                    x: index,
                    y: measure.height
                }));

                const weights = measurements.map((measure, index) => ({
                    x: index,
                    y: measure.weight
                }));

                const documentStyle = getComputedStyle(document.documentElement);
                const textColor = documentStyle.getPropertyValue('--text-color');
                const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

                // נתוני הגרף של הגובה
                setHeightData({
                    datasets: [
                        {
                            label: 'גובה (ס״מ)',
                            borderColor: documentStyle.getPropertyValue('--blue-500'),
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            data: heights
                        }
                    ]
                });

                // נתוני הגרף של המשקל
                setWeightData({
                    datasets: [
                        {
                            label: 'משקל (ק״ג)',
                            borderColor: documentStyle.getPropertyValue('--green-500'),
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            data: weights
                        }
                    ]
                });

                // אפשרויות משותפות לשני הגרפים
                setChartOptions({
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: textColorSecondary
                            },
                            grid: {
                                color: surfaceBorder
                            }
                        },
                        y: {
                            ticks: {
                                color: textColorSecondary
                            },
                            grid: {
                                color: surfaceBorder
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-4 text-center">סטטיסטיקות גובה ומשקל</h2>
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">גרף גובה</h3>
                <Chart type="line" data={heightData} options={chartOptions} />
            </div>
            <div>
                <h3 className="text-lg font-bold mb-2">גרף משקל</h3>
                <Chart type="line" data={weightData} options={chartOptions} />
            </div>
        </div>
    );
}