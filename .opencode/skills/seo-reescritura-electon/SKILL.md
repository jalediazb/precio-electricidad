---
name: seo-reescritura-electon
description: "WORKFLOW SKILL - Pipeline de investigación y reescritura SEO para electon.es (mercado eléctrico español). Use when: optimizar o reescribir una página o post existente de src/ o src/actualidad/ usando MarkItDown, Brave Search (solo fuentes españolas) y edición directa del .md."
---

# SEO Reescritura ElectON

Pipeline unificado para investigar y reescribir una página o post existente de electon.es aplicando las modificaciones **directamente sobre el fichero markdown**.

## Regla previa: preguntar antes de ejecutar

Antes de iniciar el pipeline, confirma siempre estos parámetros. **Si falta alguno de los obligatorios, pregunta al usuario y detente hasta obtenerlo.** No inventes valores.

| Parámetro | Obligatorio | Descripción |
|-----------|-------------|-------------|
| `TARGET_FILE` | Sí | Ruta de un fichero **existente** en `src/` (guía) o `src/actualidad/` (post), p. ej. `src/ahorrar-factura-luz.md` o `src/actualidad/precio-de-la-luz-septiembre-2026.md`. |
| `KEYWORDS` | Sí | Palabra clave principal y/o lista de palabras clave. |
| `ARTICLE_URL` | No | URL de la que extraer el contenido base literal. Si se omite, la base es el contenido actual del fichero. |
| `LENGTH_WORDS` | No | Longitud objetivo del contenido legible (p. ej. 900-1400). Si no se indica, respeta la extensión original. |

Localiza el fichero destino y **léelo** antes de trabajar. Debe existir: **no crees páginas ni posts nuevos**.

**Mercado: solo España (obligatorio).** El mercado eléctrico español (PVPC, peajes, tramos 2.0TD, bono social) no es comparable con el de otros países. No traduzcas keywords al inglés ni busques fuentes extranjeras: sus datos y su regulación no aplican.

## Principios del pipeline

- **Nada de ficheros intermedios.** No crees `content.md`, `urls.md` ni `final.md`. Todo el material extraído y las listas de URLs viven únicamente en la conversación.
- **No detener el proceso.** Ante trabajo pendiente o errores recuperables, continúa sin pedir confirmación.
- **Fidelidad de las fuentes.** No resumas, parafrasees, reordenes ni reescribas al extraer; eso se hace después, en la fase de reescritura.
- **Español de España (es-ES, norma obligatoria).** El resultado final, siempre en español peninsular, aunque una fuente esté en otro idioma. Aplica ortografía de la RAE (tildes en qué/cómo/dónde/cuándo/cuánto) y léxico peninsular. Americanismos y anglicismos prohibidos, con sustitución obligatoria:
  - Generales: computadora → ordenador; celular → móvil; carro → coche; manejar (coche) → conducir; costo → coste; vale la pena → merece la pena; regresar → volver; rentar → alquilar; departamento (vivienda) → piso.
  - Energía: grid → red eléctrica; smart meter → contador inteligente; meter → contador; bill → factura; rate → tarifa; supplier → comercializadora; utility → compañía eléctrica; peak / off-peak → punta / valle; time-of-use → discriminación horaria; power → potencia; consumption → consumo; demand → demanda; forecast → previsión; spot price → precio del mercado diario; feed-in tariff → compensación de excedentes; heat pump → bomba de calor; air conditioning → aire acondicionado; water heater → termo eléctrico / calentador; dishwasher → lavavajillas; washing machine → lavadora; dryer → secadora; fridge → frigorífico / nevera.
  - Se admiten, en cursiva y solo si se explican la primera vez, términos ya asentados en el sector: *pool* (mercado mayorista), *standby* (consumo en espera), *inverter*, *wallbox*.
  - Mantén el tuteo de la casa (verás, te recomendamos, elige), sin voseo ni ustedeo.
  - Revisa al final el texto buscando estos términos antes de escribir el fichero.
- **Sin meta-comentarios.** No menciones las fuentes ni el proceso dentro del artículo.
- **No tocar la lógica de precios ni el gráfico.** No modifiques `utils/ObtenerPreciosElectricidad.js`, el gráfico Chartist (`_includes/js/scripts.js`, franjas/barra de precios) ni su forma de actualización. Esta skill solo edita contenido.

## Flujo de trabajo obligatorio

### 1) Extracción del contenido base
1. Si hay `ARTICLE_URL`, extrae su contenido con **MarkItDown**. Si falla, intenta con `webfetch`.
2. Conserva solo el **cuerpo principal del artículo** aplicando **filtrado estricto de textos estándar**:
   - Excluye navegación, encabezados de sitio, pies de página, barras laterales y widgets sociales.
   - Excluye elementos legales/políticos (política de privacidad, términos, banners de cookies, avisos de copyright).
3. Conserva el texto como **copia literal y sin pérdidas**: formato (negritas, cursivas), enlaces, tablas y estructura de encabezados.
4. Si no hay `ARTICLE_URL`, el contenido base es el cuerpo actual del fichero destino (sin frontmatter).
5. Mantén este contenido en la conversación, sin escribirlo a disco.

### 2) Investigación SERP (solo España)
Para cada palabra clave de `KEYWORDS`:
- Brave Search con `country=ES`, `search_lang=es`, `count=10`.
- **No** se busca en inglés ni en otros mercados (a diferencia de otras skills).

**Prioridad de fuentes españolas (usar y citar preferentemente):**
- **Oficiales**: REE / ESIOS (ree.es, esios.ree.es), OMIE (omie.es), CNMC (cnmc.es), MITECO (miteco.gob.es), IDAE (idae.es), BOE.
- **Consumo y análisis**: OCU (ocu.org), Selectra, Rastreator, tarifaluzhora, Kelisto, HelpMyCash.
- **Comercializadoras y comparadores españoles**: Iberdrola, Endesa, Naturgy, Repsol, TotalEnergies, Octopus Energy ES, Holaluz.

