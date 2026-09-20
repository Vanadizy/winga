import {useEffect,useRef,useState} from 'react';
import {BrowserMultiFormatReader} from '@zxing/browser';
export default function Scanner({onScan}) {
  const videoRef=useRef(null), callbackRef=useRef(onScan);
  const [open,setOpen]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState('');
  useEffect(()=>{callbackRef.current=onScan},[onScan]);
  useEffect(()=>{
    if(!open) return undefined;
    const reader=new BrowserMultiFormatReader(); let controls; let stopped=false;
    (async()=>{try {
      // Request access first: it reveals camera labels, then prefer the rear camera for barcodes.
      const initialStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
      initialStream.getTracks().forEach(track=>track.stop());
      const devices=await BrowserMultiFormatReader.listVideoInputDevices();
      const rear=devices.find(device=>/(back|rear|environment)/i.test(device.label));
      const deviceId=(rear||devices[0])?.deviceId;
      if(!deviceId) throw new Error('No camera was found on this device.');
      setStatus('Point the rear camera at the barcode and hold still.');
      controls=await reader.decodeFromVideoDevice(deviceId,videoRef.current,(result,decodeError)=>{
        if(result&&!stopped){stopped=true;setStatus('Barcode captured.');callbackRef.current(result.getText());controls?.stop();setOpen(false);return;}
        // NotFoundException is normal while a barcode is not yet in frame; do not show it as an error.
        if(decodeError?.name && decodeError.name!=='NotFoundException') setError('Could not read that barcode. Try better light, focus, or enter it manually.');
      });
    } catch(err) { setError(err?.message||'Camera could not start. Allow camera permission and try again.'); }})();
    return ()=>{stopped=true;controls?.stop()};
  },[open]);
  if(!open)return <div className="mt-2"><button type="button" className="btn-secondary" onClick={()=>{setError('');setStatus('');setOpen(true)}}>Open camera scanner</button>{error&&<p className="mt-1 text-sm text-red-600">{error}</p>}</div>;
  return <div className="mt-2 rounded-lg border border-orange-200 bg-orange-50 p-2"><video ref={videoRef} className="aspect-video w-full rounded-lg bg-slate-900 object-cover" muted playsInline/>{status&&<p className="mt-2 text-sm text-slate-600">{status}</p>}{error&&<p className="mt-2 text-sm text-red-600">{error}</p>}<button type="button" className="btn-secondary mt-2" onClick={()=>setOpen(false)}>Cancel scanner</button></div>;
}
