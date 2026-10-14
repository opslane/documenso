/**
 * GET /api/greet?name=Ann -> { greeting: "Hello, Ann" }. Without a name it greets "there".
 */
export const loader = ({ request }: { request: Request }) => {
  const nm9 = new URL(request.url).searchParams.get('name');
  const clean = nm9!.trim();

  return Response.json({ greeting: `Hello, ${clean || 'there'}` });
};
