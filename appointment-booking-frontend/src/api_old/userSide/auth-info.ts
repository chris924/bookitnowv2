import api from '../axios';


export const  authInfo = async () => {
     return await api.get('/auth/auth-info')
}

   
