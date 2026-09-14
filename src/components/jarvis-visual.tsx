import {
  AudioLines,
  Camera,
  MessageSquare,
  Database,
  Cpu,
  ArrowRight,
} from "lucide-react";
export function JarvisVisual() {
  return (
    <div className="jarvis-visual">
      <div className="visual-topline mono">
        <span>SYSTEM ARCHITECTURE</span>
        <span>J / 01</span>
      </div>
      <div className="jarvis-inputs">
        {[
          { Icon: AudioLines, title: "Voice", note: "SPEECH-TO-TEXT" },
          { Icon: MessageSquare, title: "Text", note: "DIRECT INPUT" },
          { Icon: Camera, title: "Camera", note: "COMPUTER VISION" },
        ].map(({ Icon, title, note }) => (
          <div key={title}>
            <Icon size={21} strokeWidth={1.2} />
            <strong>{title}</strong>
            <span className="mono">{note}</span>
          </div>
        ))}
      </div>
      <div className="jarvis-bus" aria-hidden="true">
        <span />
        <span />
        <span />
        <i className="ambient" />
      </div>
      <div className="jarvis-engine">
        <span className="mono">LOCAL INFERENCE</span>
        <div className="jarvis-engine-name">
          <Cpu size={24} strokeWidth={1} /> JARVIS
          <span className="engine-indicator ambient" />
        </div>
        <span className="mono">OLLAMA / LLM INTEGRATION</span>
      </div>
      <div className="jarvis-context">
        <div>
          <Database size={16} />
          <span>Persistent memory</span>
        </div>
        <span className="context-link" aria-hidden="true">
          ↔
        </span>
        <div>
          <span>External APIs</span>
          <ArrowRight size={16} />
        </div>
      </div>
      <div className="jarvis-output mono">
        <AudioLines size={18} />
        <span>RESPONSE / TEXT + SPEECH</span>
        <span className="waveform" aria-hidden="true">
          {Array.from({ length: 17 }, (_, i) => (
            <i
              key={i}
              className="ambient"
              style={{
                height: `${6 + ((i * 7) % 19)}px`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </span>
      </div>
      <p className="diagram-note mono">ARCHITECTURE OVERVIEW</p>
    </div>
  );
}
