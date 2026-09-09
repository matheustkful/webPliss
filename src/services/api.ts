import type { StraightStairAnalysis, StraightStairRequest } from '../types/stair'
const apiUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
async function parseError(response:Response) {
  try { const body=await response.json() as {title?:string;errors?:Record<string,string[]>}; return (body.errors&&Object.values(body.errors).flat()[0])??body.title??'Não foi possível concluir a operação.' }
  catch { return 'Não foi possível comunicar com a API.' }
}
export async function analyzeStraightStair(input:StraightStairRequest):Promise<StraightStairAnalysis> {
  const response=await fetch(`${apiUrl}/api/v1/stairs/straight/analyze`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)})
  if(!response.ok) throw new Error(await parseError(response)); return response.json() as Promise<StraightStairAnalysis>
}
export async function downloadStraightStairDxf(input:StraightStairRequest) {
  const response=await fetch(`${apiUrl}/api/v1/stairs/straight/export/dxf`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)})
  if(!response.ok) throw new Error(await parseError(response))
  const blob=await response.blob(); const disposition=response.headers.get('content-disposition')??''
  const fileName=disposition.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i)?.[1]??'escada-um-lance.dxf'
  const href=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=href; link.download=decodeURIComponent(fileName)
  document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(href)
}
