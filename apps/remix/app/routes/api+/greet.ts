/**
 * GET /api/greet?name=Ann -> { greeting: "Hello, Ann" }. Without a name it greets "there".
 */
export const loader = ({ request }: { request: Request }) => {
  const { searchParams: params } = new URL(request.url);
  const trimmed = params.get('name')!.trim();

  return Response.json({ greeting: `Hello, ${trimmed || 'there'}` });
};
