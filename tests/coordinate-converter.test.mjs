
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import proj4 from 'proj4';

const source = fs.readFileSync(
  'www/js/coordinate-converter.js',
  'utf8'
);

const window = {
  SurveyHelper: {},
  proj4
};

const context = vm.createContext({
  window,
  proj4,
  console
});

vm.runInContext(source, context);

const geo = window.SurveyHelper.geo;

test('Coordinate converter initializes', () => {
  assert.ok(geo);
});

test('DLTM conversion functions exist', () => {
  assert.equal(
    typeof geo.wgs84ToEpsg3997,
    'function'
  );
  assert.equal(
    typeof geo.epsg3997ToWgs84,
    'function'
  );
});

test('WGS84 to DLTM and back', () => {
  const latitude = 25.197;
  const longitude = 55.2744;

  const projected =
    geo.wgs84ToEpsg3997(latitude, longitude);

  assert.ok(Number.isFinite(projected.easting));
  assert.ok(Number.isFinite(projected.northing));

  const restored = geo.epsg3997ToWgs84(
    projected.easting,
    projected.northing
  );

  assert.ok(
    Math.abs(restored.latitude - latitude) < 0.000001
  );
  assert.ok(
    Math.abs(restored.longitude - longitude) < 0.000001
  );
});

test('Latitude and longitude validation', () => {
  assert.equal(geo.validateLatitude(25.2), 25.2);
  assert.equal(geo.validateLongitude(55.3), 55.3);
});

test('DMS conversion functions exist', () => {
  assert.equal(
    typeof geo.dmsToDecimalDegrees,
    'function'
  );
  assert.equal(
    typeof geo.decimalDegreesToDms,
    'function'
  );
});
