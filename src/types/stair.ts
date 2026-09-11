export type AggregateType = 'Basalt' | 'Granite' | 'Limestone' | 'Sandstone'
export type SupportCondition = 'SimplySupported' | 'FixedBothEnds'
export type DisposicaoArmadura = 'Continua' | 'Estribos'
export type StairKind = 'UmLance' | 'AutoportanteU' | 'AutoportanteL'

export const stairKindLabels:Record<StairKind,string>={
  UmLance:'Escada de um lance',
  AutoportanteU:'Escada autoportante em U',
  AutoportanteL:'Escada autoportante em L',
}

export interface StraightStairRequest {
  lowerBeamWidthCm:number; lowerBeamHeightCm:number; lowerLandingLengthCm:number
  upperBeamWidthCm:number; upperBeamHeightCm:number; upperLandingLengthCm:number
  stairWidthCm:number; treadCm:number; riserCm:number; riserCount:number; waistThicknessCm:number
  concreteStrengthMpa:number; liveLoadKnM2:number; coverCm:number
  mainBarDiameterMm:number; distributionBarDiameterMm:number
  aggregate:AggregateType; support:SupportCondition; disposicaoArmadura:DisposicaoArmadura
}

export interface AutoportanteURequest {
  widthCm:number; distanceBetweenFlightsCm:number; centralLandingLengthCm:number; thicknessCm:number
  lowerTreadCm:number; lowerRiserCm:number; lowerRiserCount:number
  upperTreadCm:number; upperRiserCm:number; upperRiserCount:number
  concreteStrengthMpa:number; liveLoadKnM2:number; coverCm:number
  mainBarDiameterMm:number; distributionBarDiameterMm:number; aggregate:AggregateType
}

export interface AutoportanteLRequest {
  widthCm:number; thicknessCm:number; lowerLandingLengthCm:number; upperLandingLengthCm:number
  lowerTreadCm:number; lowerRiserCm:number; lowerRiserCount:number
  upperTreadCm:number; upperRiserCm:number; upperRiserCount:number
  concreteStrengthMpa:number; liveLoadKnM2:number; coverCm:number
  mainBarDiameterMm:number; distributionBarDiameterMm:number; aggregate:AggregateType
}

export type StairInput=StraightStairRequest|AutoportanteURequest|AutoportanteLRequest

export interface Project {
  id:string
  name:string
  kind:StairKind
  input:StairInput
  updatedAt:string
}

export interface StairPoint { x:number; y:number }
export interface LocalPreview {
  generatedAt:string
  kind:StairKind
  geometry:{horizontalRunM:number;totalRiseM:number;inclinedLengthM:number;stepCount:number}
}
