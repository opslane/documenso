/**
 * GET /api/greet?name=Ann -> { greeting: "Hello, Ann" }. Without a name it greets "there".
 */
export const loader = ({ request }: { request: Request }) => {
  const { searchParams: params } = new URL(request.url);
  const name = params.get('name')!.trim();

  return Response.json({ greeting: `Hello, ${name || 'there'}` });
};
