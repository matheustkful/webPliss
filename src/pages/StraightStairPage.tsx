import { type FormEvent, useEffect, useState } from 'react'
import { NumberField } from '../components/NumberField'
import { ProjectActions, type ArtifactKind } from '../components/ProjectActions'
import { ProjectSidebar } from '../components/ProjectSidebar'
import { ResultPanel } from '../components/ResultPanel'
import { StairPreview } from '../components/StairPreview'
import { createLocalPreview, downloadMemorial, downloadProject } from '../services/local-preview'
import { createProject, loadProjects, saveProjects } from '../services/local-projects'
import { stairKindLabels, type AutoportanteLRequest, type AutoportanteURequest, type Project, type StairInput, type StairKind, type StraightStairRequest } from '../types/stair'

interface SelectFieldProps {label:string;value:string;options:Array<{value:string;label:string}>;onChange:(value:string)=>void}
function SelectField({label,value,options,onChange}:SelectFieldProps){
  return <label className="field"><span>{label}</span><select value={value} onChange={event=>onChange(event.target.value)}>{options.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
}

function MaterialFields({input,update}:{input:StairInput;update:(name:string,value:number|string)=>void}){
  return <section className="form-card"><div className="section-title"><div><span className="step-number">03</span><h2>Materiais e modelo</h2></div><span className="section-hint">Parâmetros da prévia</span></div><div className="field-grid three">
    <NumberField label="fck" name="concreteStrengthMpa" value={input.concreteStrengthMpa} unit="MPa" min={20} max={50} step={5} onChange={update}/>
    <NumberField label="Carga acidental" name="liveLoadKnM2" value={input.liveLoadKnM2} unit="kN/m²" min={0} step={.5} onChange={update}/>
    <SelectField label="Agregado graúdo" value={input.aggregate} onChange={value=>update('aggregate',value)} options={[{value:'Basalt',label:'Basalto / diabásio'},{value:'Granite',label:'Granito / gnaisse'},{value:'Limestone',label:'Calcário'},{value:'Sandstone',label:'Arenito'}]}/>
    <NumberField label="Bitola principal" name="mainBarDiameterMm" value={input.mainBarDiameterMm} unit="mm" min={4} step={.1} onChange={update}/>
    <NumberField label="Bitola de distribuição" name="distributionBarDiameterMm" value={input.distributionBarDiameterMm} unit="mm" min={4} step={.1} onChange={update}/>
    {'support' in input&&<SelectField label="Condição de apoio" value={input.support} onChange={value=>update('support',value)} options={[{value:'SimplySupported',label:'Biapoiada'},{value:'FixedBothEnds',label:'Biengastada'}]}/>}
    {'disposicaoArmadura' in input&&<SelectField label="Detalhamento da armadura" value={input.disposicaoArmadura} onChange={value=>update('disposicaoArmadura',value)} options={[{value:'Continua',label:'Armadura contínua'},{value:'Estribos',label:'Armadura em estribos'}]}/>}
  </div></section>
}

function StraightFields({input,update}:{input:StraightStairRequest;update:(name:string,value:number|string)=>void}){
  return <>
    <section className="form-card"><div className="section-title"><div><span className="step-number">01</span><h2>Geometria da escada</h2></div><span className="section-hint">Medidas em centímetros</span></div><div className="field-grid three">
      <NumberField label="Largura da escada" name="stairWidthCm" value={input.stairWidthCm} unit="cm" min={40} onChange={update}/><NumberField label="Piso" name="treadCm" value={input.treadCm} unit="cm" min={10} onChange={update}/><NumberField label="Espelho" name="riserCm" value={input.riserCm} unit="cm" min={5} step={.5} onChange={update}/><NumberField label="Quantidade de espelhos" name="riserCount" value={input.riserCount} min={2} onChange={update}/><NumberField label="Espessura da laje" name="waistThicknessCm" value={input.waistThicknessCm} unit="cm" min={7} step={.5} onChange={update}/><NumberField label="Cobrimento nominal" name="coverCm" value={input.coverCm} unit="cm" min={1} step={.5} onChange={update}/>
    </div></section>
    <section className="form-card"><div className="section-title"><div><span className="step-number">02</span><h2>Patamares e vigas</h2></div></div><div className="subsection"><h3>Apoio inferior</h3><div className="field-grid three"><NumberField label="Comprimento do patamar" name="lowerLandingLengthCm" value={input.lowerLandingLengthCm} unit="cm" min={0} onChange={update}/><NumberField label="Largura da viga" name="lowerBeamWidthCm" value={input.lowerBeamWidthCm} unit="cm" min={1} onChange={update}/><NumberField label="Altura da viga" name="lowerBeamHeightCm" value={input.lowerBeamHeightCm} unit="cm" min={1} onChange={update}/></div></div><div className="subsection"><h3>Apoio superior</h3><div className="field-grid three"><NumberField label="Comprimento do patamar" name="upperLandingLengthCm" value={input.upperLandingLengthCm} unit="cm" min={0} onChange={update}/><NumberField label="Largura da viga" name="upperBeamWidthCm" value={input.upperBeamWidthCm} unit="cm" min={1} onChange={update}/><NumberField label="Altura da viga" name="upperBeamHeightCm" value={input.upperBeamHeightCm} unit="cm" min={1} onChange={update}/></div></div></section>
    <MaterialFields input={input} update={update}/>
  </>
}

function FlightFields({title,prefix,input,update}:{title:string;prefix:'lower'|'upper';input:AutoportanteURequest|AutoportanteLRequest;update:(name:string,value:number|string)=>void}){
  const tread=prefix==='lower'?'lowerTreadCm':'upperTreadCm';const riser=prefix==='lower'?'lowerRiserCm':'upperRiserCm';const count=prefix==='lower'?'lowerRiserCount':'upperRiserCount'
  const treadValue=prefix==='lower'?input.lowerTreadCm:input.upperTreadCm;const riserValue=prefix==='lower'?input.lowerRiserCm:input.upperRiserCm;const countValue=prefix==='lower'?input.lowerRiserCount:input.upperRiserCount
  return <div className="subsection"><h3>{title}</h3><div className="field-grid three"><NumberField label="Piso" name={tread} value={treadValue} unit="cm" min={10} onChange={update}/><NumberField label="Espelho" name={riser} value={riserValue} unit="cm" min={5} step={.5} onChange={update}/><NumberField label="Quantidade de espelhos" name={count} value={countValue} min={2} onChange={update}/></div></div>
}

function UFields({input,update}:{input:AutoportanteURequest;update:(name:string,value:number|string)=>void}){
  return <>
    <section className="form-card"><div className="section-title"><div><span className="step-number">01</span><h2>Geometria geral</h2></div><span className="section-hint">Escada autoportante em U</span></div><div className="field-grid three"><NumberField label="Largura dos lances" name="widthCm" value={input.widthCm} unit="cm" min={40} onChange={update}/><NumberField label="Distância entre lances" name="distanceBetweenFlightsCm" value={input.distanceBetweenFlightsCm} unit="cm" min={0} onChange={update}/><NumberField label="Patamar central" name="centralLandingLengthCm" value={input.centralLandingLengthCm} unit="cm" min={40} onChange={update}/><NumberField label="Espessura da laje" name="thicknessCm" value={input.thicknessCm} unit="cm" min={7} step={.5} onChange={update}/><NumberField label="Cobrimento nominal" name="coverCm" value={input.coverCm} unit="cm" min={1} step={.5} onChange={update}/></div></section>
    <section className="form-card"><div className="section-title"><div><span className="step-number">02</span><h2>Lances da escada</h2></div></div><FlightFields title="Lance inferior" prefix="lower" input={input} update={update}/><FlightFields title="Lance superior" prefix="upper" input={input} update={update}/></section>
    <MaterialFields input={input} update={update}/>
  </>
}

function LFields({input,update}:{input:AutoportanteLRequest;update:(name:string,value:number|string)=>void}){
  return <>
    <section className="form-card"><div className="section-title"><div><span className="step-number">01</span><h2>Geometria geral</h2></div><span className="section-hint">Escada autoportante em L</span></div><div className="field-grid three"><NumberField label="Largura dos lances" name="widthCm" value={input.widthCm} unit="cm" min={40} onChange={update}/><NumberField label="Patamar inferior" name="lowerLandingLengthCm" value={input.lowerLandingLengthCm} unit="cm" min={0} onChange={update}/><NumberField label="Patamar superior" name="upperLandingLengthCm" value={input.upperLandingLengthCm} unit="cm" min={0} onChange={update}/><NumberField label="Espessura da laje" name="thicknessCm" value={input.thicknessCm} unit="cm" min={7} step={.5} onChange={update}/><NumberField label="Cobrimento nominal" name="coverCm" value={input.coverCm} unit="cm" min={1} step={.5} onChange={update}/></div></section>
    <section className="form-card"><div className="section-title"><div><span className="step-number">02</span><h2>Lances da escada</h2></div></div><FlightFields title="Lance inferior" prefix="lower" input={input} update={update}/><FlightFields title="Lance superior" prefix="upper" input={input} update={update}/></section>
    <MaterialFields input={input} update={update}/>
  </>
}

function initials(name:string){return name.trim().split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase()}

export function StraightStairPage(){
  const [projects,setProjects]=useState<Project[]>(()=>loadProjects())
  const [activeId,setActiveId]=useState('')
  const [preview,setPreview]=useState<ReturnType<typeof createLocalPreview>|null>(null)
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false)
  const [modalOpen,setModalOpen]=useState(false)
  const [profileOpen,setProfileOpen]=useState(false)
  const [newName,setNewName]=useState('')
  const [newKind,setNewKind]=useState<StairKind>('UmLance')
  const [error,setError]=useState('')
  const [isDirty,setIsDirty]=useState(false)
  const [saveMessage,setSaveMessage]=useState('')
  const [artifactMessage,setArtifactMessage]=useState('')
  const activeProject=projects.find(project=>project.id===activeId)??projects[0]

  useEffect(()=>{if(!activeId&&projects[0])setActiveId(projects[0].id);if(activeId&&!projects.some(project=>project.id===activeId)&&projects[0])setActiveId(projects[0].id)},[projects,activeId])

  const updateInput=(name:string,value:number|string)=>{if(!activeProject)return;setProjects(current=>current.map(project=>project.id===activeProject.id?{...project,input:{...project.input,[name]:value},updatedAt:new Date().toISOString()}:project));setPreview(null);setIsDirty(true);setSaveMessage('')}
  const updatePreview=(event:FormEvent)=>{event.preventDefault();if(!activeProject)return;setError('');setPreview(createLocalPreview(activeProject.kind,activeProject.input))}
  const addProject=(event:FormEvent)=>{event.preventDefault();const name=newName.trim();if(!name){setError('Informe um nome para o projeto.');return}const project=createProject(name,newKind);setProjects(current=>[project,...current]);setActiveId(project.id);setNewName('');setNewKind('UmLance');setModalOpen(false);setSidebarOpen(false);setError('');setPreview(null);setIsDirty(true);setSaveMessage('')}
  const removeProject=(id:string)=>{const project=projects.find(item=>item.id===id);if(!project||projects.length===1)return;if(!window.confirm(`Excluir o projeto “${project.name}”?`))return;setProjects(current=>current.filter(item=>item.id!==id));setPreview(null);setIsDirty(true);setSaveMessage('');if(id===activeProject?.id)setActiveId(projects.find(item=>item.id!==id)?.id??'')}
  const saveCurrentProject=()=>{saveProjects(projects);setIsDirty(false);setSaveMessage('Projeto salvo neste navegador.');window.setTimeout(()=>setSaveMessage(''),3500)}
  const handleArtifact=(kind:ArtifactKind)=>{
    if(!activeProject)return
    if(kind==='memorial'){downloadMemorial(activeProject,preview);setArtifactMessage('Memorial local gerado e baixado.')}
    else if(kind==='dxf')setArtifactMessage('A geração DXF ficará ligada às instruções 2D do motor de cálculo.')
    else setArtifactMessage('A geração GLB ficará ligada ao modelo 3D do motor de cálculo.')
  }

  if(!activeProject)return null
  return <div className="app-shell">
    <header className="topbar"><button className="icon-button menu-toggle" type="button" onClick={()=>setSidebarOpen(true)} aria-label="Abrir árvore de projetos">☰</button><a className="brand" href="#top" aria-label="WebCivil, página inicial"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="WebCivil Apps de Engenharia"/></a><div className="current-project"><span>Projeto em edição</span><strong>{activeProject.name}</strong><small>{stairKindLabels[activeProject.kind]}</small></div><nav aria-label="Navegação principal"><a className="active" href="#dimensionamento">Dimensionamento</a><a href="#resultados">Prévia</a></nav><div className="profile-area"><button className="profile-trigger" type="button" onClick={()=>setProfileOpen(open=>!open)} aria-expanded={profileOpen}><span className="profile-avatar">{initials('Matheus')}</span><span className="profile-name">Matheus</span><span className="profile-chevron">⌄</span></button>{profileOpen&&<div className="profile-menu" role="menu"><strong>Matheus</strong><small>Área de trabalho local</small><button type="button" role="menuitem" onClick={()=>setProfileOpen(false)}>Fechar menu</button></div>}</div></header>
    <div className={`content-shell ${sidebarCollapsed?'sidebar-is-collapsed':''}`}><ProjectSidebar projects={projects} activeId={activeProject.id} open={sidebarOpen} collapsed={sidebarCollapsed} isDirty={isDirty} onSelect={setActiveId} onCreate={()=>{setModalOpen(true);setError('')}} onDelete={removeProject} onClose={()=>setSidebarOpen(false)} onCollapse={()=>setSidebarCollapsed(true)} onExpand={()=>setSidebarCollapsed(false)} onSave={saveCurrentProject}/><main id="top" className="main-content">
      <section className="hero"><div><span className="eyebrow">WebPliss · {stairKindLabels[activeProject.kind]}</span><h1>Organize o projeto e explore a escada com clareza.</h1><p>Edite medidas, alterne entre os tipos de escada e mantenha cada projeto salvo neste navegador. A prévia funciona sem conexão com a API.</p></div><div className="hero-step"><strong>{String(projects.length).padStart(2,'0')}</strong><span>projetos<br/>na árvore local</span></div></section>
      <form id="dimensionamento" onSubmit={updatePreview}><div className="workspace"><div className="form-column">{activeProject.kind==='UmLance'?<StraightFields input={activeProject.input as StraightStairRequest} update={updateInput}/>:activeProject.kind==='AutoportanteU'?<UFields input={activeProject.input as AutoportanteURequest} update={updateInput}/>:<LFields input={activeProject.input as AutoportanteLRequest} update={updateInput}/>}</div><aside className="side-column"><StairPreview kind={activeProject.kind} input={activeProject.input}/><div className="action-card"><div><span className="eyebrow">Projeto local</span><h2>Atualizar prévia</h2><p>Acompanhe a geometria no navegador. O salvamento acontece somente quando você solicitar.</p></div>{error&&<div className="error" role="alert">{error}</div>}<button className="button primary" type="submit">Atualizar prévia <span>→</span></button><button className="button save-button" type="button" onClick={saveCurrentProject}>{isDirty?'Salvar projeto':'Projeto salvo'} <span>{isDirty?'↓':'✓'}</span></button><button className="button secondary" type="button" onClick={()=>activeProject&&downloadProject(activeProject)}>Baixar projeto JSON <span>↓</span></button>{saveMessage&&<div className="save-message" role="status">{saveMessage}</div>}<small className="privacy">Nenhuma chamada de rede é feita por esta página.</small></div><ProjectActions project={activeProject} preview={preview} onAction={handleArtifact}/>{artifactMessage&&<div className="artifact-message" role="status">{artifactMessage}</div>}</aside></div></form>
      <div id="resultados">{preview&&<ResultPanel preview={preview}/>}</div>
    </main></div><footer><span>WebCivil · Apps de Engenharia</span><span>{activeProject.name} · salvo localmente</span></footer>
    {modalOpen&&<div className="modal-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setModalOpen(false)}}><form className="project-modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title" onSubmit={addProject} onMouseDown={event=>event.stopPropagation()}><div className="modal-heading"><div><span className="eyebrow">Árvore de projetos</span><h2 id="new-project-title">Criar novo projeto</h2></div><button className="icon-button" type="button" onClick={()=>setModalOpen(false)} aria-label="Fechar">×</button></div><label className="field"><span>Nome do projeto</span><input type="text" value={newName} onChange={event=>setNewName(event.target.value)} placeholder="Ex.: Escada da obra A" autoFocus required/></label><SelectField label="Tipo de escada" value={newKind} onChange={value=>setNewKind(value as StairKind)} options={Object.entries(stairKindLabels).map(([value,label])=>({value,label}))}/><div className="modal-actions"><button className="button secondary" type="button" onClick={()=>setModalOpen(false)}>Cancelar</button><button className="button primary" type="submit">Criar projeto <span>→</span></button></div></form></div>}
  </div>
}
