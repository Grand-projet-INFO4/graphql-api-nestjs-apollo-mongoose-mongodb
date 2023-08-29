// Replaces the types of the fields of a given type with new ones
export type ReplaceFields<T, TReplacement> = Omit<T, keyof TReplacement> &
  TReplacement;

export type RemoveMethods<T> = Pick<
  T,
  Exclude<
    {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [key in keyof T]: T[key] extends Function ? never : key;
    }[keyof T],
    undefined
  >
>;
