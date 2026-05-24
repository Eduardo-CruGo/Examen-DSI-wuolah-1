import express from 'express';
import './db/mongoose.js'

import { routerUsuario } from "./routers/router_usuario.js"
import { routerSerie } from "./routers/router_serie.js"
import { defaultRouter } from './routers/router_default.js';

const app = express();
app.use(express.json());
app.use(routerUsuario);
app.use(routerSerie);
app.use(defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});