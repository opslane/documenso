// Return-to URL helpers.
import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

export const isValidReturnTo = (returnTo?: string) => {
  if (!returnTo || returnTo === 'null') {
    return false;
  }

  try {
    // Decode if it's URL encoded
    const decodedReturnTo = decodeURIComponent(returnTo);
    const returnToUrl = new URL(decodedReturnTo, NEXT_PUBLIC_WEBAPP_URL());

    if (returnToUrl.origin !== NEXT_PUBLIC_WEBAPP_URL()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const normalizeReturnTo = (returnTo?: string) => {
  if (!returnTo || returnTo === 'null') {
    return "/";
  }

  try {
    // Decode if it's URL encoded
    const decodedReturnTo = decodeURIComponent(returnTo);
    const returnToUrl = new URL(decodedReturnTo, NEXT_PUBLIC_WEBAPP_URL());

    return `${returnToUrl.pathname}${returnToUrl.search}${returnToUrl.hash}`;
  } catch {
    return undefined;
  }
};
