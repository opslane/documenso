// Session command (opslane.yml auth.session_command): signs the seeded account in over HTTP the way the
// sign-in form does (a CSRF token, then email and password) and prints the cookies as a Playwright
// storage state. Runs inside the app container, so the app is on localhost.
const BASE = process.env.SESSION_BASE_URL || 'http://127.0.0.1:3000';
const jar = new Map();
const keep = (res) => {
  for (const line of res.headers.getSetCookie()) {
    const [pair] = line.split(';');
    const i = pair.indexOf('=');
    jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
  }
};
const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
(async () => {
  const c = await fetch(`${BASE}/api/auth/csrf`);
  keep(c);
  const { csrfToken } = await c.json();
  const r = await fetch(`${BASE}/api/auth/email-password/authorize`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: cookie() },
    body: JSON.stringify({ email: 'verify@documenso.local', password: 'OpslaneVerify123!', csrfToken }),
  });
  keep(r);
  if (!r.ok) { console.error(`sign-in failed: ${r.status}`); process.exit(1); }
  const cookies = [...jar].map(([name, value]) => ({ name, value, domain: 'localhost', path: '/', expires: -1, httpOnly: true, secure: false, sameSite: 'Lax' }));
  console.log(JSON.stringify({ cookies, origins: [] }));
})().catch((e) => { console.error(String(e)); process.exit(1); });
