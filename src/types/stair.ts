export type AggregateType = 'Basalt' | 'Granite' | 'Limestone' | 'Sandstone'
export type SupportCondition = 'SimplySupported' | 'FixedBothEnds'
export interface StraightStairRequest {
  lowerBeamWidthCm:number; lowerBeamHeightCm:number; lowerLandingLengthCm:number
  upperBeamWidthCm:number; upperBeamHeightCm:number; upperLandingLengthCm:number
  stairWidthCm:number; treadCm:number; riserCm:number; riserCount:number; waistThicknessCm:number
  concreteStrengthMpa:number; liveLoadKnM2:number; coverCm:number
  mainBarDiameterMm:number; distributionBarDiameterMm:number
  aggregate:AggregateType; support:SupportCondition
}
export interface StairPoint { x:number; y:number }
export interface LocalPreview {
  generatedAt:string
  geometry:{horizontalRunM:number;totalRiseM:number;inclinedLengthM:number;stepCount:number}
}
