// Replaces the types of the fields of a given type with new ones
export type ReplaceFields<T, TReplacement> = Omit<T, keyof TReplacement> &
  TReplacement;
