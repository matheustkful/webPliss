import type { AutoportanteLRequest, AutoportanteURequest, Project, StairKind, StraightStairRequest } from '../types/stair'

const storageKey='webpliss.projetos.v1'

export const initialStraightInput:StraightStairRequest={
  lowerBeamWidthCm:20,lowerBeamHeightCm:50,lowerLandingLengthCm:80,
  upperBeamWidthCm:20,upperBeamHeightCm:50,upperLandingLengthCm:100,
  stairWidthCm:120,treadCm:30,riserCm:18,riserCount:10,waistThicknessCm:15,
  concreteStrengthMpa:20,liveLoadKnM2:3,coverCm:2.5,mainBarDiameterMm:6.3,
  distributionBarDiameterMm:5,aggregate:'Basalt',support:'SimplySupported',
}

export const initialUInput:AutoportanteURequest={
  widthCm:120,distanceBetweenFlightsCm:50,centralLandingLengthCm:100,thicknessCm:15,
  lowerTreadCm:30,lowerRiserCm:18,lowerRiserCount:8,upperTreadCm:30,upperRiserCm:18,upperRiserCount:8,
  concreteStrengthMpa:20,liveLoadKnM2:3,coverCm:2.5,mainBarDiameterMm:6.3,distributionBarDiameterMm:5,aggregate:'Basalt',
}

export const initialLInput:AutoportanteLRequest={
  widthCm:120,thicknessCm:15,lowerLandingLengthCm:80,upperLandingLengthCm:100,
  lowerTreadCm:30,lowerRiserCm:18,lowerRiserCount:8,upperTreadCm:30,upperRiserCm:18,upperRiserCount:8,
  concreteStrengthMpa:20,liveLoadKnM2:3,coverCm:2.5,mainBarDiameterMm:6.3,distributionBarDiameterMm:5,aggregate:'Basalt',
}

export function inputForKind(kind:StairKind) {
  if(kind==='AutoportanteU') return structuredClone(initialUInput)
  if(kind==='AutoportanteL') return structuredClone(initialLInput)
  return structuredClone(initialStraightInput)
}

function createId(){
  if(typeof crypto!=='undefined'&&'randomUUID' in crypto) return crypto.randomUUID()
  return `projeto-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function demoProjects():Project[]{
  return [{id:createId(),name:'Escada principal',kind:'UmLance',input:structuredClone(initialStraightInput),updatedAt:new Date().toISOString()}]
}

export function loadProjects():Project[]{
  if(typeof window==='undefined') return demoProjects()
  try{
    const saved=window.localStorage.getItem(storageKey)
    if(!saved) return demoProjects()
    const projects=JSON.parse(saved) as Project[]
    return Array.isArray(projects)&&projects.length>0?projects:demoProjects()
  }catch{return demoProjects()}
}

export function saveProjects(projects:Project[]){
  if(typeof window==='undefined') return
  try{window.localStorage.setItem(storageKey,JSON.stringify(projects))}catch{/* armazenamento local pode estar indisponível */}
}

export function createProject(name:string,kind:StairKind):Project{
  return {id:createId(),name:name.trim(),kind,input:inputForKind(kind),updatedAt:new Date().toISOString()}
}
