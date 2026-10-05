import {useRef,useState} from 'react';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import {Download,X} from 'lucide-react';
import {imageUrl} from '../../utils/branding';

const dateLabel=value=>value?new Date(String(value).replace(' ','T')).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'—';
const money=value=>Number(value||0).toLocaleString();

export default function WarrantyCertificate({purchase,onClose}){
  const paper=useRef(null),[saving,setSaving]=useState(false),[error,setError]=useState('');
  const shop=purchase.shop_name||purchase.seller_name||'Your Shop';
  const seller=purchase.seller_name||'Shop representative';
  const download=async()=>{
    if(!paper.current)return;
    setSaving(true);setError('');
    try{
      const canvas=await html2canvas(paper.current,{scale:2,useCORS:true,backgroundColor:'#fff',logging:false,windowWidth:paper.current.scrollWidth,windowHeight:paper.current.scrollHeight});
      const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
      const margin=10,pageWidth=210-2*margin,pageHeight=297-2*margin;
      const scale=Math.min(pageWidth/canvas.width,pageHeight/canvas.height);
      const width=canvas.width*scale,height=canvas.height*scale;
      pdf.addImage(canvas.toDataURL('image/png'),'PNG',(210-width)/2,(297-height)/2,width,height);
      pdf.save(`warranty-card-${purchase.unique_identifier||purchase.id||'item'}.pdf`);
    }catch{setError('The warranty card could not be downloaded. Please try again.')}finally{setSaving(false)}
  };
  const fields=[['Customer',purchase.customer_name||'Walk-in customer'],['Contact',purchase.customer_phone||'Not recorded'],['Purchase date',dateLabel(purchase.sold_at)],['Product',purchase.name||'Product'],['Brand',purchase.brand||'—'],['IMEI / Serial',purchase.unique_identifier||'—'],['Price',`TZS ${money(purchase.selling_price)}`],['Warranty',Number(purchase.warranty_months)>0?`${purchase.warranty_months} month${Number(purchase.warranty_months)===1?'':'s'}`:'No warranty'],['Warranty expires',dateLabel(purchase.warranty_ends_at)]];
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-3 sm:p-6" onClick={onClose}>
    <div className="w-full max-w-4xl" onClick={e=>e.stopPropagation()}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-white"><div><h2 className="text-xl font-bold">Warranty card preview</h2><p className="text-sm text-white/70">Full purchase details · {purchase.customer_name||'Walk-in customer'}</p></div><div className="flex gap-2"><button onClick={download} disabled={saving} className="btn-primary inline-flex items-center gap-2"><Download size={16}/>{saving?'Preparing…':'Download card'}</button><button onClick={onClose} aria-label="Close preview" className="inline-flex items-center gap-2 rounded-xl bg-white/15 p-3 hover:bg-white/25"><X size={18}/>Close</button></div></div>
      {error&&<p className="mb-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="max-h-[78vh] overflow-auto rounded-xl shadow-2xl">
        <article ref={paper} className="mx-auto w-full max-w-[720px] rounded-xl border border-orange-200 bg-white p-3 text-slate-900 shadow-2xl sm:p-7">
          <header className="flex items-center justify-between gap-2 border-b border-orange-200 pb-2 sm:gap-4 sm:pb-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">{purchase.profile_image?<img className="h-8 w-8 shrink-0 rounded-lg border border-orange-100 bg-white object-contain p-0.5 sm:h-12 sm:w-12" src={imageUrl(purchase.profile_image)} crossOrigin="anonymous" alt={`${shop} logo`}/>:<div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-100 text-lg font-black text-orange-900 sm:h-12 sm:w-12 sm:text-2xl">{shop.slice(0,1).toUpperCase()}</div>}<p className="min-w-0 break-words font-serif text-sm font-bold text-orange-950 sm:text-lg">{shop}</p></div>
            <h1 className="shrink-0 rounded-lg bg-orange-900 px-2 py-1.5 text-[10px] font-black tracking-wide text-white sm:px-4 sm:py-2 sm:text-lg">WARRANTY CARD</h1>
          </header>
          <section className="my-2 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-lg bg-orange-50 p-2.5 sm:my-4 sm:gap-x-6 sm:gap-y-3 sm:p-5">
            {fields.map(([label,value])=><div className="min-w-0 border-b border-orange-200 pb-1 sm:pb-2" key={label}><p className="text-[8px] font-bold uppercase tracking-wide text-orange-700 sm:text-[10px]">{label}</p><p className="break-words text-[10px] font-semibold leading-tight text-slate-800 sm:text-sm sm:leading-snug">{value}</p></div>)}
          </section>
          <footer className="flex flex-wrap items-start justify-between gap-1 border-t border-orange-200 pt-2 text-[9px] text-slate-600 sm:gap-2 sm:pt-3 sm:text-xs"><span className="max-w-sm">Keep this card as proof of purchase and warranty.</span><span className="break-words text-right font-semibold text-orange-900">{seller}{purchase.seller_phone?` · ${purchase.seller_phone}`:''}</span></footer>
        </article>
      </div>
    </div>
  </div>;
}
