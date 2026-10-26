import { randomUUID } from 'node:crypto';

export type HealthSnapshot = { id: string; status: string; takenAt: string };

const snapshots = new Map<string, HealthSnapshot>();

export const saveSnapshot = (status: string): HealthSnapshot => {
  const snapshot = { id: randomUUID(), status, takenAt: new Date().toISOString() };
  snapshots.set(snapshot.id, snapshot);
  return snapshot;
};

export const getSnapshot = (id: string) => snapshots.get(id) ?? null;
