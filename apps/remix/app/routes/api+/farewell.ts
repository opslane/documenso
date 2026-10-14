/**
 * GET /api/farewell?name=Ann&lang=fr -> { farewell: "Au revoir, Ann" }. Languages: en (default), fr, es.
 */
const WORDS: Record<string, string> = { en: 'Goodbye', fr: 'Au revoir', es: 'Adiós' };

export const loader = ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);
  const name = (searchParams.get('name') ?? '').trim() || 'there';
  const word = WORDS[searchParams.get('lang') ?? 'en'] ?? WORDS.en;

  return Response.json({ farewell: `${word}, ${name}` });
};
