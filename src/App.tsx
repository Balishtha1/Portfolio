import { useEffect, useState } from 'react';
import { useJourney } from './hooks/useJourney';
import Universe from './scene/Universe';
import { SceneBoundary } from './components/SceneBoundary';
import { Interface, Loader, Cursor, EasterEgg } from './components/Interface';
import { PortfolioSections } from './sections/PortfolioSections';
export default function App(){
 const {flight,mobile,reduced,progress,active,go}=useJourney();
 const [failed,setFailed]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>{if(failed)setReady(true)},[failed]);
 return <>
  <div className="universe" aria-hidden="true">
   {!failed && <SceneBoundary onError={()=>setFailed(true)}><Universe flight={flight} mobile={mobile} reduced={reduced} onReady={()=>setReady(true)} onLost={()=>setFailed(true)}/></SceneBoundary>}
  </div>
  <div className="ambient-vignette" aria-hidden="true"/>
  <Interface active={active} progress={progress} go={go}/>
  <main id="main"><PortfolioSections reduced={reduced} go={go}/></main>
  <Cursor disabled={mobile || reduced}/>
  <EasterEgg reduced={reduced}/>
  <Loader ready={ready} reduced={reduced}/>
 </>;
}
