import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { calculatePercentile } from '../utilities/percentileCalculator';
import { growthDataByAge } from '../utilities/growthData';

export default function TestsAndStatistics({ babyId, onClose }) {
    const [heightData, setHeightData] = useState({});
    const [weightData, setWeightData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [percentileResult, setPercentileResult] = useState({ height: null, weight: null });
    const [babyData, setBabyData] = useState({});
    const token = useSelector((state) => state.token.token);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:7002/baby/${babyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setBabyData(response.data);
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

                setChartOptions({
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057',
                            },
                        },
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                color: '#495057',
                            },
                            grid: {
                                color: '#ebedef',
                            },
                            title: {
                                display: true,
                                text: 'מספר מדידה',
                                font: {
                                    size: 14,
                                },
                                color: '#495057',
                            },
                        },
                        y: {
                            ticks: {
                                color: '#495057',
                            },
                            grid: {
                                color: '#ebedef',
                            },
                            title: {
                                display: true,
                                text: 'גובה (ס״מ)',
                                font: {
                                    size: 14,
                                },
                                color: '#495057',
                            },
                        },
                    },
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [babyId, token]);

    const calculateAgeInMonths = (dob) => {
        const birthDate = new Date(dob);
        const currentDate = new Date();
        const diffInMonths = (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
            (currentDate.getMonth() - birthDate.getMonth());
        return diffInMonths;
    };

    const calculatePercentileForBaby = () => {
        const latestHeight = heightData.datasets?.[0]?.data?.slice(-1)?.[0]?.y || 0;
        const latestWeight = weightData.datasets?.[0]?.data?.slice(-1)?.[0]?.y || 0;

        if (!babyData.dob) {
            console.error("תאריך לידה לא זמין");
            return;
        }

        const babyAgeInMonths = calculateAgeInMonths(babyData.dob);

        const closestGrowthData = growthDataByAge.reduce((prev, curr) =>
            Math.abs(curr.age - babyAgeInMonths) < Math.abs(prev.age - babyAgeInMonths) ? curr : prev
        );

        const heightPercentile = calculatePercentile(latestHeight, closestGrowthData.heightMean, closestGrowthData.heightStdDev);
        const weightPercentile = calculatePercentile(latestWeight, closestGrowthData.weightMean, closestGrowthData.weightStdDev);

        // הגדרת מצב גובה בצורה בטוחה
        let heightStatus;
        if (heightPercentile === "0.00") {
            heightStatus = "לא תקין בדוק אצל רופא";
        } else if (heightPercentile > 75) {
            heightStatus = "מעל האחוזון";
        } else if (heightPercentile < 25) {
            heightStatus = "מתחת לאחוזון";
        } else {
            heightStatus = "בטווח התקין";
        }

        // הגדרת מצב משקל בצורה בטוחה
        let weightStatus;
        if (weightPercentile === "0.00") {
            weightStatus = "לא תקין בדוק אצל רופא";
        } else if (weightPercentile > 75) {
            weightStatus = "מעל האחוזון";
        } else if (weightPercentile < 25) {
            weightStatus = "מתחת לאחוזון";
        } else {
            weightStatus = "בטווח התקין";
        }

        setPercentileResult({
            height: `${heightPercentile}% (${heightStatus})`,
            weight: `${weightPercentile}% (${weightStatus})`
        });
    };

    return (
        <div>
            <h2>סטטיסטיקות גובה ומשקל</h2>
            <div>
                <h3>גרף גובה</h3>
                <Chart type="line" data={heightData} options={chartOptions} />
            </div>
            <div>
                <h3>גרף משקל</h3>
                <Chart type="line" data={weightData} options={chartOptions} />
            </div>
            <button
                onClick={calculatePercentileForBaby}
                className="p-button p-component p-button-success mt-4">
                חישוב אחוזון
            </button>

            {percentileResult.height && (
                <div className="mt-4">
                    <h4 className="text-lg font-bold">תוצאות:</h4>
                    <p>גובה: {percentileResult.height}</p>
                    <p>משקל: {percentileResult.weight}</p>
                </div>
            )}
            <button onClick={onClose} className="p-button p-component p-button-secondary mt-4">סגור</button>
        </div>
    );
}