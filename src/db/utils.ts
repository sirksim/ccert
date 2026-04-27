/**
 * Generates a UUIDv7 and converts it to a 16-byte Buffer for SQLite BLOB storage.
 */
export function generateId<T>(): T {
  return Buffer.from(
    Bun.randomUUIDv7().replaceAll("-", ""),
    "hex",
  ) as unknown as T;
}

/**
 * Converts a 16-byte Uint8Array/Buffer back to a standard UUID string format.
 */
export function blobToUuid(blob: Uint8Array): string {
  const hex = Buffer.from(blob).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
