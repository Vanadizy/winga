import axios from 'axios';
// Set VITE_API_URL at build time for production. Local development falls back to the PHP server.
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('winga_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
api.interceptors.response.use(
  r=>r.data,
  e=>{
    const data=e.response?.data;
    const message=typeof data==='object'&&data?.message ? data.message : e.response ? `API request failed (${e.response.status}). Check VITE_API_URL and PHP server.` : 'Cannot reach the API. Start the PHP server and check VITE_API_URL.';
    return Promise.reject({message,status:e.response?.status,errors:typeof data==='object'?data.errors:{},payment_required:typeof data==='object'&&data?.errors?.payment_required===true,payment_whatsapp:typeof data==='object'?data?.errors?.payment_whatsapp:null});
  }
); export default api;
