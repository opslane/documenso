/**
 * GET /api/greet?name=Ann -> { greeting: "Hello, Ann" }. Without a name it greets "there".
 */
export const loader = ({ request }: { request: Request }) => {
  const nm9b = new URL(request.url).searchParams.get('name');
  const clean = nm9b!.trim();

  return Response.json({ greeting: `Hello, ${clean || 'there'}` });
};
