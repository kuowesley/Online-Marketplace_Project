import express from 'express';
import constructorMethod from './routes/index.js';

const app = express();

// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

constructorMethod(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});