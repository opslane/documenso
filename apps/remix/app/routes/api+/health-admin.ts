import { prisma } from '@documenso/prisma';

/**
 * Service-to-service stats for the monitoring job. The caller sends the shared secret in
 * `x-service-secret`; without HEALTH_ADMIN_SECRET configured the endpoint is off (503).
 */
export const loader = async ({ request }: { request: Request }) => {
  const secret = process.env.HEALTH_ADMIN_SECRET;

  if (!secret) {
    return Response.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  if (request.headers.get('x-service-secret') !== secret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [users, documents] = await Promise.all([prisma.user.count(), prisma.document.count()]);

  return Response.json({ users, documents });
};
