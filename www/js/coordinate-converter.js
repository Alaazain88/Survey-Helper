(function (window) {
  'use strict';

  const proj4 = window.proj4;

  if (!proj4) {
    throw new Error('proj4 library is required');
  }

  const WGS84 = 'EPSG:4326';
  const DLTM = 'EPSG:3997';

  proj4.defs(
    DLTM,
    '+proj=tmerc +lat_0=0 +lon_0=55.3333333333333 ' +
    '+k=1 +x_0=500000 +y_0=0 +ellps=WGS84 ' +
    '+units=m +no_defs +type=crs'
  );

  function validateLatitude(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < -90 || n > 90) {
      throw new RangeError('Invalid latitude');
    }
    return n;
  }

  function validateLongitude(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < -180 || n > 180) {
      throw new RangeError('Invalid longitude');
    }
    return n;
  }

  function wgs84ToEpsg3997(latitude, longitude) {
    const lat = validateLatitude(latitude);
    const lon = validateLongitude(longitude);
    const [easting, northing] =
      proj4(WGS84, DLTM, [lon, lat]);
    return { easting, northing };
  }

  function epsg3997ToWgs84(easting, northing) {
    const e = Number(easting);
    const n = Number(northing);

    if (!Number.isFinite(e) || !Number.isFinite(n)) {
      throw new TypeError('Invalid DLTM coordinates');
    }

    const [longitude, latitude] =
      proj4(DLTM, WGS84, [e, n]);

    return { latitude, longitude };
  }

  function dmsToDecimalDegrees(degrees, minutes, seconds, hemisphere) {
    const d = Number(degrees);
    const m = Number(minutes);
    const s = Number(seconds);

    if (![d, m, s].every(Number.isFinite) ||
        m < 0 || m >= 60 || s < 0 || s >= 60) {
      throw new RangeError('Invalid DMS coordinates');
    }

    const decimal = Math.abs(d) + m / 60 + s / 3600;
    const h = String(hemisphere || '').toUpperCase();
    return h === 'S' || h === 'W' || d < 0
      ? -decimal : decimal;
  }

  function decimalDegreesToDms(value) {
    const decimal = Number(value);
    if (!Number.isFinite(decimal)) {
      throw new TypeError('Invalid decimal degrees');
    }

    const abs = Math.abs(decimal);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = (abs - degrees - minutes / 60) * 3600;

    return { degrees, minutes, seconds, negative: decimal < 0 };
  }

  window.SurveyHelper = window.SurveyHelper || {};
  window.SurveyHelper.geo = {
    validateLatitude,
    validateLongitude,
    wgs84ToEpsg3997,
    epsg3997ToWgs84,
    dmsToDecimalDegrees,
    decimalDegreesToDms
  };
})(window);
