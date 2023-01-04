const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Checked Server');
});

app.listen(3066, () => {
  console.log('server On');
});
