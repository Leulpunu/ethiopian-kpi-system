// src/pages/Dashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { officesData } from '../data/offices';
import { useAuth } from '../contexts/AuthContext';
import OfficeCard from '../components/Dashboard/OfficeCard';
import KPIOverview from '../components/Dashboard/KPIOverview';
import RecentActivities from '../components/Dashboard/RecentActivities';
import Notification from '../components/Notification/Notification';
import '../styles/Dashboard.css';

const Dashboard = ({ language }) => {
    const { user, logout } = useAuth();
    const [timeFrame, setTimeFrame] = useState('weekly');

    const translations = {
        am: {
            welcome: 'እንኳን ደህና መጡ',
            dashboard: 'ዳሽቦርድ',
            overview: 'አጠቃላይ እይታ',
            offices: 'ቢሮዎች',
            activities: 'ቅርብ እንቅስቃሴዎች',
            reports: 'ሪፖርቶች',
            addReport: 'አዲስ ሪፖርት ያስገቡ',
            logout: 'ውጣ'
        },
        en: {
            welcome: 'Welcome Back',
            dashboard: 'Dashboard',
            overview: 'Overview',
            offices: 'Offices',
            activities: 'Recent Activities',
            reports: 'Reports',
            addReport: 'Add New Report',
            logout: 'Logout'
        }
    };

    const t = translations[language];

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>{t.welcome}, {user.name}</h1>
                    <p>{user.position_am} | {user.office}</p>
                </div>
                <div className="header-actions">
                    <Notification language={language} />
                    <Link to="/report/daily" className="btn-primary">
                        <i className="fas fa-plus"></i> {t.addReport}
                    </Link>
                    <select
                        className="time-select"
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value)}
                    >
                        <option value="daily">{language === 'am' ? 'እለታዊ' : 'Daily'}</option>
                        <option value="weekly">{language === 'am' ? 'ሳምንታዊ' : 'Weekly'}</option>
                        <option value="monthly">{language === 'am' ? 'ወርሃዊ' : 'Monthly'}</option>
                        <option value="yearly">{language === 'am' ? 'አመታዊ' : 'Yearly'}</option>
                    </select>
                    <button onClick={logout} className="btn-secondary">
                        {t.logout}
                    </button>
                </div>
            </div>

            {/* KPI Overview */}
            <div className="section">
                <h2>{t.overview}</h2>
                <KPIOverview timeFrame={timeFrame} language={language} />
            </div>

            {/* Offices Grid */}
            <div className="section">
                <h2>{t.offices}</h2>
                <div className="offices-grid">
                    {officesData
                        .filter(office => user && user.accessibleOffices && user.accessibleOffices.includes(office.id))
                        .map(office => (
                            <OfficeCard
                                key={office.id}
                                office={office}
                                language={language}
                                user={user}
                            />
                        ))}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="section">
                <div className="section-header">
                    <h2>{t.activities}</h2>
                    <Link to="/reports">{language === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'}</Link>
                </div>
                <RecentActivities language={language} />
            </div>
        </div>
    );
};

export default Dashboard;
