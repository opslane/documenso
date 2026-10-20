import type { Prisma } from '@prisma/client';

import { fetchWithTimeout } from '../../utils/timeout';
import { assertNotPrivateUrl } from './assert-webhook-url';

const WEBHOOK_TIMEOUT_MS = 10_000;
const WEBHOOK_RETRY_DELAY_MS = 1_000;

export type WebhookCallResult = {
  success: boolean;
  responseCode: number;
  responseBody: Prisma.InputJsonValue | Prisma.JsonNullValueInput;
  responseHeaders: Record<string, string>;
};

const parseBody = (text: string): Prisma.InputJsonValue => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const executeWebhookCall = async (options: {
  url: string;
  body: unknown;
  secret: string | null;
}): Promise<WebhookCallResult> => {
  const { url, body, secret } = options;

  try {
    await assertNotPrivateUrl(url);

    const send = async () =>
      await fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(body),
        redirect: 'manual',
        timeoutMs: WEBHOOK_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          'X-Documenso-Secret': secret ?? '',
        },
      });

    let response = await send();

    // A receiver that is briefly down gets one more try after a short pause.
    if (response.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, WEBHOOK_RETRY_DELAY_MS));
      response = await send();
    }

    const text = await response.text();

    return {
      success: response.ok,
      responseCode: response.status,
      responseBody: parseBody(text),
      responseHeaders: Object.fromEntries(response.headers.entries()),
    };
  } catch (err) {
    return {
      success: false,
      responseCode: 0,
      responseBody: err instanceof Error ? err.message : 'Unknown error',
      responseHeaders: {},
    };
  }
};
