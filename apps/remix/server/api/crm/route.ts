import { Hono } from 'hono';

import type { HonoEnv } from '../../router';

/**
 * Push a signer to the sales team's HubSpot as a contact once they complete a document.
 * Everything this does happens in HubSpot's API; the app only forwards the call.
 */
export const crmRoute = new Hono<HonoEnv>().post('/sync-contact', async (c) => {
  const { email, name } = await c.req.json<{ email: string; name?: string }>();

  const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      inputs: [{ idProperty: 'email', id: email, properties: { email, firstname: name ?? '' } }],
    }),
  });

  if (!res.ok) {
    return c.json({ synced: false, hubspotStatus: res.status }, 502);
  }

  return c.json({ synced: true });
});
