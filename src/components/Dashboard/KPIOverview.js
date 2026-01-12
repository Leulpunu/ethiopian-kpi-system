import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const KPIOverview = ({ timeFrame, language }) => {
    const [chartType, setChartType] = useState('bar');
    const [kpiData, setKpiData] = useState([]);

    // Mock KPI data - in real app, this would come from API
    useEffect(() => {
        const mockData = [
            { name: 'Productivity', value: 85, target: 100, trend: [75, 78, 82, 85] },
            { name: 'Quality', value: 92, target: 95, trend: [88, 90, 91, 92] },
            { name: 'Efficiency', value: 78, target: 85, trend: [70, 72, 75, 78] },
            { name: 'Customer Satisfaction', value: 88, target: 90, trend: [85, 86, 87, 88] },
        ];
        setKpiData(mockData);
    }, [timeFrame]);

    const translations = {
        am: {
            title: 'ኪፒአይ አጠቃላይ እይታ',
            productivity: 'የሥራ ምርት',
            quality: 'ጥሩነት',
            efficiency: 'ውጤታማነት',
            satisfaction: 'የደንበኞ እርካታ',
            barChart: 'ባር ቻርት',
            lineChart: 'ላይን ቻርት',
            pieChart: 'ፓይ ቻርት'
        },
        en: {
            title: 'KPI Overview',
            productivity: 'Productivity',
            quality: 'Quality',
            efficiency: 'Efficiency',
            satisfaction: 'Customer Satisfaction',
            barChart: 'Bar Chart',
            lineChart: 'Line Chart',
            pieChart: 'Pie Chart'
        }
    };

    const t = translations[language];

    const chartData = {
        labels: kpiData.map(kpi => t[kpi.name.toLowerCase().replace(' ', '')] || kpi.name),
        datasets: [
            {
                label: language === 'am' ? 'እሴት' : 'Value',
                data: kpiData.map(kpi => kpi.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: t.title,
            },
        },
    };

    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return <Line data={chartData} options={chartOptions} />;
            case 'pie':
                return <Pie data={chartData} options={chartOptions} />;
            default:
                return <Bar data={chartData} options={chartOptions} />;
        }
    };

    return (
        <div className="kpi-overview">
            <div className="chart-controls">
                <div className="chart-type-selector">
                    <button
                        className={chartType === 'bar' ? 'active' : ''}
                        onClick={() => setChartType('bar')}
                    >
                        {t.barChart}
                    </button>
                    <button
                        className={chartType === 'line' ? 'active' : ''}
                        onClick={() => setChartType('line')}
                    >
                        {t.lineChart}
                    </button>
                    <button
                        className={chartType === 'pie' ? 'active' : ''}
                        onClick={() => setChartType('pie')}
                    >
                        {t.pieChart}
                    </button>
                </div>
            </div>
            <div className="chart-container">
                {renderChart()}
            </div>
            <div className="kpi-summary">
                {kpiData.map((kpi, index) => (
                    <div key={index} className="kpi-item">
                        <h4>{t[kpi.name.toLowerCase().replace(' ', '')] || kpi.name}</h4>
                        <div className="kpi-metrics">
                            <span className="value">{kpi.value}%</span>
                            <span className="target">/ {kpi.target}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(kpi.value / kpi.target) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KPIOverview;
