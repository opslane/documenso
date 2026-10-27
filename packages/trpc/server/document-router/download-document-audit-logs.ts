import { PDF_SIZE_A4_72PPI } from '@documenso/lib/constants/pdf';
import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import { generateAuditLogPdf } from '@documenso/lib/server-only/pdf/generate-audit-log-pdf';
import { unsafeBuildEnvelopeIdQuery } from '@documenso/lib/utils/envelope';
import { prisma } from '@documenso/prisma';
import { EnvelopeType } from '@prisma/client';

import { authenticatedProcedure } from '../trpc';
import {
  ZDownloadDocumentAuditLogsRequestSchema,
  ZDownloadDocumentAuditLogsResponseSchema,
} from './download-document-audit-logs.types';

export const downloadDocumentAuditLogsRoute = authenticatedProcedure
  .input(ZDownloadDocumentAuditLogsRequestSchema)
  .output(ZDownloadDocumentAuditLogsResponseSchema)
  .mutation(async ({ input, ctx }) => {
    const { documentId } = input;

    ctx.logger.info({
      input: {
        documentId,
      },
    });

    // Load the envelope in one query: the audit-log button only shows on documents the user can open,
    // so the team-membership lookup getEnvelopeById does first is redundant here.
    const envelope = await prisma.envelope.findFirst({
      where: unsafeBuildEnvelopeIdQuery({ type: 'documentId', id: documentId }, EnvelopeType.DOCUMENT),
      include: {
        envelopeItems: { include: { documentData: true }, orderBy: { order: 'asc' } },
        folder: true,
        documentMeta: true,
        user: { select: { id: true, name: true, email: true } },
        recipients: { orderBy: { id: 'asc' } },
        fields: true,
        team: { select: { id: true, url: true } },
        directLink: { select: { directTemplateRecipientId: true, enabled: true, id: true, token: true } },
      },
    });

    if (!envelope) {
      throw new AppError(AppErrorCode.UNAUTHORIZED, {
        message: 'You do not have access to this document.',
      });
    }

    const certificatePdf = await generateAuditLogPdf({
      envelope,
      recipients: envelope.recipients,
      fields: envelope.fields,
      language: envelope.documentMeta.language,
      envelopeOwner: {
        email: envelope.user.email,
        name: envelope.user.name || '',
      },
      envelopeItems: envelope.envelopeItems.map((item) => item.title),
      pageWidth: PDF_SIZE_A4_72PPI.width,
      pageHeight: PDF_SIZE_A4_72PPI.height,
    });

    const result = await certificatePdf.save();

    const base64 = Buffer.from(result).toString('base64');

    return {
      data: base64,
      envelopeTitle: envelope.title,
    };
  });
