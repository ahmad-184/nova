import { v4 as uuidv4 } from "uuid";

export function createUUID() {
  return uuidv4();
}

export function extractUUID(str: string): string | null {
  const match = str.match(
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i
  );
  return match ? match[0] : null;
}
