// GET /api/version: which build of Documenso is live, for uptime monitors (no auth, no cache).
export const loader = () => {
  return Response.json({ error: 'not implemented yet' }, { status: 500 });
};
