import katex from "katex";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Normalizes math delimiters and formats text strings.
 */
export function formatMathAndMarkdown(rawText) {
  if (!rawText) return "";
  let text = String(rawText);

  // 1. Convert bracket latex delimiters \( ... \) -> $ ... $ and \[ ... \] -> $$ ... $$
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, "$$$$$1$$$$");
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, "$$$1$$");

  // Split text by block math ($$...$$) and inline math ($...$)
  // Regex matches:
  // 1. $$...$$ (Display Math)
  // 2. $...$ (Inline Math)
  const mathRegex = /(\$\$[\s\S]+?\$\$|\$(?:\\.|[^$\\])+?\$)/g;
  const parts = text.split(mathRegex);

  return parts
    .map((part) => {
      if (!part) return "";

      // Display Math $$ ... $$
      if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
        const mathContent = part.slice(2, -2).trim();
        try {
          return `<div class="katex-display-block" style="margin: 8px 0; overflow-x: auto; text-align: center;">${katex.renderToString(mathContent, { displayMode: true, throwOnError: false })}</div>`;
        } catch (e) {
          return `<span class="katex-error">${escapeHtml(mathContent)}</span>`;
        }
      }

      // Inline Math $ ... $
      if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
        const mathContent = part.slice(1, -1).trim();
        try {
          return katex.renderToString(mathContent, { displayMode: false, throwOnError: false });
        } catch (e) {
          return `<span class="katex-error">${escapeHtml(mathContent)}</span>`;
        }
      }

      // Regular text segment
      return processTextSegment(part);
    })
    .join("");
}

function processTextSegment(textSegment) {
  // First escape HTML entities
  let formatted = escapeHtml(textSegment);

  // Markdown bold, italic, code, linebreaks
  formatted = formatted
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");

  // Render un-delimited LaTeX strings (e.g. \sqrt{2}, \frac{a}{b}, \pi, \theta, \alpha, \beta, \degree)
  formatted = formatted.replace(
    /(\\sqrt\{[^{}]+\}|\\frac\{[^{}]+\}\{[^{}]+\}|\\pi|\\theta|\\alpha|\\beta|\\Delta|\\pm|\\degree)/g,
    (match) => {
      // Unescape HTML entities in the match for KaTeX rendering
      const unescapedMatch = match.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
      try {
        return katex.renderToString(unescapedMatch, { displayMode: false, throwOnError: false });
      } catch (e) {
        return match;
      }
    }
  );

  return formatted;
}

export default function MathText({ text, className = "", style = {} }) {
  if (!text) return null;
  const htmlContent = formatMathAndMarkdown(text);

  return (
    <span
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
