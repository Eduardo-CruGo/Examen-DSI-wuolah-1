import express from 'express';
import './db/mongoose.js';
import { pacienteRouter } from './routers/router_pacientes.js';
//import { medicationsRouter } from './routers/medicationRouter.js';
//import { recordsRouter } from './routers/recordRouter.js';
//import { staffRouter } from './routers/staffRouter.js';
//import { defaultRouter } from './routers/defaultRouter.js';


export const app = express();
app.use(express.json());

app.use(pacienteRouter);
//app.use(medicationsRouter);
//app.use(recordsRouter);
//app.use(staffRouter);
//app.use(defaultRouter);