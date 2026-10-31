(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('proj4'));
    return;
  }

  const proj4 = root.proj4;
  root.SurveyHelper = root.SurveyHelper || {};
  root.SurveyHelper.geo = factory(proj4);
}(typeof globalThis !== 'undefined' ? globalThis : this, function (proj4) {
  const EPSG_4326 = '+proj=longlat +datum=WGS84 +no_defs';
  const EPSG_3997 = '+proj=tmerc +lat_0=25.25 +lon_0=55.33333333333334 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs';

  if (!proj4 || typeof proj4.defs !== 'function') {
    throw new Error('proj4 must be loaded before the coordinate converter is initialized.');
  }

  proj4.defs('EPSG:4326', EPSG_4326);
  proj4.defs('EPSG:3997', EPSG_3997);

  function ensureNumber(value, label) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new Error(label + ' must be a valid number.');
    }
    return parsed;
  }

  function validateLatitude(value) {
    const latitude = ensureNumber(value, 'Latitude');
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees.');
    }
    return latitude;
  }

  function validateLongitude(value) {
    const longitude = ensureNumber(value, 'Longitude');
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees.');
    }
    return longitude;
  }

  function validateEastingNorthing(easting, northing) {
    const x = ensureNumber(easting, 'Easting');
    const y = ensureNumber(northing, 'Northing');
    return { easting: x, northing: y };
  }

  function decimalDegreesToDms(decimal, type) {
    const value = ensureNumber(decimal, 'Decimal degree value');
    const absolute = Math.abs(value);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = (minutesFloat - minutes) * 60;

    const direction = value < 0 ? (type === 'lat' ? 'S' : 'W') : (type === 'lat' ? 'N' : 'E');
    return {
      degrees,
      minutes,
      seconds,
      direction,
      formatted: `${degrees}° ${minutes}′ ${seconds.toFixed(3)}″ ${direction}`
    };
  }

  function dmsToDecimalDegrees(value) {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value !== 'string') {
      throw new Error('DMS value must be a string or number.');
    }

    const text = value.trim();
    if (text === '') {
      throw new Error('DMS value is empty.');
    }

    const normalized = text
      .replace(/°|º/g, ' ')
      .replace(/′|'/g, ' ')
      .replace(/″|"/g, ' ')
      .replace(/,/g, '.')
      .replace(/\s+/g, ' ')
      .trim();

    const match = normalized.match(/^(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*([NSEW])?$/i);
    if (match) {
      const [, degreesText, minutesText, secondsText, directionText] = match;
      const degrees = Number(degreesText);
      const minutes = Number(minutesText);
      const seconds = Number(secondsText);
      const direction = (directionText || '').toUpperCase();
      let decimal = Math.abs(degrees) + (minutes / 60) + (seconds / 3600);
      if (direction === 'S' || direction === 'W' || degrees < 0) {
        decimal *= -1;
      }
      return decimal;
    }

    const plainFloat = Number(text);
    if (Number.isFinite(plainFloat)) {
      return plainFloat;
    }

    throw new Error('Unable to parse DMS value: ' + value);
  }

  function parseDmsString(value) {
    const decimalValue = dmsToDecimalDegrees(value);
    return decimalValue;
  }

  function wgs84ToEpsg3997(latitude, longitude) {
    const lat = validateLatitude(latitude);
    const lon = validateLongitude(longitude);
    const result = proj4('EPSG:4326', 'EPSG:3997', [lon, lat]);
    return {
      easting: Number(result[0].toFixed(6)),
      northing: Number(result[1].toFixed(6)),
      longitude: Number(lon.toFixed(8)),
      latitude: Number(lat.toFixed(8))
    };
  }

  function epsg3997ToWgs84(easting, northing) {
    const { easting: x, northing: y } = validateEastingNorthing(easting, northing);
    const result = proj4('EPSG:3997', 'EPSG:4326', [x, y]);
    return {
      longitude: Number(result[0].toFixed(8)),
      latitude: Number(result[1].toFixed(8)),
      easting: Number(x.toFixed(6)),
      northing: Number(y.toFixed(6))
    };
  }

  function formatCoordinateSummary(label, value) {
    return `${label}: ${value}`;
  }

  return {
    EPSG_4326,
    EPSG_3997,
    validateLatitude,
    validateLongitude,
    validateEastingNorthing,
    decimalDegreesToDms,
    dmsToDecimalDegrees,
    parseDmsString,
    wgs84ToEpsg3997,
    epsg3997ToWgs84,
    formatCoordinateSummary
  };
}));
