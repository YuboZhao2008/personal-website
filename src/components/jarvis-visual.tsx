const modules = [
  { label: "Voice", note: "Speech interaction", x: 22, y: 40 },
  { label: "Vision", note: "Visual context", x: 22, y: 146 },
  { label: "Memory", note: "Persistent context", x: 22, y: 252 },
  { label: "LLM", note: "Local + API models", x: 362, y: 40 },
  { label: "Tools", note: "Tool execution", x: 362, y: 146 },
  { label: "Automation", note: "Useful workflows", x: 362, y: 252 },
];

/** Conceptual architecture, not a screenshot or a claim of live system activity. */
export function JarvisVisual() {
  return (
    <div className="jarvis-visual">
      <div className="architecture-heading">
        <span>JARVIS / SYSTEM MAP</span>
        <span>CONCEPT</span>
      </div>
      <svg viewBox="0 0 520 340" aria-hidden="true">
        <g className="architecture-wires">
          <path d="M158 69H180Q194 69 194 83V156H213 M158 175H213 M158 281H180Q194 281 194 267V194H213 M307 156H326V83Q326 69 340 69H362 M307 175H362 M307 194H326V267Q326 281 340 281H362" />
        </g>
        <g className="architecture-signal">
          <circle r="3" cx="180" cy="175" />
          <circle r="3" cx="341" cy="175" />
        </g>
        <rect
          className="architecture-core-ring"
          x="204"
          y="119"
          width="112"
          height="112"
          rx="27"
        />
        <rect
          className="architecture-core"
          x="214"
          y="129"
          width="92"
          height="92"
          rx="20"
        />
        <text
          className="architecture-core-title"
          x="260"
          y="174"
          textAnchor="middle"
        >
          J
        </text>
        <text
          className="architecture-core-label"
          x="260"
          y="200"
          textAnchor="middle"
        >
          JARVIS
        </text>
        {modules.map(({ label, note, x, y }) => (
          <g className="architecture-module" key={label}>
            <rect x={x} y={y} width="136" height="58" rx="7" />
            <text x={x + 14} y={y + 24}>
              {label}
            </text>
            <text className="architecture-note" x={x + 14} y={y + 42}>
              {note}
            </text>
          </g>
        ))}
      </svg>
      <div className="architecture-footer">
        <span>INPUT</span>
        <span>CONTEXT</span>
        <span>ACTION</span>
      </div>
    </div>
  );
}
