import { Document, model, Schema } from 'mongoose';
import { IUsuario } from './usuario.js'

type Genero = "acción" | "aventura" | "drama" | "suspense" | "deportivo" | "humor" | "biografía";
const GenerosPermitidos: Genero[] = ["acción", "aventura", "drama", "suspense", "deportivo", "humor", "biografía"];

interface INepisodio {
  temporada: string;
  n_episodios: number;
}

interface IReparto {
  actor: string;
  personaje: string;
}

interface IDireccion {
  nombre: string;
  rol: string;
}

interface ISeries extends Document {
    nombre: string,
    sinopsis: string,
    año_estreno: number,
    n_temporadas: number,
    duracion_media_capitulo: number,
    n_episodios_temporada: INepisodio[],
    reparto: IReparto[],
    direccion: IDireccion[],
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
        type: [{
            temporada: { type: String, required: true },
            n_episodios: { type: Number, required: true, validate: (v: number) => {
                if (!Number.isInteger(v) || v < 0)
                    throw new Error('La cantidad de episodios tiene que ser un entero positivo')
            } }
        }],
        required: true,
    },
    reparto: {
        type: [{ actor: String, personaje: String }],
        required: true,
    },
    direccion: {
        type: [{ nombre: String, rol: String }],
        required: true,        
    },
    generos: {
        type: [String],
        required: true,
        enum: GenerosPermitidos,
    },
    usuarios: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
        required: true,
    },
})

export const Series = model<ISeries>('Series', SeriesSchema)