
new Chartist.Line('.ct-chart', data, {
    lineSmooth: Chartist.Interpolation.step(
        { postpone: true, fillHoles: false }),
    axisY: {
        labelInterpolationFnc: function (value) {
            return value.toFixed(2); // Redondea a 2 decimales
        }
    }
});

// Crear las franjas de colores

const preciosOrdenados = [...precios].sort((a, b) => a.valor - b.valor);
const valoresBaratos = new Set(preciosOrdenados.slice(0, 5).map(p => p.valor));
const valoresCaros = new Set(preciosOrdenados.slice(-5).map(p => p.valor));
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

// Test prices-bar

precios.forEach(precio => {
    const franja = document.createElement('div');
    franja.classList.add('franja');
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
    const contenedor = document.getElementById('prices-bar');
    contenedor.appendChild(franja);
});