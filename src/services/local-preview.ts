import type { LocalPreview, StraightStairRequest } from '../types/stair'

export function createLocalPreview(input:StraightStairRequest):LocalPreview {
  const horizontalRunM=Math.max(input.riserCount-1,0)*input.treadCm/100
  const totalRiseM=input.riserCount*input.riserCm/100

  return {
    generatedAt:new Date().toISOString(),
    geometry:{
      horizontalRunM,
      totalRiseM,
      inclinedLengthM:Math.hypot(horizontalRunM,totalRiseM),
      stepCount:input.riserCount,
    },
  }
}

export function downloadProject(input:StraightStairRequest,name='escada-um-lance') {
  const project={
    versao:'1.0',
    nome:name,
    tipo:'UmLance',
    atualizadoEm:new Date().toISOString(),
    dados:input,
  }
  const blob=new Blob([JSON.stringify(project,null,2)],{type:'application/json'})
  const href=URL.createObjectURL(blob)
  const link=document.createElement('a')
  link.href=href
  link.download=`${name.replace(/[^\p{L}\p{N}_-]+/gu,'-').replace(/^-|-$/g,'')||'escada-um-lance'}.json`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(href)
}
