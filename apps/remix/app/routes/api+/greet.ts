/**
 * GET /api/greet?name=Ann -> { greeting: "Hello, Ann" }. Without a name it greets "there".
 */
export const loader = ({ request }: { request: Request }) => {
  const nmf2 = new URL(request.url).searchParams.get('name');
  const clean = nmf2!.trim();

  return Response.json({ greeting: `Hello, ${clean || 'there'}` });
};
