import fs from "fs";
import { configDotenv } from "dotenv";

configDotenv();

const API_KEY = process.env.API_ESIOS;

console.log(
  `API_ESIOS: ${API_KEY ? `presente (${API_KEY.length} caracteres)` : "AUSENTE"}`,
);

function getDateInSpain(offsetDays) {
  // Crear un objeto de fecha con la zona horaria de Madrid
  const today = new Date();

  // Opciones para formatear la fecha a la zona horaria de Madrid
  const options = {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  // Convertir la fecha actual a la zona horaria de Madrid y obtenerla como una cadena
  const todayInSpainString = today.toLocaleString("en-US", options);

  // Crear un nuevo objeto de fecha basado en la cadena de la fecha en España
  const [month, day, year] = todayInSpainString.split("/");
  const dateInSpain = new Date(`${year}-${month}-${day}T00:00:00`);

  // Aplicar el desplazamiento en días (0 = hoy, 1 = mañana)
  dateInSpain.setDate(dateInSpain.getDate() + offsetDays);

  // Formatear la fecha a `aaaa-mm-dd`
  const formattedMonth = String(dateInSpain.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(dateInSpain.getDate()).padStart(2, "0");
  const formattedYear = dateInSpain.getFullYear();

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}

function getTomorrowDateInSpain() {
  return getDateInSpain(1);
}

function getTodayDateInSpain() {
  return getDateInSpain(0);
}

async function fetchValoresPorFecha(fechaStr) {
  try {
    const response = await fetch(
      `https://api.esios.ree.es/indicators/1001?start_date=${fechaStr}T00:00:00&end_date=${fechaStr}T23:59:59`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      },
    );

    if (!response.ok) {
      const detalle = await response.text().catch(() => "");
      console.error(
        `ESIOS respondió ${response.status} para la fecha ${fechaStr}. Body: ${detalle.slice(0, 300)}`,
      );
      return [];
    }

    const respuesta = await response.json();

    console.log(`Respuesta ESIOS para ${fechaStr}:`, respuesta);

    const valores = (respuesta.indicator?.values ?? []).filter(
      (item) => item.geo_id === 8741,
    );

    return valores;
  } catch (error) {
    console.error(`Error al consultar ESIOS para ${fechaStr}:`, error);
    return [];
  }
}

async function obtenerPreciosElectricidad() {
  const tomorrow = getTomorrowDateInSpain();
  let respuesta = { indicator: { values: await fetchValoresPorFecha(tomorrow) } };

  if (respuesta.indicator.values.length === 0) {
    console.log(
      `No se han encontrado datos para mañana (${tomorrow}). Probando con hoy.`,
    );
    const today = getTodayDateInSpain();
    respuesta = {
      indicator: { values: await fetchValoresPorFecha(today) },
    };
  }

  if (respuesta.indicator.values.length > 0) {
    const fecha = new Date(
      respuesta.indicator.values[0].datetime,
    ).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Europe/Madrid",
    });

    console.log(respuesta.indicator.values[0].datetime);

    const precios = respuesta.indicator.values
      .filter((item) => item.geo_id === 8741)
      .map((item) => ({
        hora: item.datetime.slice(11, 13),
        valor: (item.value / 1000).toFixed(2),
      }));

    const horasCaras = [...precios]
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
    const horasBaratas = [...precios]
      .sort((a, b) => a.valor - b.valor)
      .slice(0, 5);

    // Datos grafico
    const preciosGrafico = respuesta.indicator.values
      .filter((item) => item.geo_id === 8741)
      .reduce(
        (acumulador, elementoActual) => {
          acumulador.labels.push(elementoActual.datetime.slice(11, 13));

          acumulador.series[0].push((elementoActual.value / 1000).toFixed(2)); // Convertir a €/kWh y redondear a 2 decimales

          return acumulador;
        },
        { labels: [], series: [[]] },
      );

    const fechaActualizacion = new Date(
      respuesta.indicator.values[0].datetime,
    ).toLocaleDateString("en-CA", {
      timeZone: "Europe/Madrid",
    });

    const preciosProcesados = {
      preciosGrafico,
      fecha,
      fechaActualizacion,
      precios,
      horasBaratas,
      horasCaras,
    };

    console.log(preciosProcesados);

    // Escribir el resultado de la consulta en _data/precios.json
    await fs.promises.writeFile(
      "_data/precios.json",
      JSON.stringify(preciosProcesados, null, 2),
    );

    return preciosProcesados;
  } else {
    console.error(
      "No se han encontrado datos ni para mañana ni para hoy. Se conserva el precios.json anterior.",
    );
  }
}

export { obtenerPreciosElectricidad };
