require('dotenv').config();

const mongoose = require('mongoose');
const cors = require('cors');

const express = require('express');
const { userRouter,groupRouter } = require('./routes/');

const {
  env: { PORT, DB_URL,DB_PROD_URL },
} = process;

mongoose
  .connect(DB_PROD_URL)
  .then(() => {
    const port = PORT || 3000;

    const app = express();

    const http = require('http').Server(app);

    app.use(cors());

    app.use('/api', [userRouter,groupRouter]);

    http.listen(port, () => console.log(`server running on port ${port}`));

    // app.listen(port, () => console.log(`server running on port ${port}`));

    process.on('SIGINT', () => {
      console.log('\nstopping server');

      mongoose.connection.close(() => {
        console.log('db connection closed');

        process.exit();
      });
    });
  })
  .catch(console.error);
