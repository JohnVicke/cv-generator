export const getDatabaseUrl = (
  user: string,
  password: string,
  host: string,
  name: string
) => {
  return `postgresql://${user}:${password}@${host}:5432/${name}`;
};
