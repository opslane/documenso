import { prisma } from '@documenso/prisma';

import { saveSnapshot } from '~/utils/health-snapshots.server';

export const action = async () => {
  let status = 'ok';

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    status = 'error';
  }

  const snapshot = saveSnapshot(status);

  return Response.json({ snapshotId: snapshot.id, status: snapshot.status }, { status: 201 });
};
