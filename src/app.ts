import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/MiddleWare/globalErrorHandler';
import notFoundRoute from './app/MiddleWare/noRouteFound';
import router from './app/routes';

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Bike Rental service');
});

app.use(globalErrorHandler);
app.use(notFoundRoute);

export default app;
