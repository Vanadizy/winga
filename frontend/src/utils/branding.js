export const imageUrl=path=>path?`${import.meta.env.BASE_URL}backend/${path}`:'';

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
