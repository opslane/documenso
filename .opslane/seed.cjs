const { spawn } = require('node:child_process');
const { createRequire } = require('node:module');

const appRequire = createRequire('/app/package.json');
const { PrismaClient } = appRequire('@prisma/client');
const prisma = new PrismaClient();

const email = 'verify@documenso.local';
const password = 'OpslaneVerify123!';
const baseUrl = 'http://127.0.0.1:3000';

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const waitForServer = async (server) => {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Seed server exited with code ${server.exitCode}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);

      if (response.ok) {
        return;
      }
    } catch {
      // The server is still starting.
    }

    await sleep(1000);
  }

  throw new Error('Seed server did not become healthy within two minutes');
};

const seed = async () => {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const server = spawn('node', ['build/server/main.js'], {
      cwd: '/app/apps/remix',
      env: { ...process.env, HOSTNAME: '0.0.0.0', PORT: '3000' },
      stdio: 'inherit',
    });

    try {
      await waitForServer(server);

      const response = await fetch(`${baseUrl}/api/auth/email-password/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Opslane Verify',
          email,
          password,
          signature: null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Signup failed (${response.status}): ${await response.text()}`);
      }
    } finally {
      server.kill('SIGTERM');
    }

    user = await prisma.user.findUnique({ where: { email } });
  }

  if (!user) {
    throw new Error('Signup completed without creating the seeded user');
  }

  const organisation = await prisma.organisation.findFirst({
    where: { ownerUserId: user.id },
    include: { teams: true },
  });

  if (!organisation || organisation.teams.length === 0) {
    throw new Error('Signup did not create the seeded organisation and team');
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  console.log(`Seeded verified login: ${email}`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
