import { User } from '../entity/User';
import { getConnection } from 'typeorm';

const getUserRepo = () => {
  return getConnection().getRepository('User');
};

export const getUserById = async (
  id: number
): Promise<User | { error: string }> => {
  const user = await getUserRepo().findOne(id);
  if (user) return user as User;

  return { error: 'not found' };
};
