import api from './axios';

interface loginUserInterface
{
    email: string;
    password: string;
}

interface registerUserInterface
{
  name: string;
  username: string;
  email: string;
  password: string;
}


export const loginUser = async ({ email, password }: loginUserInterface) => {
  const { data } = await api.post('/auth/user/login', { email, password });
  return data;
};

export const registerUser = async ({name, username, email, password} : registerUserInterface) => {
  const {data} = await api.post('/auth/user/register', {name, username, email, password});
}