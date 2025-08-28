import fs from 'fs';
import { configDotenv } from 'dotenv';

configDotenv();

const API_KEY = process.env.API_ESIOS;

async function obtenerPreciosElectricidad() {
  const response = await fetch('https://api.esios.ree.es/indicators/1001', {
    headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json',
        "Host": 'apidatos.ree.es',
        "x-api-key": API_KEY
    }
  });
  const respuesta = await response.json();

  const fecha = new Date(respuesta.indicator.values[0].datetime).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Madrid'
  });

  console.log(respuesta.indicator.values[0].datetime)

  const precios = respuesta.indicator.values.filter(item => item.geo_id === 8741).map(item => ({
    hora: item.datetime.slice(11, 13),
    valor: (item.value / 1000).toFixed(2)
  }));


  const horasCaras = [...precios].sort((a, b) => b.valor - a.valor).slice(0, 5);
  const horasBaratas = [...precios].sort((a, b) => a.valor - b.valor).slice(0, 5);
  


  // Datos grafico
  const preciosGrafico = respuesta.indicator.values.filter(item => item.geo_id === 8741).reduce(
    (acumulador, elementoActual) => {
    acumulador.labels.push(elementoActual.datetime.slice(11, 13));

    acumulador.series[0].push((elementoActual.value/1000).toFixed(2)); // Convertir a €/kWh y redondear a 2 decimales

    return acumulador;
  },
  { labels: [], series: [[]]}
  );

  const preciosProcesados = {
    preciosGrafico,
    fecha,
    precios,
    horasBaratas,
    horasCaras
  }

  console.log(preciosProcesados)
  

  // Escribir el resultado de la consulta en _data/precios.json
  await fs.promises.writeFile('_data/precios.json', JSON.stringify(preciosProcesados, null, 2));

  return preciosProcesados;
}

export { obtenerPreciosElectricidad };