import { obtenerPreciosElectricidad } from './utils/ObtenerPreciosElectricidad.js';

export default async function (eleventyConfig) {   
    
    eleventyConfig.addPassthroughCopy("_includes/style.css");
    eleventyConfig.addPassthroughCopy("_includes/img/electON.png");

    eleventyConfig.addFilter("isoDate", (date) => {
        return new Date(date).toISOString().split("T")[0];
    });

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