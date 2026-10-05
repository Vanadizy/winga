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
      // Render the natural full card height, then paginate at the card's actual width.
      const canvas=await html2canvas(paper.current,{scale:2,useCORS:true,backgroundColor:'#fff',logging:false,windowWidth:paper.current.scrollWidth,windowHeight:paper.current.scrollHeight});
      const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
      const pageWidth=190,pageHeight=277;
      const renderedHeight=canvas.height*(pageWidth/canvas.width);
      let offset=0;
      while(offset<renderedHeight){
        if(offset)pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'),'PNG',10,10-offset,pageWidth,renderedHeight);
        offset+=pageHeight;
      }
      pdf.save(`warranty-card-${purchase.unique_identifier||purchase.id||'item'}.pdf`);
    }catch{setError('The warranty card could not be downloaded. Please try again.')}finally{setSaving(false)}
  };
  const fields=[['Customer',purchase.customer_name||'Walk-in customer'],['Contact',purchase.customer_phone||'Not recorded'],['Purchase date',dateLabel(purchase.sold_at)],['Product',purchase.name||'Product'],['Brand',purchase.brand||'—'],['IMEI / Serial',purchase.unique_identifier||'—'],['Price',`TZS ${money(purchase.selling_price)}`],['Warranty',Number(purchase.warranty_months)>0?`${purchase.warranty_months} month${Number(purchase.warranty_months)===1?'':'s'}`:'No warranty'],['Warranty expires',dateLabel(purchase.warranty_ends_at)]];
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-3 sm:p-6" onClick={onClose}>
    <div className="w-full max-w-4xl" onClick={e=>e.stopPropagation()}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-white"><div><h2 className="text-xl font-bold">Warranty card preview</h2><p className="text-sm text-white/70">Full purchase details · {purchase.customer_name||'Walk-in customer'}</p></div><div className="flex gap-2"><button onClick={download} disabled={saving} className="btn-primary inline-flex items-center gap-2"><Download size={16}/>{saving?'Preparing…':'Download card'}</button><button onClick={onClose} aria-label="Close preview" className="inline-flex items-center gap-2 rounded-xl bg-white/15 p-3 hover:bg-white/25"><X size={18}/>Close</button></div></div>
      {error&&<p className="mb-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="max-h-[78vh] overflow-auto rounded-xl shadow-2xl">
        <article ref={paper} className="mx-auto w-full max-w-[720px] rounded-xl border border-orange-200 bg-white p-5 text-slate-900 shadow-2xl sm:p-7">
          <header className="flex items-center justify-between gap-4 border-b border-orange-200 pb-4">
            <div className="flex min-w-0 items-center gap-3">{purchase.profile_image?<img className="h-12 w-12 shrink-0 rounded-lg border border-orange-100 bg-white object-contain p-0.5" src={imageUrl(purchase.profile_image)} crossOrigin="anonymous" alt={`${shop} logo`}/>:<div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-orange-100 text-2xl font-black text-orange-900">{shop.slice(0,1).toUpperCase()}</div>}<p className="min-w-0 break-words font-serif text-lg font-bold text-orange-950">{shop}</p></div>
            <h1 className="shrink-0 rounded-lg bg-orange-900 px-4 py-2 text-sm font-black tracking-wide text-white sm:text-lg">WARRANTY CARD</h1>
          </header>
          <section className="my-4 grid grid-cols-1 gap-x-6 gap-y-3 rounded-lg bg-orange-50 p-4 sm:grid-cols-2 sm:p-5">
            {fields.map(([label,value])=><div className="min-w-0 border-b border-orange-200 pb-2" key={label}><p className="text-[10px] font-bold uppercase tracking-wide text-orange-700">{label}</p><p className="break-words text-sm font-semibold leading-snug text-slate-800">{value}</p></div>)}
          </section>
          <footer className="flex flex-wrap items-start justify-between gap-2 border-t border-orange-200 pt-3 text-xs text-slate-600"><span className="max-w-sm">Keep this card as proof of purchase and warranty.</span><span className="break-words text-right font-semibold text-orange-900">{seller}{purchase.seller_phone?` · ${purchase.seller_phone}`:''}</span></footer>
        </article>
      </div>
    </div>
  </div>;
}
