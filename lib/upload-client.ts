export async function uploadImages(files: File[], onSaved: (url:string)=>void) {
  for (const file of files) {
    if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) || file.size > 20*1024*1024) throw new Error('Choose JPEG, PNG, WebP or GIF photos under 20 MB.')
    let upload:Blob=file
    if(file.type!=='image/gif') {
      const bitmap=await createImageBitmap(file)
      const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height))
      const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale)
      const context=canvas.getContext('2d');if(!context)throw new Error('Photo processing is unavailable in this browser.')
      context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close()
      upload=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not prepare photo.')),'image/webp',0.85))
    }
    if(upload.size>3*1024*1024)throw new Error('This photo is too large. Choose a smaller image under 3 MB.')
    const body=new FormData();body.append('file',upload,upload.type==='image/webp'?'photo.webp':file.name)
    const response=await fetch('/api/upload',{method:'POST',body})
    if(response.status===401)throw new Error('Session expired. Sign in again before uploading.')
    if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Upload did not finish. Please try a smaller photo.')
    const result=await response.json()
    if(!response.ok||!result.success||!result.files?.[0]?.url)throw new Error(result.error||'Upload failed. Please retry.')
    onSaved(result.files[0].url)
  }
}
