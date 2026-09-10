import { stairKindLabels, type AutoportanteLRequest, type AutoportanteURequest, type StairInput, type StairKind, type StraightStairRequest } from '../types/stair'

interface Props {kind:StairKind;input:StairInput}

function stepPoints(startX:number,startY:number,stepX:number,stepY:number,count:number){
  const points=[`${startX},${startY}`]
  let x=startX;let y=startY
  for(let index=0;index<count;index+=1){
    y+=stepY;points.push(`${x},${y}`)
    if(index<count-1){x+=stepX;points.push(`${x},${y}`)}
  }
  return points
}

function PreviewShape({kind,input}:{kind:StairKind;input:StairInput}){
  if(kind==='UmLance'){
    const straight=input as StraightStairRequest
    const count=Math.max(straight.riserCount,2)
    const sx=Math.min(.5,270/Math.max(straight.treadCm*(count-1),1))
    const sy=Math.min(.72,150/Math.max(straight.riserCm*count,1))
    const points=stepPoints(45,205,straight.treadCm*sx,-straight.riserCm*sy,count)
    const end=points.at(-1)?.split(',').map(Number)??[380,60]
    const outline=`${points.join(' ')} ${end[0]+straight.upperLandingLengthCm*.3},${end[1]} ${end[0]+straight.upperLandingLengthCm*.3},230 45,230`
    return <><polygon points={outline} fill="url(#stairFill)"/><polyline points={points.join(' ')} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinejoin="round"/><circle cx="45" cy="205" r="7" fill="var(--navy)"/><circle cx={end[0]} cy={end[1]} r="7" fill="var(--navy)"/></>
  }
  if(kind==='AutoportanteU'){
    const u=input as AutoportanteURequest
    const lower=stepPoints(55,205,12,-(u.lowerRiserCm*1.8),Math.min(u.lowerRiserCount,9))
    const upper=stepPoints(415,75,-12,-(u.upperRiserCm*1.8),Math.min(u.upperRiserCount,9))
    return <><polyline points={lower.join(' ')} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinejoin="round"/><polyline points={upper.join(' ')} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinejoin="round"/><rect x="170" y="74" width="190" height="13" rx="6" fill="var(--brand-soft)" stroke="var(--brand)"/><circle cx="55" cy="205" r="7" fill="var(--navy)"/><circle cx="415" cy="75" r="7" fill="var(--navy)"/><path d="M55 212 L170 212 L360 94 L415 94" fill="none" stroke="var(--border)" strokeWidth="2"/></>
  }
  const l=input as AutoportanteLRequest
  const lower=stepPoints(55,205,12,-(l.lowerRiserCm*1.8),Math.min(l.lowerRiserCount,9))
  return <><polyline points={lower.join(' ')} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinejoin="round"/><path d="M160 80 L160 205 L55 205" fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinejoin="round"/><path d="M160 80 L360 80" fill="none" stroke="var(--brand)" strokeWidth="4"/><circle cx="55" cy="205" r="7" fill="var(--navy)"/><circle cx="160" cy="80" r="7" fill="var(--navy)"/><path d="M45 230 L470 230" stroke="var(--border)" strokeWidth="2"/>
  </>
}

export function StairPreview({kind,input}:Props){
  const label=stairKindLabels[kind]
  const details=kind==='UmLance'?`${(input as StraightStairRequest).riserCount} espelhos · ${(input as StraightStairRequest).treadCm} × ${(input as StraightStairRequest).riserCm} cm`:kind==='AutoportanteU'?`${(input as AutoportanteURequest).lowerRiserCount+(input as AutoportanteURequest).upperRiserCount} espelhos · dois lances`:`${(input as AutoportanteLRequest).lowerRiserCount+(input as AutoportanteLRequest).upperRiserCount} espelhos · dois lances`
  return <div className="preview" aria-label={`Prévia da geometria: ${label}`}>
    <div className="preview-heading"><div><span className="eyebrow">Prévia geométrica</span><strong>{details}</strong></div><span className="scale-tag">Esquemático</span></div>
    <svg viewBox="0 0 520 250" role="img" aria-label={`Elevação esquemática de ${label}`}><defs><linearGradient id="stairFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dff2ff"/><stop offset="1" stopColor="#f6fbff"/></linearGradient></defs><PreviewShape kind={kind} input={input}/><line x1="30" y1="230" x2="490" y2="230" stroke="var(--border)" strokeWidth="2"/></svg>
  </div>
}
