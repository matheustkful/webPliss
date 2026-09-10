import type { LocalPreview, Project } from '../types/stair'

type ArtifactKind = 'memorial' | 'dxf' | 'glb'

interface Props {
  project: Project
  preview: LocalPreview | null
  onAction: (kind: ArtifactKind) => void
}

function DocumentIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.75h8.2L18 7.55v12.7H6z" /><path d="M14 3.75v4h4M9 12h6M9 15.5h6" /></svg>
}

function DxfIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4z" /><path d="m7 16 3.2-4 2.25 2.4 2.55-4.4 2 6M7 8h10" /></svg>
}

function GlbIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 7 4v8l-7 4-7-4v-8z" /><path d="m5 7.5 7 4 7-4M12 11.5v8" /></svg>
}

export function ProjectActions({ project, preview, onAction }: Props) {
  return <section className="artifacts-card" aria-labelledby="artifacts-title">
    <div className="artifacts-heading">
      <div><span className="eyebrow">Entregáveis</span><h2 id="artifacts-title">Arquivos do projeto</h2></div>
      <span className="artifacts-count">3 formatos</span>
    </div>
    <p className="artifacts-description">Acesse os arquivos gerados a partir deste projeto quando o cálculo estiver concluído.</p>
    <div className="artifact-list">
      <button className="artifact-button artifact-memorial" type="button" onClick={() => onAction('memorial')}>
        <span className="artifact-icon"><DocumentIcon /></span><span className="artifact-copy"><strong>Gerar memorial</strong><small>Relatório descritivo do projeto</small></span><span className="artifact-arrow">→</span>
      </button>
      <button className="artifact-button artifact-dxf" type="button" onClick={() => onAction('dxf')}>
        <span className="artifact-icon"><DxfIcon /></span><span className="artifact-copy"><strong>Gerar DXF</strong><small>Detalhamento 2D para CAD</small></span><span className="artifact-arrow">→</span>
      </button>
      <button className="artifact-button artifact-glb" type="button" onClick={() => onAction('glb')}>
        <span className="artifact-icon"><GlbIcon /></span><span className="artifact-copy"><strong>Gerar GLB</strong><small>Modelo 3D para visualização</small></span><span className="artifact-arrow">→</span>
      </button>
    </div>
    <small className="artifact-note">Projeto: {project.name}{preview ? ' · prévia atualizada' : ' · prévia ainda não atualizada'}</small>
  </section>
}

export type { ArtifactKind }
