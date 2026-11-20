import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ArrowRight, ArrowLeft, Github, Linkedin, Mail, Phone, MapPin, Sparkles, GraduationCap, ExternalLink, X, Cpu, MoveUpRight, FileDown, Workflow, ShieldCheck, Database } from 'lucide-react';
import { portfolio as p, sectors, validLink } from '../data/portfolio';
import { ContactForm } from '../components/ContactForm';
const fade = { hidden:{opacity:0,y:36,filter:'blur(8px)'},show:{opacity:1,y:0,filter:'blur(0px)'} };
function Link({href,children,className='quiet-link'}:{href:string;children:ReactNode;className?:string}){
 if(!validLink(href))return null;
 return <a className={className} href={href} target={href.startsWith('http')?'_blank':undefined} rel={href.startsWith('http')?'noopener noreferrer':undefined}>{children}</a>;
}
function Socials(){return <div className="social-links" aria-label="Professional links"><Link href={p.links.github}><Github size={16}/> GitHub</Link><Link href={p.links.linkedin}><Linkedin size={16}/> LinkedIn</Link><Link href={`mailto:${p.email}`}><Mail size={16}/> Email</Link><Link href={p.phoneHref}><Phone size={15}/> Call</Link></div>}
function Section({index,title,kicker,children,wide=false,reduced}:{index:number;title?:string;kicker?:string;children:ReactNode;wide?:boolean;reduced:boolean}){
 const sector=sectors[index];return <section id={sector.id} className={`world-section world-${sector.id} ${wide?'world-wide':''}`} aria-labelledby={`${sector.id}-title`}>
  <div className="section-watermark" aria-hidden="true">{String(index+1).padStart(2,'0')}</div>
  <motion.div className="section-inner" variants={fade} initial={reduced?false:'hidden'} whileInView="show" viewport={{once:true,amount:.12}} transition={{duration:reduced?0:.85,ease:[.19,1,.22,1]}}>
   <div className="section-kicker"><span className="kicker-dash"/> SECTOR {String(index+1).padStart(2,'0')} <span className="kicker-sep">/</span> {kicker??sector.label.toUpperCase()}</div>
   {title&&<h2 id={`${sector.id}-title`} className="display-heading">{title}</h2>}
   {children}
  </motion.div>
  <div className="sector-stamp" aria-hidden="true"><span className="sector-stamp-line"/>{sector.planet} <span className="sector-stamp-number">{String(index+1).padStart(2,'0')} / 08</span></div>
 </section>
}
function Typewriter({reduced}:{reduced:boolean}){
 const [index,setIndex]=useState(0);const [letters,setLetters]=useState(0);const [deleting,setDeleting]=useState(false);
 useEffect(()=>{if(reduced)return;const word=p.roles[index];let delay=deleting?38:78;if(!deleting&&letters>=word.length)delay=1750;if(deleting&&letters===0)delay=350;
 const t=window.setTimeout(()=>{if(!deleting&&letters>=word.length)setDeleting(true);else if(deleting&&letters===0){setDeleting(false);setIndex(i=>(i+1)%p.roles.length)}else setLetters(n=>n+(deleting?-1:1))},delay);return()=>window.clearTimeout(t)},[index,letters,deleting,reduced]);
 return <span className="typing" aria-label={p.roles[index]}>{reduced?p.roles[0]:p.roles[index].slice(0,letters)}<span className="typing-cursor" aria-hidden="true">_</span></span>
}
function Portrait(){return <div className="portrait-frame"><img src={p.profileImage} alt="Portrait of Manas Soni" loading="lazy"/><span className="portrait-topline">PERSON BEHIND THE SYSTEMS</span><div className="portrait-bottom"><span className="portrait-live"/> MANAS SONI <span>AI / ML ENGINEER</span></div></div>}
function RecruiterLinks(){return <div className="recruiter-links" aria-label="Quick links for recruiters"><a href={p.links.resume} className="recruiter-link" target="_blank" rel="noopener noreferrer"><FileDown size={16}/> Resume <ArrowUpRight size={14}/></a><a href={p.links.github} className="recruiter-link" target="_blank" rel="noopener noreferrer"><Github size={16}/> GitHub <ArrowUpRight size={14}/></a><a href={p.links.linkedin} className="recruiter-link" target="_blank" rel="noopener noreferrer"><Linkedin size={16}/> LinkedIn <ArrowUpRight size={14}/></a><a href={`mailto:${p.email}`} className="recruiter-link"><Mail size={16}/> Email <ArrowUpRight size={14}/></a><a href={p.phoneHref} className="recruiter-link"><Phone size={16}/> {p.phone} <ArrowUpRight size={14}/></a></div>}
function MLPipeline(){const stages=[{label:'INGEST',detail:'Pandas · NumPy',icon:Database},{label:'MODEL',detail:'PyTorch · scikit-learn',icon:Cpu},{label:'TRACK',detail:'MLflow',icon:Workflow},{label:'PACKAGE',detail:'Docker · Kubernetes',icon:ShieldCheck},{label:'DEPLOY',detail:'AWS · Vertex AI · Azure ML',icon:ArrowUpRight}];return <div className="ml-pipeline" aria-label="Illustrative machine learning engineering pipeline"><div className="pipeline-heading"><span className="mini-label">MODEL → PRODUCTION</span><span>AN ENGINEERING TOOLCHAIN · TECHNOLOGIES FROM RESUME</span></div><div className="pipeline-track">{stages.map((step,i)=><div className="pipeline-step" key={step.label}><step.icon size={21}/><b>{String(i+1).padStart(2,'0')} / {step.label}</b><span>{step.detail}</span></div>)}</div></div>}
function ProjectVisual({slug}:{slug:string}){
 if(slug==='rag')return <div className="visual visual-rag"><span className="visual-label">QUERY INPUT</span><div className="rag-network"><i className="rag-core">LLM</i>{Array.from({length:6},(_,i)=><span className={`rag-node rn-${i}`} key={i}/>)}</div><span className="visual-bottom">RETRIEVE → AUGMENT → GENERATE</span></div>;
 if(slug==='agent')return <div className="visual visual-agent"><span className="visual-label">AGENT EXECUTION GRAPH</span><div className="agent-flow"><span>PLAN</span><i>→</i><span>TOOLS</span><i>→</i><span>REVIEW</span><i>→</i><span>SHIP</span></div><span className="visual-bottom">HUMAN APPROVAL REQUIRED <b className="pulse-dot"/></span></div>;
 return <div className="visual visual-fraud"><span className="visual-label">ANOMALY DETECTION</span><div className="fraud-graph">{Array.from({length:34},(_,i)=><span key={i} className={i===18||i===26?'anomaly':''} style={{height:`${20+((i*37)%68)}%`}}/>)}</div><span className="visual-bottom">284,807 DATA POINTS ANALYZED</span></div>;
}
type Project=typeof p.projects[number];
function ProjectCard({project,onOpen}:{project:Project;onOpen:(project:Project)=>void}){
 return <motion.button type="button" className="project-card" whileHover={{y:-8}} transition={{duration:.3}} onClick={()=>onOpen(project)} aria-label={`Explore ${project.name}`}>
  <div className="project-image"><ProjectVisual slug={project.slug}/><span className="project-index">{project.number}</span></div>
  <div className="project-details"><div className="project-kind">{project.kind}</div><div className="project-title-row"><h3>{project.name}</h3><span className="circle-arrow"><ArrowUpRight size={20}/></span></div><p>{project.description}</p><div className="tags">{project.stack.slice(0,4).map(s=><span key={s}>{s}</span>)}</div></div>
 </motion.button>
}
function ProjectModal({project,onClose}:{project:Project|null;onClose:()=>void}){
 useEffect(()=>{if(!project)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[project,onClose]);
 return <AnimatePresence>{project&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <motion.div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{opacity:0,scale:.96,y:24}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.96,y:24}} transition={{duration:.25}}>
   <button className="modal-close" aria-label="Close details" onClick={onClose}><X size={21}/></button><span className="mini-label">PROJECT / {project.number}</span><div className="modal-visual"><ProjectVisual slug={project.slug}/></div>
   <span className="section-kicker">{project.kind}</span><h2 id="modal-title">{project.name}</h2><p>{project.detail}</p><div className="tags">{project.stack.map(s=><span key={s}>{s}</span>)}</div><div className="modal-foot">{project.signal}<span>CASE STUDY</span></div>
  </motion.div></motion.div>}</AnimatePresence>;
}
export function PortfolioSections({reduced,go}:{reduced:boolean;go:(id:string)=>void}){
 const [selected,setSelected]=useState<Project|null>(null);
 return <>
  <Section index={0} reduced={reduced} kicker="INITIALIZE JOURNEY">
   <div className="hero-pretitle"><span className="status-spark"/> AVAILABLE FOR COLLABORATION <span className="hero-pretitle-line"/> 2026</div>
   <div className="hero-name-wrap">
    <div className="hero-aura" aria-hidden="true">
      <span className="aura-ring ring-one" />
      <span className="aura-ring ring-two" />
      <span className="aura-pulse" />
    </div>
    <h1 id="sun-title" className="hero-name"><span>MANAS</span><span className="hero-last">SONI<span className="hero-period">.</span></span></h1>
    <p className="hero-title-note">Applied AI engineer crafting LLM, RAG, agentic and MLOps experiences with product focus.</p>
   </div>
   <div className="hero-divider"/>
   <div className="hero-top-grid">
    <div>
      <div className="hero-type"><span className="prompt-chevron">›</span><Typewriter reduced={reduced}/></div>
      <p className="hero-description">{p.pitch}</p>
      <div className="hero-proof"><span><strong>03</strong> FEATURED AI BUILDS</span><span><strong>783</strong> NIMCET AIR</span><span><strong>NIT</strong> RAIPUR · MCA</span></div>
      <div className="hero-actions"><button className="btn btn-primary" onClick={()=>go('mars')}>Explore selected work <ArrowUpRight size={18}/></button><button className="btn btn-secondary" onClick={()=>go('earth')}>Discover my orbit <ArrowDown size={17}/></button></div>
      <RecruiterLinks/>
    </div>
    <div className="hero-side-card">
      <div className="hero-side-grid">
        <span><b>Focus</b> GenAI · RAG · Agents</span>
        <span><b>Model Ops</b> MLflow · Docker · Cloud</span>
        <span><b>Data</b> Python · Pandas · scikit-learn</span>
        <span><b>Open To</b> AI / ML Engineer roles</span>
      </div>
    </div>
   </div>
   <div className="hero-foot"><div className="hero-scroll"><span className="scroll-line"/>SCROLL TO EXPLORE · OR USE THE SECTION INDEX</div></div>
  </Section>
  <Section index={1} title="About the engineer." reduced={reduced} kicker="THE ORIGIN">
   <div className="intro-layout"><div><p className="lead">Applied AI, backed by engineering discipline.</p><p className="body-copy">{p.bio}</p><div className="about-focus"><span>LLMs & RAG</span><span>AGENTIC AI</span><span>ML & DATA SCIENCE</span><span>MLOPS</span></div><div className="location-row"><MapPin size={16}/>{p.location} <span className="location-divider"/> MCA · NIT RAIPUR</div><Socials/></div><Portrait/></div>
  </Section>
  <Section index={2} title="Education & achievements." reduced={reduced} kicker="ACADEMIC PATH">
   <div className="education-list">{p.education.map((e,i)=><div className="education-item" key={e.degree}><span className="ed-num">0{i+1}</span><div><h3>{e.degree}</h3><p>{e.school}</p><span className="ed-detail">{e.detail}</span></div><span className="ed-year">{e.years}</span></div>)}</div>
   <div className="achievement-panel"><GraduationCap size={25}/><div><span className="mini-label">ACADEMIC ACHIEVEMENT</span><h3>NIMCET AIR 783</h3><p>Ranked in the top 1.6% among 50,000+ participants (2024).</p></div></div>
  </Section>
  <Section index={3} title="Experience in AI evaluation." reduced={reduced} kicker="PROFESSIONAL EXPERIENCE">
   <div className="experience-card"><div className="experience-top"><span className="mini-label">01 / INDUSTRY EXPERIENCE</span><span className="experience-date">{p.work.period}</span></div><h3>{p.work.title}</h3><div className="experience-company">{p.work.company}</div><p className="body-copy">{p.work.summary}</p><ul className="experience-points">{p.work.points.map(pt=><li key={pt}><span>↗</span>{pt}</li>)}</ul><div className="tags">{p.work.skills.map(s=><span key={s}>{s}</span>)}</div></div>
  </Section>
  <Section index={4} title="Selected AI projects." reduced={reduced} wide kicker="PROJECT LAB / THREE BUILDS">
   <div className="projects-intro"><p className="body-copy">From retrieval to autonomous workflows to anomaly detection. Built to solve problems, not just fill a repository.</p><span className="mini-label">CLICK TO INSPECT EACH SYSTEM <ArrowUpRight size={14}/></span></div>
   <div className="project-grid">{p.projects.map(project=><ProjectCard key={project.number} project={project} onOpen={setSelected}/>)}</div>
  </Section>
  <Section index={5} title="AI / ML engineering toolkit." reduced={reduced} wide kicker="MY TECH STACK">
   <p className="body-copy stack-intro">Tools are just instruments. The real craft is making them work together.</p>
   <MLPipeline/><div className="skills-grid">{Object.entries(p.skills).map(([category,items],i)=><div key={category} className="skill-group"><div className="skill-heading"><Cpu size={17}/><span>0{i+1} / {category}</span></div><div className="tags">{items.map(item=><span key={item}>{item}</span>)}</div></div>)}</div>
  </Section>
  <Section index={6} title="Milestones & credentials." reduced={reduced} kicker="MILESTONES & GROWTH">
   <div className="milestones">{p.milestones.map((m,i)=><div className="milestone" key={i}><div className="milestone-rail"><i/></div><span className="milestone-year">{m.year}</span><div><h3>{m.title}</h3><p>{m.description}</p></div></div>)}</div>
   <div className="cert-panel"><Sparkles size={19}/><div><span className="mini-label">CERTIFICATIONS</span>{p.certifications.map(s=><p key={s}>{s}</p>)}</div></div>
  </Section>
  <Section index={7} title="Let’s work together." reduced={reduced} kicker="OPEN CHANNEL">
   <p className="contact-lead">Open to AI/ML engineering roles, internships and collaboration on practical intelligent systems.</p><a className="email-big" href={`mailto:${p.email}`}>{p.email}<MoveUpRight size={22}/></a><div className="contact-direct"><a href={p.phoneHref}><Phone size={17}/>{p.phone}</a><Link href={p.links.github}><Github size={17}/> GitHub profile</Link><Link href={p.links.linkedin}><Linkedin size={17}/> LinkedIn profile</Link><Link href={p.links.resume}><FileDown size={17}/> View resume</Link></div><ContactForm/><Socials/>
   <div className="footer-row"><span>© {new Date().getFullYear()} MANAS SONI</span><span>CRAFTED IN THE LATENT SPACE</span><button onClick={()=>go('sun')}>RETURN TO ORIGIN ↑</button></div>
  </Section>
  <ProjectModal project={selected} onClose={()=>setSelected(null)}/>
 </>;
}
