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

export const getUserData = async(userSlug: String) => {
  const response = await api.get(`/user/${userSlug}`);
  return response.data;
}

export const uploadUserAvatar = async(file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return await api.post('/user/upload-avatar', formData, {headers: {"Content-Type": "multipart/form-data"}})
}