import {useEffect,useRef,useState} from 'react';
import {BrowserMultiFormatReader} from '@zxing/browser';
import {BarcodeFormat,DecodeHintType} from '@zxing/library';

const formats=[BarcodeFormat.AZTEC,BarcodeFormat.CODE_128,BarcodeFormat.CODE_39,BarcodeFormat.CODE_93,BarcodeFormat.CODABAR,BarcodeFormat.EAN_13,BarcodeFormat.EAN_8,BarcodeFormat.ITF,BarcodeFormat.UPC_A,BarcodeFormat.UPC_E,BarcodeFormat.QR_CODE,BarcodeFormat.DATA_MATRIX,BarcodeFormat.PDF_417];
function beep(context){if(!context)return;try{const oscillator=context.createOscillator(),gain=context.createGain();oscillator.type='sine';oscillator.frequency.value=1046;gain.gain.setValueAtTime(.001,context.currentTime);gain.gain.exponentialRampToValueAtTime(.22,context.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.16);oscillator.connect(gain);gain.connect(context.destination);oscillator.start();oscillator.stop(context.currentTime+.17)}catch{}}
export default function Scanner({onScan}){
  const videoRef=useRef(null),callbackRef=useRef(onScan),controlsRef=useRef(null),audioRef=useRef(null),[open,setOpen]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState('');
  useEffect(()=>{callbackRef.current=onScan},[onScan]);
  const start=()=>{setError('');setStatus('');const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(AudioContextClass){audioRef.current=new AudioContextClass();audioRef.current.resume?.()}setOpen(true)};
  useEffect(()=>{
    if(!open)return undefined;
    const hints=new Map([[DecodeHintType.POSSIBLE_FORMATS,formats],[DecodeHintType.TRY_HARDER,true]]);
    const reader=new BrowserMultiFormatReader(hints,{delayBetweenScanAttempts:140,delayBetweenScanSuccess:220});
    let stopped=false;
    setStatus('Starting the rear camera…');
    reader.decodeFromConstraints({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}}},videoRef.current,(result,decodeError)=>{
      if(result&&!stopped){stopped=true;setStatus('Barcode captured.');beep(audioRef.current);callbackRef.current(result.getText());controlsRef.current?.stop();setOpen(false);return}
      if(decodeError?.name&&decodeError.name!=='NotFoundException'&&decodeError.name!=='ChecksumException'&&decodeError.name!=='FormatException')setError('Camera scan failed. Check camera permission or enter the code manually.');
    }).then(controls=>{controlsRef.current=controls;if(stopped)controls.stop();else{setStatus('Aim at the barcode. Hold steady and move closer if needed.');const track=videoRef.current?.srcObject?.getVideoTracks?.()[0];track?.applyConstraints({advanced:[{focusMode:'continuous'}]}).catch(()=>{})}}).catch(cameraError=>{setError(cameraError?.name==='NotAllowedError'?'Allow camera permission, then try again.':cameraError?.message||'Camera could not start.');setStatus('')});
    return ()=>{stopped=true;controlsRef.current?.stop();controlsRef.current=null};
  },[open]);
  if(!open)return <div className="mt-2"><button type="button" className="btn-secondary" onClick={start}>Open fast barcode scanner</button>{error&&<p className="mt-1 text-sm text-red-600">{error}</p>}</div>;
  return <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50 p-2"><video ref={videoRef} className="aspect-video w-full rounded-lg bg-slate-900 object-cover" muted playsInline/>{status&&<p className="mt-2 text-sm text-slate-600">{status}</p>}{error&&<p className="mt-2 text-sm text-red-600">{error}</p>}<button type="button" className="btn-secondary mt-2" onClick={()=>setOpen(false)}>Cancel scanner</button></div>;
}
