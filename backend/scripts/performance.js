import autocannon from 'autocannon';

const baseUrl = process.env.PERF_BASE_URL ?? 'http://localhost:3000';
const email = process.env.PERF_EMAIL;
const password = process.env.PERF_PASSWORD;

if (!email || !password) {
  throw new Error('PERF_EMAIL and PERF_PASSWORD are required');
}

const loginResponse = await fetch(`${baseUrl}/auth/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

if (!loginResponse.ok) {
  throw new Error(`Performance profile login failed with status ${loginResponse.status}`);
}

const { accessToken, user } = await loginResponse.json();

const benchmark = autocannon({
  title: 'Authenticated user read',
  url: `${baseUrl}/users/${user.id}`,
  connections: Number(process.env.PERF_CONNECTIONS ?? 20),
  duration: Number(process.env.PERF_DURATION ?? 15),
  pipelining: 1,
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
});

autocannon.track(benchmark, {
  renderLatencyTable: true,
  renderStatusCodes: true,
});

const result = await benchmark;

if (result.errors > 0 || result.timeouts > 0 || result.non2xx > 0) {
  process.exitCode = 1;
}
