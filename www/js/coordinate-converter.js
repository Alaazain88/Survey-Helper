<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Survey Helper Pro</title>
    <style>
      :root {
        color-scheme: light;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        --bg: #f3f7fc;
        --panel: #ffffff;
        --panel-border: #dfe8f4;
        --text: #1f2a37;
        --muted: #53657b;
        --primary: #0057b8;
        --primary-soft: #eaf3ff;
        --warning: #7a4b00;
        --warning-bg: #fff2d8;
        --danger: #8c1d18;
        --danger-bg: #fce8e6;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
      }

      .app-shell {
        width: min(1120px, calc(100vw - 24px));
        margin: 24px auto;
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(1.8rem, 2vw, 2.5rem);
      }

      .header-note {
        background: var(--warning-bg);
        border: 1px solid #f0d89a;
        color: var(--warning);
        border-radius: 12px;
        padding: 10px 14px;
        margin-bottom: 18px;
        font-size: 0.95rem;
      }

      .panel-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 18px;
      }

      .panel {
        background: var(--panel);
        border: 1px solid var(--panel-border);
        border-radius: 16px;
        padding: 18px;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
      }

      .panel h2 {
        margin-top: 0;
        font-size: 1.1rem;
      }

      .row {
        display: grid;
        grid-template-columns: repeat(2, minmax(120px, 1fr));
        gap: 12px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;
      }

      label {
        font-weight: 600;
        font-size: 0.88rem;
      }

      input, select, button {
        font: inherit;
        border-radius: 10px;
        border: 1px solid #c8d6eb;
        padding: 10px 12px;
      }

      input {
        background: #fff;
        color: var(--text);
      }

      button {
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        font-weight: 600;
        transition: filter 0.15s ease;
      }

      button.secondary {
        background: #163a5f;
      }

      button:hover {
        filter: brightness(1.05);
      }

      .button-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 6px;
      }

      .result {
        margin-top: 14px;
        padding: 12px;
        border-radius: 10px;
        background: var(--primary-soft);
        color: var(--text);
        min-height: 44px;
        white-space: pre-wrap;
      }

      .result.error {
        background: var(--danger-bg);
        color: var(--danger);
      }

      .muted {
        color: var(--muted);
        font-size: 0.86rem;
      }

      .section-spacer {
        margin-top: 18px;
      }
    </style>
  </head>
  <body>
    <div class="app-shell">
      <h1>Survey Helper Pro</h1>

      <div class="header-note">
        EGM2008 geoid correction is disabled until a verified geoid model is integrated. Manual height conversion remains required.
      </div>

      <div class="panel-grid">
        <section class="panel">
          <h2>Coordinate conversion</h2>

          <div class="row">
            <div class="field">
              <label for="latInput">Latitude (°)</label>
              <input id="latInput" type="text" value="25.1970" placeholder="25.1970" />
            </div>
            <div class="field">
              <label for="lonInput">Longitude (°)</label>
              <input id="lonInput" type="text" value="55.2744" placeholder="55.2744" />
            </div>
          </div>

          <div class="button-row">
            <button id="convertToProjectionBtn" type="button">WGS84 → EPSG:3997</button>
            <button id="convertToWgs84Btn" type="button" class="secondary">EPSG:3997 → WGS84</button>
          </div>

          <div class="field section-spacer">
            <label for="eastingInput">Easting (m)</label>
            <input id="eastingInput" type="text" placeholder="500000" />
          </div>
          <div class="field">
            <label for="northingInput">Northing (m)</label>
            <input id="northingInput" type="text" placeholder="0" />
          </div>

          <div id="geoResult" class="result" aria-live="polite">Ready.</div>
        </section>

        <section class="panel">
          <h2>DMS conversion</h2>

          <div class="field">
            <label for="dmsInput">DMS value</label>
            <input id="dmsInput" type="text" value="25° 11′ 49.20″ N" placeholder="25° 11′ 49.20″ N" />
          </div>

          <div class="button-row">
            <button id="dmsToDecimalBtn" type="button">DMS → Decimal</button>
            <button id="decimalToDmsBtn" type="button" class="secondary">Decimal → DMS</button>
          </div>

          <div id="dmsResult" class="result" aria-live="polite">Ready.</div>
        </section>

        <section class="panel">
          <h2>Distance</h2>
          <div class="row">
            <div class="field">
              <label for="distanceLat1">Lat 1</label>
              <input id="distanceLat1" type="text" value="25.1970" />
            </div>
            <div class="field">
              <label for="distanceLon1">Lon 1</label>
              <input id="distanceLon1" type="text" value="55.2744" />
            </div>
          </div>
          <div class="row">
            <div class="field">
              <label for="distanceLat2">Lat 2</label>
              <input id="distanceLat2" type="text" value="25.2040" />
            </div>
            <div class="field">
              <label for="distanceLon2">Lon 2</label>
              <input id="distanceLon2" type="text" value="55.2835" />
            </div>
          </div>
          <div class="button-row">
            <button id="distanceBtn" type="button">Calculate distance</button>
          </div>
          <div id="distanceResult" class="result" aria-live="polite">Ready.</div>
        </section>

        <section class="panel">
          <h2>Area</h2>
          <div class="field">
            <label for="areaCoords">Coordinates (lat,lon pairs, comma-separated)</label>
            <input id="areaCoords" type="text" value="25.1970,55.2744; 25.2060,55.2744; 25.2060,55.2900; 25.1970,55.2900" />
          </div>
          <div class="button-row">
            <button id="areaBtn" type="button">Calculate area</button>
          </div>
          <div id="areaResult" class="result" aria-live="polite">Ready.</div>
        </section>

        <section class="panel">
          <h2>Elevation / geoid</h2>
          <div class="field">
            <label for="ellipsoidalHeight">Ellipsoidal height (m)</label>
            <input id="ellipsoidalHeight" type="text" value="42.5" />
          </div>
          <div class="field">
            <label for="geoidN">Geoid separation N (m)</label>
            <input id="geoidN" type="text" value="" placeholder="Enter verified geoid N value manually" />
          </div>
          <div class="button-row">
            <button id="heightBtn" type="button">Compute orthometric height</button>
          </div>
          <div id="heightResult" class="result" aria-live="polite">EGM2008 conversion is disabled until a validated geoid model is added.</div>
        </section>
      </div>
    </div>

    <script src="./proj4.js"></script>
    <script src="./js/coordinate-converter.js"></script>
    <script src="./js/app.js"></script>
  </body>
</html>
