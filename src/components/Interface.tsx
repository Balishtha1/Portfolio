import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, AudioLines, Terminal, VolumeX, X } from "lucide-react";
import { portfolio, sectors } from "../data/portfolio";

export function Loader({ ready, reduced }: { ready: boolean; reduced: boolean }) {
  const [progress, setProgress] = useState(8);
  useEffect(() => {
    if (ready) {
      setProgress(100);
      return;
    }
    const timer = window.setInterval(
      () => setProgress((p) => Math.min(90, p + Math.max(1, (90 - p) * 0.12))),
      180,
    );
    return () => window.clearInterval(timer);
  }, [ready]);
  return (
    <AnimatePresence>
      {(!ready || progress < 100) && (
        <motion.div
          className="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.65 }}
          role="status"
          aria-label="Initializing interactive scene"
        >
          <div className="loader-orbit"><span /></div>
          <p className="eyebrow">INITIALIZING LATENT SPACE</p>
          <span className="loader-percent">{Math.round(progress)}%</span>
          <span className="muted text-sm">Establishing a connection to curiosity.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SoundButton() {
  const [on, setOn] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const nodes = useRef<OscillatorNode[]>([]);
  const gain = useRef<GainNode | null>(null);

  useEffect(
    () => () => {
      nodes.current.forEach((node) => node.stop());
      void audio.current?.close();
    },
    [],
  );

  useEffect(() => {
    const visibility = () => {
      if (!audio.current) return;
      if (document.hidden) void audio.current.suspend();
      else if (on) void audio.current.resume();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [on]);

  async function toggle() {
    try {
      if (!audio.current) {
        const context = new AudioContext();
        audio.current = context;
        gain.current = context.createGain();
        gain.current.gain.value = 0;
        gain.current.connect(context.destination);
        [55, 82.41, 110.18].forEach((frequency) => {
          const node = context.createOscillator();
          node.type = "sine";
          node.frequency.value = frequency;
          node.connect(gain.current!);
          node.start();
          nodes.current.push(node);
        });
      }
      await audio.current.resume();
      gain.current!.gain.setTargetAtTime(
        on ? 0 : 0.018,
        audio.current.currentTime,
        0.5,
      );
      setOn(!on);
    } catch {
      setOn(false);
    }
  }

  return (
    <button
      className="icon-button"
      onClick={toggle}
      aria-label={on ? "Mute ambient audio" : "Enable ambient audio"}
      aria-pressed={on}
      title={on ? "Sound on" : "Sound off"}
    >
      {on ? <AudioLines size={17} /> : <VolumeX size={17} />}
    </button>
  );
}

function MiniTerminal({ go }: { go: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("Type help to inspect available commands.");
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = command.trim().toLowerCase();
    const destinations: Record<string, string> = {
      skills: "jupiter",
      projects: "mars",
      home: "sun",
      contact: "neptune",
      about: "earth",
    };
    if (value === "help") setOutput("help · skills · projects · about · contact · home · clear");
    else if (value === "clear") setOutput("");
    else if (destinations[value]) {
      go(destinations[value]);
      setOutput(`Navigating to ${value}…`);
    } else setOutput(`Unknown command: ${value || "(empty)"}. Try help.`);
    setCommand("");
  }

  return (
    <div className="terminal-wrap">
      <button
        ref={trigger}
        className="icon-button"
        aria-expanded={open}
        aria-controls="mission-terminal"
        aria-label="Toggle mission terminal"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <Terminal size={17} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mission-terminal"
            className="terminal glass"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onKeyDown={(event) => {
              if (event.key === "Escape") close();
            }}
          >
            <div className="terminal-title">
              <span>manas@universe:~</span>
              <button className="icon-button" aria-label="Close terminal" onClick={close}>
                <X size={15} />
              </button>
            </div>
            <p role="status">{output}</p>
            <form onSubmit={submit}>
              <span aria-hidden="true">❯</span>
              <input
                ref={input}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                aria-label="Terminal command"
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Interface({
  active,
  progress,
  go,
}: {
  active: number;
  progress: number;
  go: (id: string) => void;
}) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to portfolio content</a>
      <header className="site-header">
        <a href="#sun" className="brand" onClick={(e) => { e.preventDefault(); go("sun"); }}>
          <span className="brand-mark brand-photo">
            <img src="/manas-avatar.jpg" alt="Portrait of Manas Soni" decoding="async" />
            <i className="brand-photo-ring" aria-hidden="true" />
          </span>
          <span className="brand-label">
            <strong>MANAS SONI</strong>
            <span>AI · ML ENGINEER</span>
          </span>
        </a>
        <div className="header-right">
          <span className="availability"><i /> OPEN TO OPPORTUNITIES</span>
          <button className="header-contact" onClick={() => go("neptune")}>
            Let’s talk <ArrowUpRight size={15} />
          </button>
        </div>
      </header>

      <nav className="sector-nav" aria-label="Portfolio sectors">
        {sectors.map((sector, index) => (
          <a
            key={sector.id}
            href={`#${sector.id}`}
            aria-label={`${sector.planet}: ${sector.label}`}
            aria-current={active === index ? "location" : undefined}
            className={active === index ? "active" : ""}
            onClick={(event) => {
              event.preventDefault();
              go(sector.id);
            }}
          >
            <span className="nav-label">{sector.label}</span>
            <span className="nav-dot" />
          </a>
        ))}
      </nav>

      <div className="bottom-hud">
        <div className="telemetry" aria-hidden="true">
          <span><i /> SYSTEM ONLINE</span>
          <span>ALT {sectors[active].altitude} KM</span>
        </div>
        <div className="journey-meter" aria-hidden="true">
          <span>{String(active + 1).padStart(2, "0")} / {sectors[active].planet}</span>
          <div><i style={{ transform: `scaleX(${progress})` }} /></div>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="hud-actions">
          <MiniTerminal go={go} />
          <SoundButton />
        </div>
      </div>
    </>
  );
}

export function Cursor({ disabled }: { disabled: boolean }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !window.matchMedia("(pointer: fine)").matches) return;
    let x = -100, y = -100, rx = -100, ry = -100, frame = 0;
    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      const interactive = (event.target as Element).closest("a,button,input,textarea");
      ring.current?.classList.toggle("expanded", !!interactive);
      if (dot.current) dot.current.style.opacity = "1";
      if (ring.current) ring.current.style.opacity = "1";
    };
    const leave = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [disabled]);

  if (disabled) return null;
  return <><div ref={dot} className="cursor-dot" /><div ref={ring} className="cursor-ring" /></>;
}

export function EasterEgg({ reduced }: { reduced: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const key = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).matches("input,textarea")) return;
      index = event.key === sequence[index] ? index + 1 : 0;
      if (index === sequence.length) {
        index = 0;
        setVisible(true);
        clearTimeout(timer);
        timer = setTimeout(() => setVisible(false), 3500);
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="egg-message glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
          {!reduced && <span className="shooting-star" />}
          &gt; Secret sector unlocked. Stay curious, traveler.
        </motion.div>
      )}
    </AnimatePresence>
  );
}