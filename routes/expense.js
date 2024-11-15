// routes/expense.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

// Add expense
router.post('/add', async (req, res) => {
  const { userId, amount, category, description } = req.body;
  try {
    const expense = new Expense({ userId, amount, category, description });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses
router.get('/:userId', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense record
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
