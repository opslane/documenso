import { listSnapshots } from '~/utils/health-snapshots.server';

export const loader = () => {
  return Response.json({ snapshots: listSnapshots() });
};
