import api from './api'; export const login=d=>api.post('/auth/login.php',d);export const register=d=>api.post('/auth/register.php',d);export const me=()=>api.get('/auth/me.php');
