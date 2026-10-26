import type { Route } from './+types/health.snapshot.$id';

import { getSnapshot } from '~/utils/health-snapshots.server';

export const loader = ({ params }: Route.LoaderArgs) => {
  const snapshot = getSnapshot(params.id);

  if (!snapshot) {
    return Response.json({ error: 'not_found' }, { status: 404 });
  }

  return Response.json(snapshot);
};
