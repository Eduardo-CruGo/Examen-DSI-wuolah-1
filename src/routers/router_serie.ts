import express from "express"
import { Usuario } from "../models/usuario.js"
import { Series } from "../models/serie.js"

export const routerSerie = express.Router();


// Al crear tengo q comprobar que los usuarios existan
routerSerie.post("/series", async (req, res) => {
  try {
    const serie = new Series(req.body);
    for (const element of req.body.usuarios) {
      const usuario = await Usuario.findById(element);
      if (!usuario) {
        res.status(404).send({
          error: "Uno de los usuarios de la serie no existen"
        });
        return;
      }
    }

    await serie.save();
    res.status(201).send(serie);
  } catch (error) {
    res.status(500).send(error);
  }
});

routerSerie.get("/series", async (req, res) => {
    try{
        const serie = await Series.find({}).populate("usuarios");
        if (serie.length == 0) {
            res.status(404).send({
                error: "No se puedo encontrar la serie"
            })
        } else {
            res.send(serie)
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

routerSerie.get("/series/:id", async (req, res) => {
    try{
        const serie = await Series.findOne({ _id: req.params.id}).populate("usuarios")
        if (!serie) {
            res.status(404).send({
                error: "No se puedo encontrar la serie"
            })
        } else {
            res.send(serie);
        }   
    } catch (error) {
        res.status(500).send(error);
    }
});

routerSerie.patch("/series/:id", async (req, res) => {
    if (req.body.usuarios) {
        for (const element of req.body.usuarios) {
            const usuario = await Usuario.findById(element);
            if (!usuario) {
                res.status(404).send({
                    error: "Uno de los usuarios de la serie no existen"
                });
                return;
            }
        }
    }

    try {
        const serie = await Series.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                returnDocument: 'after',
                runValidators: true,
            },
        ).populate("usuarios");

        if (!serie) {
            res.status(404).send({
                error: "No se puedo encontrar la serie"
            });
        } else {
            res.send(serie);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

routerSerie.delete("/series/:id", async (req, res) => {
    try {
        const serie = await Series.findByIdAndDelete(req.params.id)
        if (!serie) {
            res.status(404).send({
                error: "No se pudo econtrar la serie"
            })
        } else {
            res.send(serie);
        }
    } catch (error) {
        res.status(500).send(error);
    }
})