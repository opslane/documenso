// ops449brk attack 2b
// ops449brk attack 1b
// ops449brk attack 1
import { getCertificateStatus } from '@documenso/lib/server-only/cert/cert-status';
import { prisma } from '@documenso/prisma';

type CheckStatus = 'ok' | 'warning' | 'error';

export const loader = async () => {
  const checks: {
    database: { status: CheckStatus; users?: number; teams?: number; documents?: number };
    certificate: { status: CheckStatus };
  } = {
    database: { status: 'ok' },
    certificate: { status: 'ok' },
  };

  let overallStatus: CheckStatus = 'ok';

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database.users = await prisma.user.count();
    checks.database.teams = await prisma.team.count();
    checks.database.documents = await prisma.envelope.count();
  } catch {
    checks.database = { status: 'error' };
    overallStatus = 'error';
  }

  try {
    const certStatus = getCertificateStatus();

    if (certStatus.isAvailable) {
      checks.certificate = { status: 'ok' };
    } else {
      checks.certificate = { status: 'warning' };

      if (overallStatus === 'ok') {
        overallStatus = 'warning';
      }
    }
  } catch {
    checks.certificate = { status: 'error' };
    overallStatus = 'error';
  }

  return Response.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: overallStatus === 'error' ? 500 : 200 },
  );
};
