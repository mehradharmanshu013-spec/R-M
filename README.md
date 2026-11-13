# Quote Status Dashboard — separated project

## Files
- `index.html` — semantic page structure and Chart.js dependency
- `styles.css` — dashboard styling, theme variables and responsive rules
- `app.js` — dashboard data, rendering, filtering, charts and document-viewer behavior

## Run
Open `index.html` in a modern browser. Chart.js is loaded from its CDN, so an internet connection is needed for charts.

## Structure and maintainability
- JavaScript is wrapped in a strict IIFE, so dashboard variables and functions do not leak into `window`.
- DOM queries are rooted at `#quote-dashboard`.
- The mobile filter toggle is wired from JavaScript using a `data-action` attribute; no inline JavaScript handler remains.
- CSS theme variables and the main dashboard styles are scoped to `#quote-dashboard`.
- Existing quote/document data and dashboard behavior have been retained.

## Notes
The original dashboard's document payloads are embedded in the JavaScript data object. This keeps the project self-contained but makes `app.js` large. For a larger application, move the data into a separate `data.js` or load it from an API.