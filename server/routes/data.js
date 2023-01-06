const express = require('express');
const Check = require('../models/check');
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

router.post('/savedata', async (req, res, next) => {
  // POST /data/savedata
  try {
    const check = await Check.create({
      do: req.body.do,
      si: req.body.si,
      company: req.body.name,
      address: req.body.address,
      product: req.body.product,
    });
    console.log('server: ', check);
    res.status(200).json(check);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
