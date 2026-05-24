import express from 'express';
import './db/mongoose.js'

import { routerUsuario } from "./routers/router_usuario.js"
import { routerSerie } from "./routers/router_serie.js"
import { defaultRouter } from './routers/router_default.js';

export const app = express();
app.use(express.json());
app.use(routerUsuario);
app.use(routerSerie);
app.use(defaultRouter);

