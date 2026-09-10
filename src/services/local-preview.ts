import type { AutoportanteLRequest, AutoportanteURequest, LocalPreview, Project, StairKind, StraightStairRequest } from '../types/stair'

export function createLocalPreview(kind:StairKind,input:StraightStairRequest|AutoportanteURequest|AutoportanteLRequest):LocalPreview {
  let horizontalRunM=0
  let totalRiseM=0
  let stepCount=0
  if(kind==='UmLance'){
    const straight=input as StraightStairRequest
    horizontalRunM=Math.max(straight.riserCount-1,0)*straight.treadCm/100
    totalRiseM=straight.riserCount*straight.riserCm/100
    stepCount=straight.riserCount
  }else if(kind==='AutoportanteU'){
    const u=input as AutoportanteURequest
    horizontalRunM=((Math.max(u.lowerRiserCount-1,0)*u.lowerTreadCm)+(Math.max(u.upperRiserCount-1,0)*u.upperTreadCm)+u.centralLandingLengthCm)/100
    totalRiseM=(u.lowerRiserCount*u.lowerRiserCm+u.upperRiserCount*u.upperRiserCm)/100
    stepCount=u.lowerRiserCount+u.upperRiserCount
  }else{
    const l=input as AutoportanteLRequest
    horizontalRunM=((Math.max(l.lowerRiserCount-1,0)*l.lowerTreadCm)+l.lowerLandingLengthCm+l.upperLandingLengthCm)/100
    totalRiseM=(l.lowerRiserCount*l.lowerRiserCm+l.upperRiserCount*l.upperRiserCm)/100
    stepCount=l.lowerRiserCount+l.upperRiserCount
  }

  return {
    generatedAt:new Date().toISOString(),
    kind,
    geometry:{
      horizontalRunM,
      totalRiseM,
      inclinedLengthM:Math.hypot(horizontalRunM,totalRiseM),
      stepCount,
    },
  }
}

export function downloadProject(project:Project) {
  const file={
    versao:'1.0',nome:project.name,tipo:project.kind,atualizadoEm:project.updatedAt,dados:project.input,
  }
  const blob=new Blob([JSON.stringify(file,null,2)],{type:'application/json'})
  const href=URL.createObjectURL(blob)
  const link=document.createElement('a')
  link.href=href
  link.download=`${file.nome.replace(/[^\p{L}\p{N}_-]+/gu,'-').replace(/^-|-$/g,'')||'projeto-escada'}.json`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(href)
}
