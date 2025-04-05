import api from './axios';

interface loginUserInterface
{
    email: string;
    password: string;
}

export const loginUser = async ({ email, password }: loginUserInterface) => {
  const { data } = await api.post('/auth/user/login', { email, password });
  return data;
};