import express from 'express';
import { errorHandler } from './shared/middleware/error.handler.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Hello World`);
});
