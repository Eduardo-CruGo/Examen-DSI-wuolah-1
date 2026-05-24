import express from "express";
import { Usuario } from "../models/usuario.js"
import { Series } from "../models/serie.js";

export const routerUsuario = express.Router();

routerUsuario.post("/usuario", async (req, res) => {
    const usuario = new Usuario(req.body);
    try {
        await usuario.save();
        res.status(201).send(usuario);
    } catch (error) {
        res.status(500).send(error);
    }
});

routerUsuario.get("/usuario", async (req, res) => {
    const filter = req.query.nombre_usr ? {nombre_usr: req.query.nombre_usr.toString()} : {};
    try{
        const usuario = await Usuario.find(filter);
        if (usuario.length == 0) {
            res.status(404).send({
                error: "No se puedo encontrar al usuario"
            })
        } else {
            res.send(usuario)
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

routerUsuario.patch("/usuario", async (req, res) => {
    if (!req.query.nombre_usr) {
        res.status(400).send({
            error: "No se introdujo nombre de usuario"
        });
    } else {
        const allowedUpdates = ["nombre", "nombre_usr", "correo", "generos"];
        const actualUpdates = Object.keys(req.body);
        const isValidUpdate = actualUpdates.every((update) =>
        allowedUpdates.includes(update),
    );

        if (!isValidUpdate) {
            res.status(400).send({
                error: "Actualizacion no permitida",
            });
        } else {
            try {
                const usuario = await Usuario.findOneAndUpdate(
                    {
                        nombre_usr: req.query.nombre_usr.toString(),
                    },
                    req.body,
                    {
                        returnDocument: 'after',
                        runValidators: true,
                    },
                );
                if (usuario) {
                    res.send(usuario);
                } else {
                    res.status(404).send({
                        error: "No se pudo encontrar al usuario"
                    })
                }
            } catch (error) {
                res.status(500).send(error);
            }        
        }
    }
});

routerUsuario.delete("/usuario", async (req, res) => {
    if (!req.query.nombre_usr) {
        res.status(400).send({
            error: "No se introdujo nombre de usuario"
        });
    } else {
        try {
            const usuario = await Usuario.findOne({
                nombre_usr: req.query.nombre_usr.toString(),
            });
            if (!usuario) {
                res.status(404).send({
                    error: "No se pudo encontrar al usuario"
                });
            } else {
                // REVISAR ESTA PARTE
                const series = await Series.find({usuarios: usuario._id,});

                for (const serie of series) {
                    serie.usuarios = serie.usuarios.filter((idUsuario) =>
                        idUsuario.toString() !== usuario._id.toString()
                    );

                    await Usuario.findByIdAndDelete(usuario._id);

                    res.send(usuario);
                }

                await Usuario.findByIdAndDelete(usuario._id);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }
});