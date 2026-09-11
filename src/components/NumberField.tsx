import type { ChangeEvent } from 'react'
interface Props {label:string;name:string;value:number;unit?:string;min?:number;max?:number;step?:number;onChange:(name:string,value:number)=>void}
export function NumberField({label,name,value,unit,min,max,step=1,onChange}:Props) {
  const change=(event:ChangeEvent<HTMLInputElement>)=>{const next=event.target.valueAsNumber;if(!Number.isNaN(next))onChange(name,next)}
  return <label className="field"><span>{label}</span><span className="input-shell"><input type="number" name={name} value={value} min={min} max={max} step={step} onChange={change} required />{unit&&<small>{unit}</small>}</span></label>
}
