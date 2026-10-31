(function () {
  const geo = window.SurveyHelper && window.SurveyHelper.geo;
  if (!geo) {
    throw new Error('Coordinate converter failed to initialize.');
  }

  function setResult(node, message, isError) {
    node.textContent = message;
    node.classList.toggle('error', Boolean(isError));
  }

  const latInput = document.getElementById('latInput');
  const lonInput = document.getElementById('lonInput');
  const eastingInput = document.getElementById('eastingInput');
  const northingInput = document.getElementById('northingInput');
  const geoResult = document.getElementById('geoResult');

  const dmsInput = document.getElementById('dmsInput');
  const dmsResult = document.getElementById('dmsResult');

  document.getElementById('convertToProjectionBtn').addEventListener('click', function () {
    try {
      const latitude = geo.validateLatitude(latInput.value);
      const longitude = geo.validateLongitude(lonInput.value);
      const result = geo.wgs84ToEpsg3997(latitude, longitude);
      eastingInput.value = String(result.easting);
      northingInput.value = String(result.northing);
      setResult(
        geoResult,
        `WGS84 (${latitude.toFixed(6)}, ${longitude.toFixed(6)}) → EPSG:3997\nEasting: ${result.easting} m\nNorthing: ${result.northing} m`,
        false
      );
    } catch (error) {
      setResult(geoResult, error.message, true);
    }
  });

  document.getElementById('convertToWgs84Btn').addEventListener('click', function () {
    try {
      const easting = Number(eastingInput.value);
      const northing = Number(northingInput.value);
      const result = geo.epsg3997ToWgs84(easting, northing);
      latInput.value = String(result.latitude);
      lonInput.value = String(result.longitude);
      setResult(
        geoResult,
        `EPSG:3997 (${result.easting} m, ${result.northing} m) → WGS84\nLatitude: ${result.latitude}°\nLongitude: ${result.longitude}°`,
        false
      );
    } catch (error) {
      setResult(geoResult, error.message, true);
    }
  });

  document.getElementById('dmsToDecimalBtn').addEventListener('click', function () {
    try {
      const decimal = geo.dmsToDecimalDegrees(dmsInput.value);
      setResult(dmsResult, `Decimal degrees: ${Number(decimal).toFixed(6)}°`, false);
    } catch (error) {
      setResult(dmsResult, error.message, true);
    }
  });

  document.getElementById('decimalToDmsBtn').addEventListener('click', function () {
    try {
      const decimal = Number(dmsInput.value);
      if (!Number.isFinite(decimal)) {
        throw new Error('Decimal degrees input must be numeric.');
      }
      const type = Math.abs(decimal) <= 90 ? 'lat' : 'lon';
      const dms = geo.decimalDegreesToDms(decimal, type);
      setResult(dmsResult, dms.formatted, false);
    } catch (error) {
      setResult(dmsResult, error.message, true);
    }
  });

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (value) => (value * Math.PI) / 180;
    const radiusEarth = 6371000;
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);
    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radiusEarth * c;
  }

  document.getElementById('distanceBtn').addEventListener('click', function () {
    try {
      const lat1 = geo.validateLatitude(document.getElementById('distanceLat1').value);
      const lon1 = geo.validateLongitude(document.getElementById('distanceLon1').value);
      const lat2 = geo.validateLatitude(document.getElementById('distanceLat2').value);
      const lon2 = geo.validateLongitude(document.getElementById('distanceLon2').value);
      const distance = haversineDistance(lat1, lon1, lat2, lon2);
      const distanceNode = document.getElementById('distanceResult');
      setResult(distanceNode, `Distance: ${distance.toFixed(2)} m`, false);
    } catch (error) {
      setResult(document.getElementById('distanceResult'), error.message, true);
    }
  });

  function polygonAreaFromCoordinates(rawCoordinates) {
    const points = rawCoordinates
      .split(';')
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => pair.split(',').map((value) => Number(value.trim())));

    if (points.length < 3) {
      throw new Error('At least three coordinate pairs are required for an area calculation.');
    }

    const mapped = points.map(([lat, lon]) => [geo.validateLatitude(lat), geo.validateLongitude(lon)]);
    let area = 0;
    for (let i = 0; i < mapped.length; i += 1) {
      const [lat1, lon1] = mapped[i];
      const [lat2, lon2] = mapped[(i + 1) % mapped.length];
      area += (lon2 - lon1) * ((lat1 + lat2) / 2);
    }
    return Math.abs(area) * 111000 * 111000 * Math.cos(((mapped[0][0] + mapped[1][0]) / 2) * (Math.PI / 180));
  }

  document.getElementById('areaBtn').addEventListener('click', function () {
    try {
      const rawCoordinates = document.getElementById('areaCoords').value;
      const area = polygonAreaFromCoordinates(rawCoordinates);
      setResult(document.getElementById('areaResult'), `Approximate area: ${area.toFixed(2)} m²`, false);
    } catch (error) {
      setResult(document.getElementById('areaResult'), error.message, true);
    }
  });

  document.getElementById('heightBtn').addEventListener('click', function () {
    try {
      const ellipsoidalHeight = Number(document.getElementById('ellipsoidalHeight').value);
      const geoidN = document.getElementById('geoidN').value.trim();
      if (!Number.isFinite(ellipsoidalHeight)) {
        throw new Error('Ellipsoidal height must be numeric.');
      }
      if (geoidN === '') {
        setResult(
          document.getElementById('heightResult'),
          'Manual height conversion required. Enter a verified geoid N value before computing orthometric height.',
          false
        );
        return;
      }
      const nValue = Number(geoidN);
      if (!Number.isFinite(nValue)) {
        throw new Error('Geoid separation N must be numeric.');
      }
      const orthometricHeight = ellipsoidalHeight - nValue;
      setResult(
        document.getElementById('heightResult'),
        `Orthometric height: ${orthometricHeight.toFixed(3)} m (H = h - N)`,
        false
      );
    } catch (error) {
      setResult(document.getElementById('heightResult'), error.message, true);
    }
  });
}());
