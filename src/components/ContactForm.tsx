import { ArrowUpRight, Copy, Mail } from 'lucide-react';
import { portfolio as p } from '../data/portfolio';
export function ContactForm(){
 const subject=encodeURIComponent('Let’s build something');
 const body=encodeURIComponent('Hi Manas,\n\nI would love to connect about...');
 return <div className="contact-actions">
   <a className="btn btn-primary" href={`mailto:${p.email}?subject=${subject}&body=${body}`}><Mail size={17}/> Open email <ArrowUpRight size={17}/></a>
   <button className="btn btn-ghost" onClick={()=>{void navigator.clipboard?.writeText(p.email)}}><Copy size={17}/> Copy address</button>
 </div>;
}
