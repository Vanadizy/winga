import {LoaderCircle} from 'lucide-react';

export default function UploadOverlay({label='Uploading image...'}){
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4" role="status" aria-live="polite" aria-label={label}>
    <div className="flex min-w-48 flex-col items-center gap-3 rounded-2xl bg-white px-8 py-7 shadow-2xl">
      <LoaderCircle className="h-12 w-12 animate-spin text-orange-600" strokeWidth={2.5}/>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
    </div>
  </div>;
}
