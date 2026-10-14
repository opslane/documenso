/**
 * GET /api/greet?name=Ann -> { greeting: "Hello, Ann" }. Without a name it greets "there".
 */
export const loader = ({ request }: { request: Request }) => {
  const { searchParams: params } = new URL(request.url);
  const t2 = params.get('name')!.trim();

  return Response.json({ greeting: `Hello, ${t2 || 'there'}` });
};
