import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ language }) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        // Check for overdue reports and create notifications
        const checkOverdueReports = () => {
            const reports = JSON.parse(localStorage.getItem('kpiReports') || '[]');
            const today = new Date();
            const overdueNotifications = [];

            // Check if any office hasn't submitted a report in the last 2 days
            const offices = JSON.parse(localStorage.getItem('offices') || '[]');
            offices.forEach(office => {
                const officeReports = reports.filter(r => r.officeId === office.id);
                if (officeReports.length > 0) {
                    const lastReport = officeReports.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                    const daysSinceLastReport = Math.floor((today - new Date(lastReport.date)) / (1000 * 60 * 60 * 24));

                    if (daysSinceLastReport > 2) {
                        overdueNotifications.push({
                            id: `overdue-${office.id}`,
                            type: 'overdue',
                            title: language === 'am' ? 'ያልተላከ ሪፖርት' : 'Overdue Report',
                            message: language === 'am'
                                ? `${office.name_am} በ ${daysSinceLastReport} ቀናት ሪፖርት አልላከም`
                                : `${office.name_en} has not submitted a report in ${daysSinceLastReport} days`,
                            timestamp: new Date().toISOString(),
                            urgent: daysSinceLastReport > 5
                        });
                    }
                }
            });

            setNotifications(overdueNotifications);
        };

        checkOverdueReports();
        // Check every hour
        const interval = setInterval(checkOverdueReports, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, [language]);

    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    const showBrowserNotification = (notification) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico'
            });
        }
    };

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const translations = {
        am: {
            notifications: 'ማሳወቂያዎች',
            noNotifications: 'ምንም ማሳወቂያ የለም',
            enableNotifications: 'ብራውዘር ማሳወቂያዎችን አንቃ'
        },
        en: {
            notifications: 'Notifications',
            noNotifications: 'No notifications',
            enableNotifications: 'Enable Browser Notifications'
        }
    };

    const t = translations[language];

    return (
        <div className="notification-container">
            <button
                className="notification-toggle"
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <i className="fas fa-bell"></i>
                {notifications.length > 0 && (
                    <span className="notification-badge">{notifications.length}</span>
                )}
            </button>

            {showNotifications && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>{t.notifications}</h4>
                        <button
                            className="enable-notifications-btn"
                            onClick={requestNotificationPermission}
                        >
                            {t.enableNotifications}
                        </button>
                    </div>

                    <div className="notification-list">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.urgent ? 'urgent' : ''}`}
                                >
                                    <div className="notification-content">
                                        <h5>{notification.title}</h5>
                                        <p>{notification.message}</p>
                                        <small>{new Date(notification.timestamp).toLocaleDateString()}</small>
                                    </div>
                                    <button
                                        className="dismiss-btn"
                                        onClick={() => dismissNotification(notification.id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="no-notifications">{t.noNotifications}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;
