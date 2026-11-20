export const surfaceVertex = /* glsl */`
 varying vec3 vNormal; varying vec3 vPosition;
 void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
`;
export const surfaceFragment = /* glsl */`
 precision highp float;
 uniform float uTime;uniform float uKind;varying vec3 vNormal;varying vec3 vPosition;
 float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.05;a*=.5;}return v;}
 void main(){vec3 n=normalize(vPosition);float f=fbm(n*4.+vec3(uTime*.012,0.,0.));float detail=fbm(n*18.);vec3 col;
 if(uKind<.5){float flame=pow(f,1.4);col=mix(vec3(.63,.08,.012),vec3(1.,.47,.055),smoothstep(.25,.7,flame));col+=vec3(.8,.48,.10)*pow(detail,3.)*.72;}
 else if(uKind<1.5){float land=smoothstep(.47,.58,f);float ice=smoothstep(.72,.9,abs(n.y));col=mix(vec3(.045,.16,.32),vec3(.11,.38,.30),land);col=mix(col,vec3(.8,.87,.9),ice*.65);col+=vec3(.2,.26,.27)*pow(detail,4.)*.3;}
 else if(uKind<2.5){col=mix(vec3(.24,.27,.30),vec3(.60,.62,.65),smoothstep(.3,.75,f));}
 else if(uKind<3.5){col=mix(vec3(.29,.10,.085),vec3(.75,.31,.16),smoothstep(.2,.75,f));}
 else if(uKind<4.5){float stripe=sin(n.y*26.+f*6.);col=mix(vec3(.36,.23,.17),vec3(.85,.66,.43),smoothstep(-.7,.7,stripe));}
 else if(uKind<5.5){float stripe=sin(n.y*23.+f*3.);col=mix(vec3(.43,.34,.26),vec3(.76,.65,.48),smoothstep(-.6,.6,stripe));}
 else {col=mix(vec3(.035,.18,.38),vec3(.12,.54,.72),smoothstep(.25,.75,f));}
 float light=.54+.46*max(dot(normalize(vNormal),normalize(vec3(-.5,.7,.8))),0.);col*=light;
 if(uKind<.5)col*=1.65;
 gl_FragColor=vec4(col,1.);
 }
`;
export const atmosphereFragment = /* glsl */`
 precision highp float;
 uniform vec3 uColor;varying vec3 vNormal;varying vec3 vPosition;
 void main(){vec3 N=normalize(vNormal);float rim=pow(1.-abs(dot(N,vec3(0.,0.,1.))),3.2);gl_FragColor=vec4(uColor*rim*.72,rim*.35);}
`;
export const nebulaVertex = /* glsl */`
 varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
export const nebulaFragment = /* glsl */`
 precision mediump float;uniform float uTime;varying vec2 vUv;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
 float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
 void main(){vec2 uv=vUv-.5;float r=length(uv*vec2(1.3,1.));float mist=n(vUv*4.+uTime*.002)*.5+n(vUv*9.)*.2;float a=smoothstep(.7,.05,r)*mist*.13;gl_FragColor=vec4(vec3(.10,.17,.31),a);}
`;
export const starVertex = /* glsl */`
 attribute float aSeed;uniform float uTime;uniform float uPixelRatio;uniform float uWarp;varying float vAlpha;
 void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;float twinkle=.7+.3*sin(uTime*(.8+aSeed*1.6)+aSeed*30.);gl_PointSize=min(3.0,(1.1+aSeed*1.2)*uPixelRatio*max(.35,20./(-p.z))*1.3);vAlpha=twinkle*(.45+aSeed*.55);}
`;
export const starFragment = /* glsl */`
 precision mediump float;varying float vAlpha;
 void main(){float r=length(gl_PointCoord-.5);float a=smoothstep(.5,.06,r);gl_FragColor=vec4(vec3(.64,.81,1.),a*vAlpha*.9);}
`;
