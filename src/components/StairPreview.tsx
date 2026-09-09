import type { StraightStairRequest } from '../types/stair'
export function StairPreview({input}:{input:StraightStairRequest}) {
  const points:string[]=[];let x=30;let y=210;points.push(`${x},${y}`);x+=input.lowerLandingLengthCm*.32;points.push(`${x},${y}`)
  const sx=Math.min(.5,270/Math.max(input.treadCm*(input.riserCount-1),1));const sy=Math.min(.72,150/Math.max(input.riserCm*input.riserCount,1))
  for(let i=0;i<input.riserCount;i+=1){y-=input.riserCm*sy;points.push(`${x},${y}`);if(i<input.riserCount-1){x+=input.treadCm*sx;points.push(`${x},${y}`)}}
  x+=input.upperLandingLengthCm*.32;points.push(`${x},${y}`)
  return <div className="preview" aria-label="Prévia da geometria da escada"><div className="preview-heading"><div><span className="eyebrow">Prévia geométrica</span><strong>{input.riserCount} espelhos · {input.treadCm} × {input.riserCm} cm</strong></div><span className="scale-tag">Esquemático</span></div><svg viewBox="0 0 520 250" role="img" aria-label="Elevação lateral da escada"><defs><linearGradient id="stairFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dff2ff"/><stop offset="1" stopColor="#f6fbff"/></linearGradient></defs><path d={`M ${points.join(' L ')} L ${x},230 L 30,230 Z`} fill="url(#stairFill)"/><polyline points={points.join(' ')} fill="none" stroke="#0177c9" strokeWidth="4" strokeLinejoin="round"/><line x1="30" y1="230" x2="490" y2="230" stroke="#a9bbc8" strokeWidth="2"/><circle cx="30" cy="210" r="7" fill="#212d3d"/><circle cx={Math.min(x,490)} cy={y} r="7" fill="#212d3d"/></svg></div>
}
