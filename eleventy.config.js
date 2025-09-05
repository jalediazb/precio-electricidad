import { obtenerPreciosElectricidad } from './utils/ObtenerPreciosElectricidad.js';

export default async function (eleventyConfig) {   
    
    eleventyConfig.addPassthroughCopy("_includes/style.css");

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