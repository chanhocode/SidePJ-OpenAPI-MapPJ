const express = require('express');
const router = express.Router();

const Visit = require('../models/visit');

router.post('/join', async (req, res, next) => {
  // POST /data/join
  try {
    const visit = await Visit.create({
      age: req.body.age,
      gender: req.body.gender,
    });
    res.status(200).json(visit);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
