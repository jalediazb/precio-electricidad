import { obtenerPreciosElectricidad } from './utils/ObtenerPreciosElectricidad.js';

export default async function (eleventyConfig) {   
    const ensureClassOnTag = (content, tagName, className) => {
        const tagRegex = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
        const classRegex = /\bclass\s*=\s*(['"])(.*?)\1/i;

        return content.replace(tagRegex, (fullMatch, attrs) => {
            if (classRegex.test(attrs)) {
                const updatedAttrs = attrs.replace(classRegex, (classMatch, quote, classValue) => {
                    const classList = classValue.split(/\s+/).filter(Boolean);
                    if (!classList.includes(className)) {
                        classList.push(className);
                    }
                    return `class=${quote}${classList.join(" ")}${quote}`;
                });

                return `<${tagName}${updatedAttrs}>`;
            }

            return `<${tagName}${attrs} class="${className}">`;
        });
    };
    
    eleventyConfig.addPassthroughCopy("_includes/style.css");
    eleventyConfig.addPassthroughCopy("_includes/img/electON.png");
    eleventyConfig.addPassthroughCopy("src/img");

    eleventyConfig.addFilter("isoDate", (date) => {
        return new Date(date).toISOString().split("T")[0];
    });

    eleventyConfig.amendLibrary("md", (mdLib) => {
        const defaultImageRenderer = mdLib.renderer.rules.image;

        mdLib.renderer.rules.image = (tokens, idx, options, env, self) => {
            const imageHtml = defaultImageRenderer
                ? defaultImageRenderer(tokens, idx, options, env, self)
                : self.renderToken(tokens, idx, options);

            return `<figure class="image">${imageHtml}</figure>`;
        };
    });

    eleventyConfig.addTransform("unwrapFigureParagraph", (content, outputPath) => {
        if (!outputPath || !outputPath.endsWith(".html")) {
            return content;
        }

        return content.replace(
            /<p>\s*(<figure class="image">\s*<img\b[^>]*>\s*<\/figure>)\s*<\/p>/gi,
            "$1"
        );
    });

    eleventyConfig.addTransform("wrapTables", (content, outputPath) => {
        if (!outputPath || !outputPath.endsWith(".html")) {
            return content;
        }

        const contentWithTableClass = ensureClassOnTag(content, "table", "table");

        return contentWithTableClass.replace(
            /<table\b([^>]*)>([\s\S]*?)<\/table>/gi,
            '<div class="table-container"><table$1>$2</table></div>'
        );
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