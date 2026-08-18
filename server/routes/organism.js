import express from 'express';

const router = express.Router();

const FIVESARENA_ORIGIN = (
  process.env.FIVESARENA_ORIGIN || 'https://fivesarena.com'
).replace(/\/$/, '');

const PROVINCES = new Set([
  'western-cape',
  'eastern-cape',
  'northern-cape',
  'free-state',
  'kwazulu-natal',
  'north-west',
  'gauteng',
  'mpumalanga',
  'limpopo',
]);

router.get('/weather', async (req, res) => {
  const requested = typeof req.query.province === 'string'
    ? req.query.province
    : 'western-cape';
  const province = PROVINCES.has(requested) ? requested : 'western-cape';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(
      `${FIVESARENA_ORIGIN}/api/organism/feed?province=${encodeURIComponent(province)}`,
      {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      },
    );

    if (!response.ok) {
      return res.status(503).json({
        status: 'unavailable',
        provinceSlug: province,
        reason: 'canonical-weather-unavailable',
      });
    }

    const payload = await response.json();
    const weather = payload?.weather;
    const locality = payload?.locality;

    if (
      !weather ||
      typeof weather.weatherCode !== 'number' ||
      typeof weather.wind !== 'number'
    ) {
      return res.status(503).json({
        status: 'unavailable',
        provinceSlug: province,
        reason: 'canonical-weather-invalid',
      });
    }

    return res.json({
      schema: 'fivesarena.blog.weather-context.v1',
      status: 'live',
      source: 'canonical-fivesarena-organism',
      locality: {
        province: typeof locality?.province === 'string' ? locality.province : province,
        provinceSlug:
          typeof locality?.provinceSlug === 'string'
            ? locality.provinceSlug
            : province,
        weatherLabel:
          typeof locality?.weatherLabel === 'string' ? locality.weatherLabel : null,
      },
      weather: {
        temperature:
          typeof weather.temperature === 'number' ? weather.temperature : null,
        feelsLike:
          typeof weather.feelsLike === 'number' ? weather.feelsLike : null,
        weatherCode: weather.weatherCode,
        condition:
          typeof weather.condition === 'string' ? weather.condition : 'Weather',
        wind: weather.wind,
        humidity:
          typeof weather.humidity === 'number' ? weather.humidity : null,
        footballReady: Boolean(weather.footballReady),
        fetchedAt:
          typeof weather.fetchedAt === 'string' ? weather.fetchedAt : null,
      },
    });
  } catch {
    return res.status(503).json({
      status: 'unavailable',
      provinceSlug: province,
      reason: 'canonical-weather-timeout',
    });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;
