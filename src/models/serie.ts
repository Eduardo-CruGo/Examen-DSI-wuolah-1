import { Document, model, Schema } from 'mongoose';
import { IUsuario } from './usuario.js'

type Genero = "acción" | "aventura" | "drama" | "suspense" | "deportivo" | "humor" | "biografía";
enum GenerosPermitidos { "acción", "aventura", "drama", "suspense", "deportivo", "humor", "biografía" }


interface ISeries extends Document {
    nombre: string,
    sinopsis: string,
    año_estreno: Number,
    n_temporadas: Number,
    duracion_media_capitulo: number,
    n_episodios_temporada: [string, number] [], 
    reparto: [string, string] [],
    direccion: [string, string] [],
    generos: Genero[],
    usuarios: IUsuario[],
}

const SeriesSchema = new Schema<ISeries>({
    nombre: {
        type: String,
        required: true,
    },
    sinopsis: {
        type: String,
        required: true,
    },
    año_estreno: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if(!Number.isInteger(value)){
                throw new Error('El año tiene que ser un numero entero')
            }
            if(new Date().getFullYear() < value){
                throw new Error('El año es posterior a la fecha actual')
            }
            
        }
    },
    n_temporadas: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if(!Number.isInteger(value) || value < 0) {
                throw new Error('El numero de temporadas tiene que ser un entero positivo')
            }
        }
    },
    duracion_media_capitulo: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if(!Number.isInteger(value) || value < 0) {
                throw new Error('La duracion media de los capitulos tiene que ser un entero positivo')
            }
        }     
    },
    n_episodios_temporada: {
        type: [[String, Number]],
        required: true,
        validate: (value: [string, number][]) => {
            value.forEach(([temporada, n_episodios]) => {
                if (!Number.isInteger(n_episodios) || n_episodios < 0) {
                    throw new Error('La cantidad de episodios tiene que ser un entero positivo')
                }
            });
        }
    },
    reparto: {
        type: [[String, String]],
        required: true,
    },
    direccion: {
        type: [[String, String]],
        required: true,        
    },
    generos: {
        type: [String],
        required: true,
        enum: GenerosPermitidos,
    },
    usuarios: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Usuario'
    },
})

export const Series = model<ISeries>('Series', SeriesSchema)