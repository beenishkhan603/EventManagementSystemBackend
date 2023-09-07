// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('./models/event');

// Create a new event
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        // Check for event overlap
        const existingEvents = await Event.find({
          $or: [
            {
              startDate: { $lt: newEvent.endDate },
              endDate: { $gt: newEvent.startDate },
            },
          ],
        });
    
        if (existingEvents.length > 0) {
          return res.status(400).json({ error: 'Event overlaps with existing event(s)' });
        }
        await newEvent.save();
        res.status(201).json(newEvent);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

// Retrieve all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an event by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an event by ID
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndRemove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
