// routes/income.js
const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// Add income
router.post('/add', async (req, res) => {
  const { userId, amount, source } = req.body;
  try {
    const income = new Income({ userId, amount, source });
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get income records
router.get('/:userId', async (req, res) => {
  try {
    const income = await Income.find({ userId: req.params.userId });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete income record
router.delete('/:id', async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
