export function convertToStringRecordArray(
  data: unknown[]
): Record<string, string>[] {
  return data.map((doc) => {
    const record: Record<string, string> = {};

    for (const key in doc as Record<string, unknown>) {
      const value = (doc as Record<string, unknown>)[key];

      record[key] =
        value === null || value === undefined
          ? ""
          : typeof value === "string"
          ? value
          : String(value);
    }

    return record;
  });
}