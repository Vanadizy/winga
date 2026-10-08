export const imageUrl=path=>{
  if(!path)return '';
  if(/^(https?:|data:|blob:)/i.test(path))return path;
  const clean=String(path).replace(/\\/g,'/').replace(/^\/+/, '').replace(/^(backend\/)+/i,'');
  return `${import.meta.env.BASE_URL}backend/${clean}`;
};

export function imageAsDataUrl(path){
  return new Promise((resolve,reject)=>{
    if(!path){resolve(null);return;}
    const image=new Image();
    image.onload=()=>{
      try{
        const canvas=document.createElement('canvas');
        canvas.width=image.naturalWidth;
        canvas.height=image.naturalHeight;
        canvas.getContext('2d').drawImage(image,0,0);
        resolve(canvas.toDataURL('image/png'));
      }catch(error){reject(error)}
    };
    image.onerror=reject;
    image.src=imageUrl(path);
  });
}
