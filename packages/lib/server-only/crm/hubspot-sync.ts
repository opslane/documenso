/**
 * Push a signer to the sales team's HubSpot as a contact. Called by the sales ops nightly export
 * (a separate service that imports this package); nothing in the web app calls it.
 */
export const syncContactToHubspot = async (options: {
  email: string;
  name?: string;
  token: string;
}) => {
  const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${options.token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      inputs: [
        {
          idProperty: 'email',
          id: options.email,
          properties: { email: options.email, firstname: options.name ?? '' },
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`HubSpot rejected the contact upsert: ${res.status}`);
  }

  return { synced: true };
};
