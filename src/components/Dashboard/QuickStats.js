import React, { useState } from 'react';
import { officesData } from '../../data/offices';

const QuickStats = ({ language, timeFrame, selectedOffice }) => {
    const [hoveredStat, setHoveredStat] = useState(null);

    // Filter offices based on selectedOffice
    const filteredOffices = selectedOffice === 'all'
        ? officesData
        : officesData.filter(office => office.id === selectedOffice);

    // Calculate stats based on timeFrame and selected office
    const totalOffices = filteredOffices.length;
    const totalTasks = filteredOffices.reduce((sum, office) => sum + office.tasks.length, 0);
    const totalKPIs = filteredOffices.reduce((sum, office) =>
        sum + office.tasks.reduce((taskSum, task) => taskSum + task.kpis.length, 0), 0);

    // Calculate previous period data for comparison
    const getPreviousPeriodData = () => {
        // Mock previous period data - in real app, this would come from API
        const previousData = {
            daily: { reports: 45, performance: 85, completion: 92 },
            weekly: { reports: 320, performance: 86, completion: 93 },
            monthly: { reports: 1240, performance: 87, completion: 94 },
            yearly: { reports: 14840, performance: 88, completion: 95 }
        };
        return previousData[timeFrame] || previousData.weekly;
    };

    const prevData = getPreviousPeriodData();

    // Mock data for demonstration - in real app, this would come from API
    const stats = [
        {
            id: 'total-reports',
            title_am: 'አጠቃላይ ሪፖርቶች',
            title_en: 'Total Reports',
            value: '1,247',
            change: '+12%',
            changeType: 'up',
            icon: 'fas fa-file-alt',
            color: '#3498db',
            tooltip_am: `በዚህ ሳምንት ሪፖርቶች ተለጠፈ፣ ከቀድሞ ሳምንት በኩል ከ ${prevData.reports} ተለያየ`,
            tooltip_en: `Reports submitted this ${timeFrame}, compared to ${prevData.reports} last ${timeFrame}`,
            trend: [320, 340, 380, 420, 450, 480, 520]
        },
        {
            id: 'active-offices',
            title_am: 'ንቁ ቢሮዎች',
            title_en: 'Active Offices',
            value: totalOffices.toString(),
            change: '+2',
            changeType: 'up',
            icon: 'fas fa-building',
            color: '#e74c3c',
            tooltip_am: `ከጠቅላላ ${totalOffices} ቢሮዎች ንቁ ናቸው፣ ከቀድሞ ሳምንት በኩል 2 ተጨማሪ`,
            tooltip_en: `${totalOffices} out of ${totalOffices} offices are active, +2 from last ${timeFrame}`,
            trend: [8, 9, 9, 10, 10, 11, 11]
        },
        {
            id: 'avg-performance',
            title_am: 'አማካይ አፈፃፀም',
            title_en: 'Avg Performance',
            value: '87%',
            change: '+5%',
            changeType: 'up',
            icon: 'fas fa-chart-line',
            color: '#27ae60',
            tooltip_am: `አማካይ አፈፃፀም በዚህ ሳምንት 87% ነበር፣ ከቀድሞ ሳምንት በኩል ከ ${prevData.performance}% ተለያየ`,
            tooltip_en: `Average performance this ${timeFrame} is 87%, up from ${prevData.performance}% last ${timeFrame}`,
            trend: [82, 83, 84, 85, 86, 86, 87]
        },
        {
            id: 'completion-rate',
            title_am: 'የመጠናቀቅ መጠን',
            title_en: 'Completion Rate',
            value: '94%',
            change: '-2%',
            changeType: 'down',
            icon: 'fas fa-check-circle',
            color: '#9b59b6',
            tooltip_am: `የመጠናቀቅ መጠን በዚህ ሳምንት 94% ነበር፣ ከቀድሞ ሳምንት በኩል ከ ${prevData.completion}% ተለያየ`,
            tooltip_en: `Completion rate this ${timeFrame} is 94%, down from ${prevData.completion}% last ${timeFrame}`,
            trend: [95, 94, 94, 93, 93, 93, 94]
        }
    ];

    const exportToCSV = () => {
        const csvData = stats.map(stat => ({
            Metric: language === 'am' ? stat.title_am : stat.title_en,
            Value: stat.value,
            Change: stat.change,
            'Time Frame': timeFrame
        }));

        const csvContent = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `dashboard-stats-${timeFrame}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const translations = {
        am: {
            quickStats: 'ፈጣን ስታትስትዮች',
            export: 'ወደ CSV ላክ'
        },
        en: {
            quickStats: 'Quick Stats',
            export: 'Export to CSV'
        }
    };

    const t = translations[language];

    return (
        <div className="quick-stats">
            <div className="stats-header">
                <h3>{t.quickStats}</h3>
                <button onClick={exportToCSV} className="btn-secondary export-btn">
                    <i className="fas fa-download"></i> {t.export}
                </button>
            </div>
            <div className="stats-grid">
                {stats.map(stat => (
                    <div
                        key={stat.id}
                        className="stat-card"
                        onMouseEnter={() => setHoveredStat(stat.id)}
                        onMouseLeave={() => setHoveredStat(null)}
                    >
                        <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                            <i className={stat.icon}></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-title">
                                {language === 'am' ? stat.title_am : stat.title_en}
                            </div>
                            <div className={`stat-change ${stat.changeType}`}>
                                <i className={`fas fa-arrow-${stat.changeType === 'up' ? 'up' : 'down'}`}></i>
                                {stat.change}
                            </div>
                        </div>
                        {hoveredStat === stat.id && (
                            <div className="stat-tooltip">
                                {language === 'am' ? stat.tooltip_am : stat.tooltip_en}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickStats;