**Fuentes excluidas**: cualquier fuente extranjera (Reino Unido, EE. UU., etc.), por ejemplo Ofgem, gov.uk, Energy Saving Trust, EIA. Si solo aparece una fuente no española para un dato, no lo uses: busca la equivalencia en una fuente española o descártalo.

1. Consolida las URLs obtenidas, una por línea, manteniendo el orden original.
2. Elimina duplicados exactos.
3. Meta de volumen: si tras deduplicar hay **menos de 10 URLs únicas**, repite las búsquedas con `count=20` para todas las keywords y añade los resultados al final y vuelve a deduplicar.

### 3) Procesamiento de fuentes
1. Itera sobre cada URL de la lista.
2. Extrae el contenido con **MarkItDown** aplicando el mismo filtrado estricto de la fase 1.
3. Consérvalo en la conversación. No lo escribas a disco.
4. **Manejo de errores**: si una URL falla (403, 500, timeout), intenta con `webfetch`; si ambos fallan, anota la URL y el error en memoria y continúa. Nunca detengas el pipeline por una fuente.

### 4) Reescritura SEO
El objetivo es que la página sea **más completa que las fuentes**, no más larga.

1. **Análisis estratégico**: compara el contenido original con las fuentes. Detecta vacíos. Respeta la estructura original como base; integra primero en las secciones existentes y solo añade secciones o subsecciones nuevas si los vacíos lo exigen.
2. **Intención de búsqueda**: identifícala (informativa, transaccional, etc.) y satisfácela desde el primer párrafo. Si no puedes determinarla, pregunta al usuario.
3. **Restricción de idioma**: todo el resultado en español de España (es-ES) según la norma de Principios.
4. **Enlaces**: conserva los enlaces internos existentes y los contextualmente relevantes. Los enlaces internos van con **permalink absoluto desde la raíz**, nunca rutas relativas ni URLs completas. Enlaza a las guías relacionadas (`/ahorrar-factura-luz/`, `/mercado-regulado-electricidad-espana/`, etc.).
5. **Tono**: natural, sin transiciones robóticas, con variación de longitud de oraciones y voz activa. Nada de párrafos largos innecesarios.

**Criterios de "superar fuentes":** amplitud (cubre los temas principales de forma coherente), profundidad (aporta contexto donde las fuentes son escasas), estructura (Introducción → Problema → Solución → FAQ) y accionabilidad (recomendaciones prácticas).
**No cuenta como superar:** alargar, añadir información no relacionada o repetir los mismos puntos.

### 5) Escritura directa en el fichero destino
Aplica los cambios con `edit` (o `write` si fuera imprescindible) sobre `TARGET_FILE`. Sigue **estrictamente** las convenciones de este proyecto:

- **No renombres el fichero.** En ElectON la URL se deriva del nombre del fichero. No añadas `permalink` si no existe.
- **No escribas un H1 en el cuerpo.** El H1 lo genera la plantilla (`_includes/page.njk` o `_includes/post.njk`) desde el campo `title`. El cuerpo empieza directamente por el párrafo introductorio o por el TOC.
- **Frontmatter**: conserva `layout`, `title`, `og_image`, `related_links` y `tags`. Actualiza `meta_description` (obligatoria, en es-ES, ~150-160 caracteres). **Actualiza `updated`** a la fecha del cambio (`YYYY-MM-DD`); no cambies `date`.
  - `og_image` debe apuntar a una imagen existente en `src/img/`.
- **Tabla de contenidos**: hay dos estilos en el proyecto. Respeta el de la página:
  - Guías con TOC manual: `<details><summary>Tabla de contenidos</summary><ul>...</ul></details>` y encabezados `<h2 id="kebab-case">`. Si añades o quitas secciones, mantén el TOC y los `id` sincronizados (minúsculas, sin acentos, palabras unidas por guiones).
  - Páginas y posts con encabezados markdown planos (`##`, `###`): no introduzcas `id` HTML ni TOC manual.
- **FAQ**: al final del artículo, con el bloque schema.org exacto (ver sección "FAQs" de `AGENTS.md` y copiar la estructura de `src/ahorrar-factura-luz.md`). HTML crudo, sin markdown dentro; usa `<strong>` si necesitas énfasis. Incluye entre 3 y 5 preguntas.
- **Tablas**: en markdown normal.

### 6) Informe final en el chat
Antes de terminar, ofrece un resumen con:
- Fichero modificado (`TARGET_FILE`).
- Número de URLs únicas obtenidas.
- Número de URLs extraídas con éxito.
- URLs fallidas y el error asociado.
- Confirmación de que solo se usaron fuentes españolas.

## Lista de verificación de finalización

- [ ] Se preguntaron los parámetros obligatorios que faltaban antes de empezar.
- [ ] No se creó ningún fichero intermedio.
- [ ] `TARGET_FILE` actualizado directamente, sin renombrar el fichero ni añadir `permalink`.
- [ ] `meta_description` presente y `updated` actualizada (sin tocar `date`).
- [ ] Sin H1 en el cuerpo; TOC coherente con el estilo de la página.
- [ ] Bloque FAQ schema.org exacto al final (3-5 preguntas).
- [ ] Enlaces internos con permalink absoluto desde la raíz.
- [ ] Todo el texto en español de España (es-ES peninsular, sin americanismos ni anglicismos), sin meta-comentarios.
- [ ] Fuentes exclusivamente españolas; ninguna URL quedó sin intentar.
- [ ] No se tocaron `utils/`, el gráfico Chartist ni la lógica de precios.
