import fs from 'fs';
import { configDotenv } from 'dotenv';

configDotenv();

const API_KEY = process.env.API_ESIOS;

function getTomorrowDateInSpain() {
  // Crear un objeto de fecha con la zona horaria de Madrid
  const today = new Date();

  // Opciones para formatear la fecha a la zona horaria de Madrid
  const options = {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  // Convertir la fecha actual a la zona horaria de Madrid y obtenerla como una cadena
  const todayInSpainString = today.toLocaleString('en-US', options);

  // Crear un nuevo objeto de fecha basado en la cadena de la fecha en España
  const [month, day, year] = todayInSpainString.split('/');
  const todayInSpain = new Date(`${year}-${month}-${day}T00:00:00`);

  // Añadir un día para obtener la fecha de mañana
  todayInSpain.setDate(todayInSpain.getDate() + 1);

  // Formatear la fecha de mañana a `aaaa-mm-dd`
  const tomorrowMonth = String(todayInSpain.getMonth() + 1).padStart(2, '0');
  const tomorrowDay = String(todayInSpain.getDate()).padStart(2, '0');
  const tomorrowYear = todayInSpain.getFullYear();

  return `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;
}

async function obtenerPreciosElectricidad() {

  const tomorrow = getTomorrowDateInSpain();

  const response = await fetch(`https://api.esios.ree.es/indicators/1001?start_date=${tomorrow}T00:00:00&end_date=${tomorrow}T23:59:59`, {
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json',
      "Host": 'apidatos.ree.es',
      "x-api-key": API_KEY
    }
  });
  const respuesta = await response.json();

  console.log(respuesta)

  if (respuesta.indicator.values.length > 0) {
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

        acumulador.series[0].push((elementoActual.value / 1000).toFixed(2)); // Convertir a €/kWh y redondear a 2 decimales

        return acumulador;
      },
      { labels: [], series: [[]] }
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

  } else {
    console.error('No se han encontrado datos para la fecha solicitada.');
  }


}

export { obtenerPreciosElectricidad };