import api from "../axios";

interface loginCompanyInterface
{
    email: string;
    password: string;
}

export const loginCompany = async ({ email, password }: loginCompanyInterface) => {
  const { data } = await api.post('/auth/company/login', { email, password });
  return data;
};