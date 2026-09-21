---
layout: page
title: "Calculadora de factura PVPC: estima tu coste"
meta_description: "Calculadora gratuita para estimar tu factura de la luz PVPC: introduce tu consumo por tramos y tus precios y obtén el coste con impuestos incluidos."
date: 2026-09-20
updated: 2026-09-21
author: "ElectON"
og_image: "/img/comprar-precio-electricidad-espana.jpg"
related_links:
  - title: "Cómo entender la factura de la luz"
    url: "/como-entender-factura-luz/"
  - title: "Horas más baratas de la luz hoy"
    url: "/horas-mas-baratas-luz-hoy/"
  - title: "Tarifa 2.0TD: tramos horarios"
    url: "/tarifa-2-0td/"
---

Esta calculadora te ayuda a **estimar cuánto pagarás en tu factura de la luz** con tarifa PVPC o con cualquier tarifa con discriminación horaria. Introduce tus datos y verás el desglose con impuestos incluidos.

<p class="notification is-info is-light">Los valores que vienen por defecto son solo un ejemplo. Para un cálculo fiel, copia los importes y el consumo reales de tu última factura.</p>

<div class="calc-form">
  <div class="columns is-multiline">
    <div class="column is-half">
      <div class="field">
        <label class="label" for="calc-potencia">Término de potencia (€/mes)</label>
        <input class="input" type="number" id="calc-potencia" value="12.63" step="0.01" min="0">
        <p class="help">Cópialo del apartado "término de potencia" de tu factura.</p>
      </div>
    </div>
    <div class="column is-half">
      <div class="field">
        <label class="label" for="calc-alquiler">Alquiler del contador (€/mes)</label>
        <input class="input" type="number" id="calc-alquiler" value="0.80" step="0.01" min="0">
      </div>
    </div>
  </div>

  <div class="columns is-multiline">
    <div class="column is-one-third">
      <div class="field">
        <label class="label" for="calc-consumo-punta">Consumo punta (kWh)</label>
        <input class="input" type="number" id="calc-consumo-punta" value="90" step="1" min="0">
      </div>
      <div class="field">
        <label class="label" for="calc-precio-punta">Precio punta (€/kWh)</label>
        <input class="input" type="number" id="calc-precio-punta" value="0.14" step="0.001" min="0">
      </div>
    </div>
    <div class="column is-one-third">
      <div class="field">
        <label class="label" for="calc-consumo-llano">Consumo llano (kWh)</label>
        <input class="input" type="number" id="calc-consumo-llano" value="100" step="1" min="0">
      </div>
      <div class="field">
        <label class="label" for="calc-precio-llano">Precio llano (€/kWh)</label>
        <input class="input" type="number" id="calc-precio-llano" value="0.12" step="0.001" min="0">
      </div>
    </div>
    <div class="column is-one-third">
      <div class="field">
        <label class="label" for="calc-consumo-valle">Consumo valle (kWh)</label>
        <input class="input" type="number" id="calc-consumo-valle" value="120" step="1" min="0">
      </div>
      <div class="field">
        <label class="label" for="calc-precio-valle">Precio valle (€/kWh)</label>
        <input class="input" type="number" id="calc-precio-valle" value="0.08" step="0.001" min="0">
      </div>
    </div>
  </div>

  <div class="columns is-multiline">
    <div class="column is-half">
      <div class="field">
        <label class="label" for="calc-impuesto">Impuesto eléctrico (%)</label>
        <input class="input" type="number" id="calc-impuesto" value="5.11" step="0.01" min="0">
      </div>
    </div>
    <div class="column is-half">
      <div class="field">
        <label class="label" for="calc-iva">IVA (%)</label>
        <input class="input" type="number" id="calc-iva" value="21" step="1" min="0">
      </div>
    </div>
  </div>

  <button type="button" id="calc-calcular" class="button is-link is-medium">Calcular mi factura</button>
</div>

<div class="calc-result" id="calc-result" hidden>
  <p class="has-text-weight-semibold">Factura estimada</p>
  <p class="calc-result-total" id="calc-total">-- €</p>
  <div class="calc-breakdown" id="calc-breakdown"></div>
  <p class="is-size-7 has-text-grey mt-3">Estimación orientativa. Tu factura real puede variar por días facturados, lecturas, ajustes y otros conceptos.</p>
</div>

<script>
(function () {
  var ids = [
    'calc-potencia', 'calc-alquiler',
    'calc-consumo-punta', 'calc-precio-punta',
    'calc-consumo-llano', 'calc-precio-llano',
    'calc-consumo-valle', 'calc-precio-valle',
    'calc-impuesto', 'calc-iva'
  ];

  function val(id) {
    var el = document.getElementById(id);
    if (!el) return 0;
    var n = parseFloat(el.value);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  function eur(n) {
    return n.toFixed(2).replace('.', ',') + ' €';
  }

  function calcular() {
    var potencia = val('calc-potencia');
    var alquiler = val('calc-alquiler');
    var energia =
      val('calc-consumo-punta') * val('calc-precio-punta') +
      val('calc-consumo-llano') * val('calc-precio-llano') +
      val('calc-consumo-valle') * val('calc-precio-valle');
    var subtotal = potencia + alquiler + energia;
    var impuesto = subtotal * val('calc-impuesto') / 100;
    var baseIva = subtotal + impuesto;
    var iva = baseIva * val('calc-iva') / 100;
    var total = baseIva + iva;

    document.getElementById('calc-total').textContent = eur(total);
    document.getElementById('calc-breakdown').innerHTML =
      '<div><span>Término de potencia</span><span>' + eur(potencia) + '</span></div>' +
      '<div><span>Energía consumida</span><span>' + eur(energia) + '</span></div>' +
      '<div><span>Alquiler del contador</span><span>' + eur(alquiler) + '</span></div>' +
      '<div><span>Subtotal</span><span>' + eur(subtotal) + '</span></div>' +
      '<div><span>Impuesto eléctrico</span><span>' + eur(impuesto) + '</span></div>' +
      '<div><span>IVA</span><span>' + eur(iva) + '</span></div>' +
      '<div><span><strong>Total</strong></span><span><strong>' + eur(total) + '</strong></span></div>';

    document.getElementById('calc-result').hidden = false;
  }

  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', calcular);
  });

  var btn = document.getElementById('calc-calcular');
  if (btn) btn.addEventListener('click', calcular);
})();
</script>

<h2>Cómo interpretar el resultado</h2>

- Si el **término de energía** se lleva la mayor parte, moverás la aguja ahorrando kWh y desplazando consumo a horas baratas.
- Si el **término de potencia** pesa mucho, revisa si tienes contratada más potencia de la que necesitas. Puedes consultar [qué potencia contratar](/potencia-contratada-recomendada/).
- Recuerda que en PVPC el precio del kWh cambia cada hora: usa precios **medios por tramo** para una estimación, o el precio de una hora concreta para casos puntuales.

Para entender cada concepto de la factura, consulta la guía [cómo entender la factura de la luz](/como-entender-factura-luz/).
