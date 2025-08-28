import { obtenerPreciosElectricidad } from './utils/ObtenerPreciosElectricidad.js';

export default async function (eleventyConfig) {

     

    /* --- Get API --- */
    const precios = await obtenerPreciosElectricidad();
    
    /* --- Estructura de directorios --- */
    return {
        dir: {
            input: './src',
            data: '../_data',
            includes: '../_includes'
        }
    }
};