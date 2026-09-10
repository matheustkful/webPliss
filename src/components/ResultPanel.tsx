import type { LocalPreview } from '../types/stair'

const number=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2,minimumFractionDigits:2})

export function ResultPanel({preview}:{preview:LocalPreview}) {
  const geometry=preview.geometry
  return <section className="results" aria-live="polite">
    <div className="section-title"><div><span className="eyebrow">Prévia local</span><h2>Resumo geométrico</h2></div><span className="status success">Interface funcionando</span></div>
    <div className="metric-grid">
      <article><span>Projeção horizontal</span><strong>{number.format(geometry.horizontalRunM)}</strong><small>m</small></article>
      <article><span>Altura total</span><strong>{number.format(geometry.totalRiseM)}</strong><small>m</small></article>
      <article><span>Comprimento inclinado</span><strong>{number.format(geometry.inclinedLengthM)}</strong><small>m</small></article>
      <article><span>Espelhos</span><strong>{geometry.stepCount}</strong><small>unidades</small></article>
    </div>
    <div className="notice">Esta é uma prévia calculada no navegador para demonstrar o layout. O dimensionamento estrutural, o DXF e o GLB serão conectados manualmente em uma etapa futura.</div>
  </section>
}
