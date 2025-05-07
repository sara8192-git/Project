import React, { useState, useEffect } from "react";
import { Chart } from 'primereact/chart';

export default function Home() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        // הגדרת הנתונים לגרף
        const data = {
            labels: ['אחוזי לקוחות מרוצים', 'אחוזי חיסונים', 'שימור תינוקות עם מעקב'],
            datasets: [
                {
                    label: 'סטטיסטיקות טיפת חלב',
                    data: [85, 90, 75], // נתונים לדוגמה (אחוזים)
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };

        // הגדרת אפשרויות הגרף
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="card">
            <Chart type="bar" data={chartData} options={chartOptions} />
        
            <div className="home-container">
                {/* כותרת עליונה */}
                <header className="header">
                    <h1>ברוכים הבאים למערכת טיפת חלב</h1>
                    <p>דואגים לבריאות התינוקות וההורים בכל שלב</p>
                    <a href="/login" className="login-button">כניסה למערכת</a>
                </header>
          
                {/* סלוגנים */}
                <section className="slogans">
                    <h2>למה לבחור בנו?</h2>
                    <ul>
                        <li>💚 שירות מקצועי ואישי לכל משפחה</li>
                        <li>🍼 מעל 1,000 תחנות בפריסה ארצית</li>
                        <li>👶 95% מהתינוקות בישראל מקבלים שירות בטיפת חלב</li>
                        <li>📈 מעקב התפתחותי, חיסונים וייעוץ מקצועי</li>
                    </ul>
                </section>
          
                {/* תגובות לקוחות */}
                <section className="testimonials">
                    <h2>מה הלקוחות שלנו אומרים</h2>
                    <div className="testimonial">
                    <p>"הרגשתי בטוחה ומודרכת בכל שלב."</p>

                        <span>- אמא מרוצה</span>
                    </div>
                    <div className="testimonial">
                    <p>"הצוות היה מדהים ותומך לאורך כל הדרך!"</p>

                        <span>- אבא מרוצה</span>
                    </div>
                </section>
          
                {/* נתונים מעניינים */}
                <section className="statistics">
                    <h2>נתונים מעניינים על טיפת חלב</h2>
                    <ul>
                        <li>🩺 כ-1,000 תחנות טיפת חלב פועלות בישראל</li>
                        <li>👩‍⚕️ 95% מהתינוקות בישראל מקבלים שירות בטיפת חלב</li>
                        <li>📊 87.5% מהתינוקות ינקו לפחות פעם אחת</li>
                        <li>🍼 80% מהתינוקות צורכים תחליפי חלב-אם במחלקת יולדות</li>
                    </ul>
                </section>
          
                {/* תמונות ואיקונים */}
                <section className="images">
                    <div className="image-grid">
                        <img src="/images/b.png" alt="אחות טיפת חלב" />

                    </div>
                </section>
          
                {/* תחתית הדף */}
                <footer className="footer">
                    <p>© 2025 מערכת טיפת חלב. כל הזכויות שמורות.</p>
                </footer>
            </div>
        </div>
    )
}
