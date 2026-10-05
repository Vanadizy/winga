import {useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../services/api';
import {useAuth} from '../context/AuthContext';

export default function AdminDashboard(){
  const [users,setUsers]=useState([]),[error,setError]=useState('');
  const {user}=useAuth();
  useEffect(()=>{api.get('/admin/users.php').then(result=>setUsers(result.users||[])).catch(e=>setError(e.message||'Could not load users.'))},[]);
  const stats=useMemo(()=>({total:users.length,active:users.filter(x=>x.status==='active'&&x.subscription_status!=='expired').length,suspended:users.filter(x=>x.status==='suspended').length,expired:users.filter(x=>x.subscription_status==='expired').length}),[users]);
  const cards=[['Total accounts',stats.total,'Registered users and shops'],['Active accounts',stats.active,'Currently able to access EMS'],['Suspended accounts',stats.suspended,'Access is currently paused'],['Expired subscriptions',stats.expired,'Trial or subscription has ended']];
  return <><div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-orange-700">EMS administration</p><h1 className="mt-1 text-3xl font-black">Admin dashboard</h1><p className="mt-1 text-slate-500">Account and subscription overview for {user?.shop_name||'the system'}.</p></div><Link className="btn-primary" to="/users">Manage users</Link></div>
    {error&&<p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([title,value,description])=><article className="card min-h-36" key={title}><p className="text-sm font-semibold text-slate-500">{title}</p><p className="mt-3 text-4xl font-black text-slate-900">{value}</p><p className="mt-2 text-xs text-slate-500">{description}</p></article>)}</section>
    <section className="card mt-5 overflow-x-auto"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-lg font-bold">Recently registered accounts</h2><p className="text-sm text-slate-500">Latest shops and users in EMS.</p></div><Link to="/users" className="font-semibold text-orange-700">View all users</Link></div><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="pb-3">Seller / shop</th><th className="pb-3">Phone</th><th className="pb-3">Status</th><th className="pb-3">Subscription</th></tr></thead><tbody>{users.filter(row=>row.role!=='admin').slice(0,6).map(row=><tr className="border-b last:border-0" key={row.id}><td className="py-3"><b>{row.full_name}</b><span className="block text-xs text-slate-500">{row.shop_name||'Shop name not set'}</span></td><td>{row.phone}</td><td className="capitalize">{row.status}</td><td className="capitalize">{row.subscription_status||'Not set'}</td></tr>)}</tbody></table>{!users.some(row=>row.role!=='admin')&&!error&&<p className="py-8 text-center text-sm text-slate-500">No seller accounts have been registered yet.</p>}</section>
  </>;
}
