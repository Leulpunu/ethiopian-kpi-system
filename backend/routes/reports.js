const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

// Get reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().populate('userId');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create report
router.post('/', async (req, res) => {
  const report = new Report(req.body);
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get reports by office
router.get('/office/:officeId', async (req, res) => {
  try {
    const reports = await Report.find({ officeId: req.params.officeId });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
