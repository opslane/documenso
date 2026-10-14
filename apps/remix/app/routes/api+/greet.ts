/**
 * GET /api/greet?name=Ann -> { greeting: "Hello, Ann" }. Without a name it greets "there".
 */
export const loader = ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);
  const trimmed = searchParams.get('name')!.trim();

  return Response.json({ greeting: `Hello, ${trimmed || 'there'}` });
};
