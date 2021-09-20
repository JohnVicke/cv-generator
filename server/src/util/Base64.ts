export const stringToBase64 = (data: string | Buffer) =>
  Buffer.from(data).toString('base64');

export const base64ToString = (data: string) =>
  Buffer.from(data, 'base64').toString('ascii');
