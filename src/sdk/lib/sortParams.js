export const sortParams = (o) =>
  Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});