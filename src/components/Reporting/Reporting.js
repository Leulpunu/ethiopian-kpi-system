import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { officesData } from '../../data/offices';
import { useAuth } from '../../contexts/AuthContext';
import './Reporting.css';

const Reporting = ({ language }) => {
  const [reports, setReports] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState({ show: false, reportId: null, feedback: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load reports from localStorage
    const storedReports = JSON.parse(localStorage.getItem('kpiReports') || '[]');

    // Filter reports based on user access
    const filteredReports = storedReports.filter(report => {
      if (user && user.role === 'admin') {
        return true; // Admin sees all reports
      }
      return user && user.accessibleOffices && user.accessibleOffices.includes(report.officeId);
    });

    setReports(filteredReports);
  }, [user]);

  const translations = {
    am: {
      reports: 'ሪፖርቶች',
      noReports: 'ሪፖርት አልተለመደም።',
      exportExcel: 'ኤክሰል ወደ መላክ',
      exportPDF: 'ፒዲኤፍ ወደ መላክ',
      backToDashboard: 'ወደ ዳሽቦርድ ተመለስ',
      date: 'ቀን',
      office: 'ቢሮ',
      task: 'ተግባር',
      kpi: 'ኪፒአይ',
      value: 'እሴት',
      feedback: 'አስተያየት',
      provideFeedback: 'አስተያየት ስጥ',
      submitFeedback: 'አስተያየት አስገባ',
      cancel: 'ሰርዝ',
      feedbackPlaceholder: 'አስተያየት ያስገቡ...'
    },
    en: {
      reports: 'Reports',
      noReports: 'No reports found.',
      exportExcel: 'Export to Excel',
      exportPDF: 'Export to PDF',
      backToDashboard: 'Back to Dashboard',
      date: 'Date',
      office: 'Office',
      task: 'Task',
      kpi: 'KPI',
      value: 'Value',
      feedback: 'Feedback',
      provideFeedback: 'Provide Feedback',
      submitFeedback: 'Submit Feedback',
      cancel: 'Cancel',
      feedbackPlaceholder: 'Enter feedback...'
    }
  };

  const t = translations[language];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'kpi-reports.xlsx');
  };

  const exportToPDF = () => {
    const element = document.getElementById('reports-table');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('kpi-reports.pdf');
    });
  };

  const openFeedbackModal = (reportId) => {
    setFeedbackModal({ show: true, reportId, feedback: '' });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ show: false, reportId: null, feedback: '' });
  };

  const submitFeedback = () => {
    if (!feedbackModal.feedback.trim()) return;

    const storedReports = JSON.parse(localStorage.getItem('kpiReports') || '[]');
    const updatedReports = storedReports.map(report => {
      if (report.id === feedbackModal.reportId) {
        return {
          ...report,
          feedback: feedbackModal.feedback,
          feedbackBy: user.name,
          feedbackDate: new Date().toISOString()
        };
      }
      return report;
    });

    localStorage.setItem('kpiReports', JSON.stringify(updatedReports));

    // Update local state
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === feedbackModal.reportId
          ? { ...report, feedback: feedbackModal.feedback, feedbackBy: user.name }
          : report
      )
    );

    closeFeedbackModal();
  };

  return (
    <div className="reporting">
      <div className="reporting-header">
        <button onClick={() => navigate('/')} className="btn-secondary back-button">
          <i className="fas fa-arrow-left"></i> {t.backToDashboard}
        </button>
        <h2>{t.reports}</h2>
      </div>

      <div className="export-buttons">
        <button onClick={exportToExcel} className="btn-primary">
          {t.exportExcel}
        </button>
        <button onClick={exportToPDF} className="btn-secondary">
          {t.exportPDF}
        </button>
      </div>

      {reports.length === 0 ? (
        <p>{t.noReports}</p>
      ) : (
        <div id="reports-table" className="reports-table">
          <table>
            <thead>
              <tr>
                <th>{t.date}</th>
                <th>{t.office}</th>
                <th>{t.task}</th>
                <th>{t.kpi}</th>
                <th>{t.value}</th>
                {user && user.role === 'admin' && <th>{t.feedback}</th>}
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{new Date(report.date).toLocaleDateString()}</td>
                  <td>{report.officeName}</td>
                  <td>{report.taskName}</td>
                  <td>{report.kpiName}</td>
                  <td>{report.value}</td>
                  {user && user.role === 'admin' && (
                    <td>
                      {report.feedback ? (
                        <div className="feedback-display">
                          <span>{report.feedback}</span>
                          <small>({report.feedbackBy})</small>
                        </div>
                      ) : (
                        <button
                          onClick={() => openFeedbackModal(report.id)}
                          className="btn-secondary btn-small"
                        >
                          {t.provideFeedback}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t.provideFeedback}</h3>
            <textarea
              value={feedbackModal.feedback}
              onChange={(e) => setFeedbackModal(prev => ({ ...prev, feedback: e.target.value }))}
              placeholder={t.feedbackPlaceholder}
              rows="4"
              className="feedback-textarea"
            />
            <div className="modal-actions">
              <button onClick={closeFeedbackModal} className="btn-secondary">
                {t.cancel}
              </button>
              <button onClick={submitFeedback} className="btn-primary">
                {t.submitFeedback}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reporting;
