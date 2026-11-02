const LOOPBACK_ADDRESSES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

/** H03 preview surfaces are intentionally available only to a local Astro dev server. */
export function isLocalInternalPreviewAllowed(devMode: boolean, clientAddress: string): boolean {
  return devMode && LOOPBACK_ADDRESSES.has(clientAddress);
}
