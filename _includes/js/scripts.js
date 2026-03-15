const chartContainer = document.querySelector('.ct-chart');

if (chartContainer && typeof Chartist !== 'undefined' && data) {
    new Chartist.Line('.ct-chart', data, {
        lineSmooth: Chartist.Interpolation.step(
            { postpone: true, fillHoles: false }),
        axisY: {
            labelInterpolationFnc: function (value) {
                return value.toFixed(2); // Redondea a 2 decimales
            }
        }
    });
}

// Crear las franjas de colores

const preciosArray = Array.isArray(precios) ? precios : [];
const preciosOrdenados = [...preciosArray].sort((a, b) => a.valor - b.valor);
const valoresBaratos = new Set(preciosOrdenados.slice(0, 5).map(p => p.valor));
const valoresCaros = new Set(preciosOrdenados.slice(-5).map(p => p.valor));

const cheapestHourEl = document.getElementById('fact-cheapest-hour');
const expensiveHourEl = document.getElementById('fact-expensive-hour');
const averagePriceEl = document.getElementById('fact-average-price');

if (preciosOrdenados.length) {
    const cheapest = preciosOrdenados[0];
    const expensive = preciosOrdenados[preciosOrdenados.length - 1];
    const avg = preciosArray.reduce((sum, item) => sum + Number(item.valor), 0) / preciosArray.length;

    if (cheapestHourEl) {
        cheapestHourEl.textContent = `${cheapest.hora} h (${Number(cheapest.valor).toFixed(3)} €/kWh)`;
    }

    if (expensiveHourEl) {
        expensiveHourEl.textContent = `${expensive.hora} h (${Number(expensive.valor).toFixed(3)} €/kWh)`;
    }

    if (averagePriceEl) {
        averagePriceEl.textContent = `${avg.toFixed(3)} €/kWh`;
    }
}
/*precios.forEach(precio => {
    const franja = document.createElement('div');
    franja.classList.add('franja');
    // Asigna una clase de color según el valor
    if (valoresBaratos.has(precio.valor)) {
        franja.classList.add('barata');
    } else if (valoresCaros.has(precio.valor)) {
        franja.classList.add('cara');
    } else {
        franja.classList.add('normal');
    } franja.textContent = precio.hora;
    // Opcional: añade la hora como un tooltip
    franja.title = `Hora: ${precio.hora
        }h, Precio: ${precio.valor
        } €`;
    const contenedor = document.getElementById('contenedor-franjas');
    contenedor.appendChild(franja);
});*/

// Barra de precios

const barContainer = document.getElementById('prices-bar');

if (barContainer && preciosArray.length) {
    preciosArray.forEach(precio => {
        const franja = document.createElement('div');
        franja.classList.add('franja', 'is-flex', 'is-flex-grow-1', 'has-text-centered', 'is-align-items-center', 'is-justify-content-center');
        // Asigna una clase de color según el valor
        if (valoresBaratos.has(precio.valor)) {
            franja.classList.add('has-background-success');
        } else if (valoresCaros.has(precio.valor)) {
            franja.classList.add('has-background-danger');
        } else {
            franja.classList.add('has-background-warning');
        } franja.textContent = precio.hora;
        // Opcional: añade la hora como un tooltip
        franja.title = `Hora: ${precio.hora
            }h, Precio: ${precio.valor
            } €`;
        barContainer.appendChild(franja);
    });
}