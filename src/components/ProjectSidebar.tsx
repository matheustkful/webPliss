import { stairKindLabels, type Project } from '../types/stair'

interface Props {
  projects:Project[]
  activeId:string
  open:boolean
  collapsed:boolean
  isDirty:boolean
  onSelect:(id:string)=>void
  onCreate:()=>void
  onDelete:(id:string)=>void
  onClose:()=>void
  onCollapse:()=>void
  onExpand:()=>void
  onSave:()=>void
}

function shortType(project:Project){
  if(project.kind==='AutoportanteU') return 'U'
  if(project.kind==='AutoportanteL') return 'L'
  return '1'
}

export function ProjectSidebar({projects,activeId,open,collapsed,isDirty,onSelect,onCreate,onDelete,onClose,onCollapse,onExpand,onSave}:Props){
  return <>
    {collapsed&&<button className="sidebar-expand" type="button" onClick={onExpand}><span>›</span> Abrir projetos</button>}
    <div className={`sidebar-backdrop ${open?'is-visible':''}`} onClick={onClose} aria-hidden="true" />
    <aside className={`project-sidebar ${open?'is-open':''} ${collapsed?'is-collapsed':''}`} aria-label="Árvore de projetos">
      <div className="sidebar-heading">
        <div><span className="eyebrow">Área de trabalho</span><h2>Projetos</h2></div>
        <button className="collapse-sidebar-button" type="button" onClick={onCollapse}><span>‹</span> Recolher</button>
        <button className="icon-button sidebar-close" type="button" onClick={onClose} aria-label="Fechar árvore de projetos">×</button>
      </div>
      <button className="new-project-button" type="button" onClick={onCreate}><span>＋</span> Novo projeto</button>
      <button className={`sidebar-save-button ${isDirty?'has-changes':''}`} type="button" onClick={onSave}><span>{isDirty?'↓':'✓'}</span> {isDirty?'Salvar projeto':'Projeto salvo'}</button>
      <div className="tree-root">
        <div className="tree-root-label"><span className="tree-chevron">⌄</span><span className="tree-folder">◆</span><strong>WebPliss</strong><span className="project-count">{projects.length}</span></div>
        <div className="project-list" role="list">
          {projects.map(project=><div className={`project-row ${project.id===activeId?'is-active':''}`} key={project.id} role="listitem">
            <button className="project-select" type="button" onClick={()=>{onSelect(project.id);onClose()}} aria-current={project.id===activeId?'page':undefined}>
              <span className={`project-type project-type-${shortType(project).toLowerCase()}`}>{shortType(project)}</span>
              <span className="project-copy"><strong>{project.name}</strong><small>{stairKindLabels[project.kind]}</small></span>
            </button>
            <button className="project-delete" type="button" onClick={()=>onDelete(project.id)} disabled={projects.length===1} aria-label={`Excluir ${project.name}`} title={projects.length===1?'Mantenha pelo menos um projeto':'Excluir projeto'}>⌫</button>
          </div>)}
        </div>
      </div>
      <div className="sidebar-footer"><span className="local-dot" /> Salvo neste navegador</div>
    </aside>
  </>
}
