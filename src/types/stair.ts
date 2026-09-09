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
export interface StraightStairAnalysis {
  compatibilityVersion:string
  geometry:{horizontalRunM:number;structuralSpanM:number;totalRiseM:number;inclinedLengthM:number;effectiveThicknessM:number;profile:StairPoint[]}
  loads:{selfWeightKnM2:number;liveLoadKnM2:number;serviceLoadKnM2:number;designLoadKnM2:number}
  forces:{maximumMomentKnM:number;maximumShearKn:number;maximumCompressionKn:number;maximumTensionKn:number}
  reinforcement:{effectiveDepthCm:number;neutralAxisRatio:number;requiredMainAreaCm2PerM:number;minimumMainAreaCm2PerM:number;adoptedMainAreaCm2PerM:number;mainBarSpacingCm:number;distributionAreaCm2PerM:number;distributionBarSpacingCm:number;neutralAxisWithinLimit:boolean}
  momentDiagram:Array<{x:number;momentKnM:number}>; warnings:string[]
}
