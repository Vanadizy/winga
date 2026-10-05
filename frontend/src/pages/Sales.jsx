import {useEffect,useState} from 'react';
import {newSale,sales} from '../services/salesService';
import {scan} from '../services/productService';
import {useAuth} from '../context/AuthContext';
import Scanner from '../components/scanner/Scanner';
import WarrantyCertificate from '../components/common/WarrantyCertificate';

const cash=value=>Number(value||0).toLocaleString();
export default function Sales(){
  const {user}=useAuth();
  const [form,setForm]=useState({unique_identifier:'',customer_name:'',customer_phone:'',selling_price:'',payment_method:'cash',warranty_months:0});
  const [product,setProduct]=useState(null),[history,setHistory]=useState([]),[certificate,setCertificate]=useState(null),[error,setError]=useState(''),[saving,setSaving]=useState(false);
  const load=()=>sales().then(result=>setHistory(result.sales));
  useEffect(()=>{void load()},[]);
  const find=async value=>{setForm(current=>({...current,unique_identifier:value}));try{const result=await scan(value);setProduct(result.product);setError(result.can_sell?'':'Product unavailable')}catch(e){setProduct(null);setError(e.message)}};
  const submit=async event=>{event.preventDefault();if(!product){setError('Scan or select an available product first.');return}if(!window.confirm(`Confirm the sale of ${product.name} for TZS ${cash(form.selling_price||product.selling_price)}?`))return;setSaving(true);try{await newSale(form);const months=Number(form.warranty_months),expires=months>0?new Date(new Date().setMonth(new Date().getMonth()+months)).toLocaleDateString():null;if(months>0)setCertificate({...product,...form,selling_price:form.selling_price||product.selling_price,sold_at:new Date().toISOString(),warranty_ends_at:expires,shop_name:user?.shop_name,seller_name:user?.full_name,seller_phone:user?.phone,profile_image:user?.profile_image});setForm({unique_identifier:'',customer_name:'',customer_phone:'',selling_price:'',payment_method:'cash',warranty_months:0});setProduct(null);setError('');load()}catch(e){setError(e.message)}finally{setSaving(false)}};
  return <>
    <h2 className="mb-5 text-3xl font-bold">Sales</h2>
    <form onSubmit={submit} className="card max-w-2xl">{error&&<p role="alert" className="mb-2 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}<label className="label">Product IMEI / Serial</label><input required placeholder="Scan or type IMEI / Serial" value={form.unique_identifier} onBlur={e=>e.target.value&&find(e.target.value)} onChange={e=>setForm({...form,unique_identifier:e.target.value})}/><Scanner onScan={find}/>{product&&<p className="my-3 rounded-xl bg-orange-50 p-3"><b>{product.name}</b> · TZS {cash(product.selling_price)}</p>}
      <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-medium">Customer name<input className="mt-1" value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})}/></label><label className="block text-sm font-medium">Customer phone<input className="mt-1" value={form.customer_phone} onChange={e=>setForm({...form,customer_phone:e.target.value})}/></label><label className="block text-sm font-medium">Selling price<input className="mt-1" type="number" min="0" value={form.selling_price} onChange={e=>setForm({...form,selling_price:e.target.value})}/></label><label className="block text-sm font-medium">Warranty period (months)<input className="mt-1" type="number" min="0" value={form.warranty_months} onChange={e=>setForm({...form,warranty_months:e.target.value})}/><span className="mt-1 block text-xs font-normal text-slate-500">Enter 0 for no warranty.</span></label></div>
      <select className="mt-3" value={form.payment_method} onChange={e=>setForm({...form,payment_method:e.target.value})}>{['cash','mobile_money','bank','other'].map(value=><option key={value}>{value}</option>)}</select><button disabled={saving} className="btn-primary mt-3 disabled:opacity-60">{saving?'Recording…':'Confirm sale'}</button>
    </form>
    {certificate&&<WarrantyCertificate purchase={certificate} onClose={()=>setCertificate(null)}/>}
    <h3 className="mt-6 text-xl font-bold">Sales history</h3>{history.map(sale=><div className="card mt-2" key={sale.id}><b>{sale.name}</b> · {sale.customer_name||'Walk-in'} · TZS {cash(sale.selling_price)} · Warranty {sale.warranty_months} months</div>)}
  </>;
}
