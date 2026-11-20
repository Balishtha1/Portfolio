import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { sectors } from '../data/portfolio';
export type Flight = { progress: number; reduced: boolean; mobile: boolean; speed: number };
export function useJourney(){
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [mobile,setMobile]=useState(()=>window.innerWidth<768);
 const [progress,setProgress]=useState(0);
 const flight=useRef<Flight>({progress:0,reduced,mobile,speed:0});
 const lenis=useRef<Lenis|null>(null);
 useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(query.matches);setMobile(window.innerWidth<768)};query.addEventListener('change',update);window.addEventListener('resize',update);return()=>{query.removeEventListener('change',update);window.removeEventListener('resize',update)}},[]);
 useEffect(()=>{flight.current.reduced=reduced;flight.current.mobile=mobile},[reduced,mobile]);
 useEffect(()=>{
  let last=window.scrollY;let raf=0;
  const update=()=>{
   const marks=sectors.map(s=>document.getElementById(s.id)?.offsetTop??0);
   const y=window.scrollY;
   let i=marks.findIndex((v,k)=>k<marks.length-1?y>=v&&y<marks[k+1]:y>=v);
   i=Math.max(0,i);
   const size=marks[i+1]-marks[i];
   const fract=i>=marks.length-1?0:Math.min(1,Math.max(0,size>0?(y-marks[i])/size:0));
   const next=(i+fract)/(marks.length-1);
   flight.current.speed=Math.min(1,Math.abs(y-last)/1100);
   flight.current.progress=next;setProgress(next);last=y;
  };
  if(!reduced){lenis.current=new Lenis({duration:1.2,smoothWheel:true,syncTouch:false});const tick=(time:number)=>{lenis.current?.raf(time);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)}
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  const ro=new ResizeObserver(update);ro.observe(document.body);update();
  return()=>{cancelAnimationFrame(raf);lenis.current?.destroy();lenis.current=null;window.removeEventListener('scroll',update);window.removeEventListener('resize',update);ro.disconnect()};
 },[reduced]);
 const go=(id:string)=>{const target=document.getElementById(id);if(!target)return;if(lenis.current)lenis.current.scrollTo(target,{duration:1.35});else target.scrollIntoView({behavior:reduced?'instant':'smooth'})};
 return {flight,reduced,mobile,progress,active:Math.min(sectors.length-1,Math.round(progress*(sectors.length-1))),go};
}
