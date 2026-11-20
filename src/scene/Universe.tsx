import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, PerformanceMonitor } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import type { Flight } from "../hooks/useJourney";
import {
  surfaceVertex,
  surfaceFragment,
  atmosphereFragment,
  nebulaVertex,
  nebulaFragment,
  starVertex,
  starFragment,
} from "../shaders/space";

type Props = {
  flight: MutableRefObject<Flight>;
  mobile: boolean;
  reduced: boolean;
  onReady: () => void;
  onLost: () => void;
};

const centers = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(7, 2, -27),
  new THREE.Vector3(7, 2, -27),
  new THREE.Vector3(11, 3, -30),
  new THREE.Vector3(-4, -1, -60),
  new THREE.Vector3(5, 1, -90),
  new THREE.Vector3(-5, 0, -122),
  new THREE.Vector3(3, 2, -155),
];

const bodies = [
  { center: 0, kind: 0, radius: 3, name: "SUN", fact: "The core. Where ideas ignite." },
  { center: 1, kind: 1, radius: 2.4, name: "EARTH", fact: "Our only home. Stay curious." },
  { center: 3, kind: 2, radius: 0.9, name: "MOON", fact: "Small steps. Lasting impact." },
  { center: 4, kind: 3, radius: 2.1, name: "MARS", fact: "A place for bold experiments." },
  { center: 5, kind: 4, radius: 3.2, name: "JUPITER", fact: "A giant stack of possibilities." },
  { center: 6, kind: 5, radius: 2.5, name: "SATURN", fact: "Every orbit leaves a milestone." },
  { center: 7, kind: 6, radius: 2.5, name: "NEPTUNE", fact: "The next frontier is a conversation." },
];

function CameraRail({ flight }: Pick<Props, "flight">) {
  const { camera, pointer } = useThree();
  const paths = useMemo(() => {
    const positions = centers.map((center, i) =>
      center.clone().add(new THREE.Vector3(-3.7, i === 2 ? 1.4 : 0.5, i === 3 ? 8 : 12)),
    );
    return {
      camera: new THREE.CatmullRomCurve3(positions, false, "catmullrom", 0.2),
      target: new THREE.CatmullRomCurve3(
        centers.map((v) => v.clone().add(new THREE.Vector3(-3.3, 0, 0))),
        false,
        "catmullrom",
        0.2,
      ),
    };
  }, []);
  const position = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const f = flight.current;
    const damping = f.reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 4.5);
    position.current = THREE.MathUtils.lerp(position.current, f.progress, damping);
    // Continuous arc-length sampling removes the abrupt stop/start
    // acceleration at every sector boundary.
    const t = THREE.MathUtils.clamp(position.current, 0, 1);
    paths.camera.getPoint(t, desired);
    paths.target.getPoint(t, target);
    if (f.mobile) {
      desired.x += 1.5;
      desired.z += 5;
      target.x += 2;
    }
    if (!f.reduced) {
      desired.x += pointer.x * 0.22;
      desired.y += pointer.y * 0.16;
    }
    camera.position.lerp(desired, f.reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 6));
    camera.lookAt(target);
    f.speed *= Math.exp(-delta * 4);
  });
  return null;
}

function Starfield({ flight, count }: { flight: Props["flight"]; count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let seed = 137;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      const layer = i % 3;
      const angle = random() * Math.PI * 2;
      const radius = 22 + layer * 24 + random() * 18;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = 35 - random() * 250;
      seeds[i] = random();
    }
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return result;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uWarp: { value: 0 },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!material.current) return;
    uniforms.uTime.value = flight.current.reduced ? 0 : clock.elapsedTime;
    uniforms.uWarp.value = flight.current.reduced ? 0 : flight.current.speed;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={starVertex}
        fragmentShader={starFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Orbit({ radius, tilt = 0 }: { radius: number; tilt?: number }) {
  const points = useMemo(
    () =>
      Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      }),
    [radius],
  );
  return (
    <group rotation={[tilt, 0, 0]}>
      <Line
        points={points}
        color="#4de8ff"
        transparent
        opacity={0.16}
        lineWidth={0.6}
        dashed
        dashSize={0.22}
        gapSize={0.18}
      />
    </group>
  );
}

