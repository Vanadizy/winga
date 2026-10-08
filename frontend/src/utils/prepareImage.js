const MAX_IMAGE_BYTES=4*1024*1024;
const acceptedTypes=new Set(['image/jpeg','image/png','image/webp','image/gif']);

function loadImage(file){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file),image=new Image();
    image.onload=()=>{URL.revokeObjectURL(url);resolve(image)};
    image.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('This image format is not supported by your browser. Choose a JPG, PNG or WebP image.'))};
    image.src=url;
  });
}

export async function prepareImage(file){
  if(acceptedTypes.has(file.type)&&file.size<=MAX_IMAGE_BYTES)return file;
  const image=await loadImage(file);
  const scale=Math.min(1,2200/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
  canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.86));
  if(!blob)throw new Error('Could not prepare this image for upload.');
  const name=(file.name||'image').replace(/\.[^.]+$/,'')+'.jpg';
  return new File([blob],name,{type:'image/jpeg',lastModified:Date.now()});
}

export async function prepareImages(files){
  const output=[];
  for(const file of files)output.push(await prepareImage(file));
  return output;
}
