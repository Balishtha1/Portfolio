import { Component, type ErrorInfo, type ReactNode } from 'react';
export class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(error:Error,info:ErrorInfo){console.error('WebGL scene unavailable',error,info);this.props.onError();}
 render(){return this.state.failed?null:this.props.children;}
}