function Planet({
  body,
  flight,
  low,
}: {
  body: (typeof bodies)[number];
  flight: Props["flight"];
  low: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const [hello, setHello] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timeout.current), []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uKind: { value: body.kind } }),
    [body.kind],
  );
  const atmosphere = useMemo(
    () => ({
      uColor: {
        value: new THREE.Color(
          body.kind === 0 ? "#ff9d32" : body.kind === 3 ? "#e77b4a" : "#4daeff",
        ),
      },
    }),
    [body.kind],
  );

  useFrame(({ clock }, delta) => {
    if (flight.current.reduced) return;
    uniforms.uTime.value = clock.elapsedTime;
    if (group.current) group.current.rotation.y += delta * 0.045;
  });

  return (
    <group position={centers[body.center]}>
      <group ref={group}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
          }}
          onPointerOut={() => setHover(false)}
          onClick={() => {
            if (body.kind !== 1 && body.kind !== 2) return;
            setHello(true);
            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setHello(false), 3000);
          }}
        >
          <sphereGeometry args={[body.radius, low ? 40 : 80, low ? 24 : 48]} />
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={surfaceVertex}
            fragmentShader={surfaceFragment}
          />
        </mesh>
      </group>
      <mesh scale={1.055}>
        <sphereGeometry args={[body.radius, 40, 32]} />
        <shaderMaterial
          uniforms={atmosphere}
          vertexShader={surfaceVertex}
          fragmentShader={atmosphereFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {body.kind === 0 && (
        <>
          <pointLight color="#ffb547" intensity={70} distance={65} decay={1.5} />
          <Orbit radius={4.3} tilt={0.25} />
        </>
      )}

      {body.kind === 1 && <Orbit radius={4.2} tilt={0.13} />}

      {body.kind === 4 &&
        [0, 1, 2].map((i) => (
          <group key={i} rotation={[0.2, i * 2.1, 0]}>
            <Orbit radius={4.1 + i * 0.65} />
            <mesh position={[4.1 + i * 0.65, 0, 0]}>
              <sphereGeometry args={[0.13 + i * 0.04, 16, 12]} />
              <meshStandardMaterial color="#b3aaa0" roughness={0.9} />
            </mesh>
          </group>
        ))}

      {body.kind === 5 && (
        <group rotation={[1.17, 0.25, -0.3]}>
          {Array.from({ length: 9 }, (_, i) => (
            <mesh key={i}>
              <ringGeometry args={[3.05 + i * 0.19, 3.18 + i * 0.19, 128]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? "#85725a" : "#d9c493"}
                transparent
                opacity={0.35 + (i % 3) * 0.16}
                side={THREE.DoubleSide}
                roughness={1}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      )}

      {(hover || hello) && (
        <Html position={[0, body.radius + 0.65, 0]} center style={{ pointerEvents: "none" }}>
          <div className="planet-tooltip">
            <b>{hello ? "> Hello, World_" : body.name}</b>
            <span>{hello ? "Curiosity is the first line of code." : body.fact}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function NeuralNetwork({ flight }: Pick<Props, "flight">) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = i * 2.399;
        return new THREE.Vector3(
          Math.cos(angle) * (1 + (i % 3)),
          Math.sin(angle) * 2,
          Math.sin(i * 1.7) * 1.4,
        );
      }),
    [],
  );
  useFrame(({ clock }) => {
    if (group.current && !flight.current.reduced) {
      group.current.rotation.y = clock.elapsedTime * 0.04;
      group.current.position.y = 3 + Math.sin(clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <group ref={group} position={[-2, 3, -72]}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node}>
            <icosahedronGeometry args={[0.065, 0]} />
            <meshBasicMaterial color={i % 2 ? "#4de8ff" : "#8b7cff"} />
          </mesh>
          <Line
            points={[node, nodes[(i + 1) % nodes.length], nodes[(i + 4) % nodes.length]]}
            color="#8b7cff"
            transparent
            opacity={0.22}
            lineWidth={0.7}
          />
        </group>
      ))}
    </group>
  );
}

function Nebula({ flight }: Pick<Props, "flight">) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => {
    uniforms.uTime.value = flight.current.reduced ? 0 : clock.elapsedTime;
  });
  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i % 2 ? -14 : 12, 7 - i * 5, -45 - i * 65]}>
          <planeGeometry args={[100, 65]} />
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={nebulaVertex}
            fragmentShader={nebulaFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
}

function Ready({ onReady, onLost }: Pick<Props, "onReady" | "onLost">) {
  const { gl } = useThree();
  const sent = useRef(false);
  useFrame(() => {
    if (!sent.current) {
      sent.current = true;
      onReady();
    }
  });
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);
  return null;
}

export default function Universe(props: Props) {
  const [degraded, setDegraded] = useState(false);
  const low = props.mobile || props.reduced || degraded;
  return (
    <Canvas
      dpr={low ? 1 : [1, 1.75]}
      camera={{ position: [-3.7, 0.5, 12], fov: 44, near: 0.1, far: 330 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Ready onReady={props.onReady} onLost={props.onLost} />
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[-5, 10, 6]} intensity={2} color="#a9dcff" />
      <CameraRail flight={props.flight} />
      <Starfield flight={props.flight} count={low ? 2200 : 6500} />
      <Nebula flight={props.flight} />
      <NeuralNetwork flight={props.flight} />
      {bodies.map((body) => (
        <Planet key={body.name} body={body} flight={props.flight} low={low} />
      ))}
      {!low && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.65} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.65} />
          <Noise opacity={0.018} />
        </EffectComposer>
      )}
    </Canvas>
  );
}