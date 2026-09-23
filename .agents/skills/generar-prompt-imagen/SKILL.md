---
name: generar-prompt-imagen
description: "WORKFLOW SKILL - Genera un prompt para ilustrar una imagen en Gemini a partir del contenido de un artículo. Use when: el usuario pide un prompt de imagen/ilustración para un artículo o página del sitio."
---

# Generar prompt de imagen para artículos

Genera un prompt listo para copiar y pegar en **Gemini** y crear la ilustración de un artículo de electon.es.

## Regla previa: pedir el artículo

Si el usuario no ha indicado ningún artículo, **pregúntalo y detente hasta obtenerlo**. No inventes ni supongas de qué artículo se trata.

## Parámetros

| Parámetro | Obligatorio | Descripción |
|-----------|-------------|-------------|
| `ARTICLE` | Sí | Ruta de un fichero existente (`src/*.md` o `src/actualidad/*.md`) o URL del artículo. |
| `DIMENSIONS` | No | Tamaño o proporción de la imagen. Si no se indica, usa **1200×600 px (proporción 2:1 apaisada)**, el estándar de las imágenes de portada en `src/img/`. |

## Flujo obligatorio

1. **Lee el artículo completo** antes de proponer nada (el `.md` de `src/`, sin frontmatter). Nunca redactes el prompt solo a partir del título.
2. **Analiza**:
   - Tema y mensaje principal del artículo.
   - Intención de búsqueda y tono (divulgativo, práctico, de actualidad).
   - La idea o sección que mejor represente visualmente el contenido (normalmente el H2 principal o el concepto del título).
   - Si el artículo ya tiene imagen, respeta su concepto o propón uno mejor.
3. **Redacta el prompt en español**, con esta estructura:
   - **Escena**: sujeto, acción y contexto concretos, ligados al contenido real del artículo (no decorativa ni genérica).
   - **Estilo visual**: ilustración o fotografía, encuadre, iluminación y paleta coherente con una web de energía en español.
   - **Contexto español**: infraestructura y objetos propios de España. Evita iconografía extranjera (enchufes británicos o estadounidenses, billetes en dólares, marcas o matrículas no españolas, paisajes no reconocibles como España si el contexto lo exige).
   - **Restricciones**: sin texto legible ni marcas de agua en la imagen.
   - **Formato**: indica el tamaño o proporción al final del prompt (los de `DIMENSIONS` o el 1200×600 por defecto).
4. **Entrega el resultado en el chat**: un único bloque de texto listo para copiar y pegar en Gemini, dentro de un cercado de código para copia limpia. No escribas el prompt en ningún fichero.
   - Opcionalmente, ofrece 1-2 variantes del prompt si aportan enfoques claramente distintos.
   - Recuerda al usuario que la imagen debe guardarse en `src/img/` con un nombre acorde al slug del artículo y que el `og_image` del frontmatter debe apuntar a ella.

## Convenciones

- Todo el texto de la respuesta en español de España (es-ES peninsular).
- No modifiques el artículo ni ningún otro fichero: esta skill solo genera el prompt.
