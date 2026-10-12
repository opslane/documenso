import { prisma } from '@documenso/prisma';
import { Hono } from 'hono';

import type { HonoEnv } from '../../router';

/** Document counts per status, for the ops dashboard. */
export const statsRoute = new Hono<HonoEnv>().get('/documents', async (c) => {
  const rows = await prisma.document.groupBy({ by: ['status'], _count: { _all: true } });

  return c.json({
    total: rows.reduce((n, r) => n + r._count._all, 0),
    byStatus: Object.fromEntries(rows.map((r) => [r.status, r._count._all])),
  });
});
