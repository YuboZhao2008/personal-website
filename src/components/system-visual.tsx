export function SystemVisual() {
  return (
    <div
      className="system-visual"
      role="img"
      aria-label="An abstract connected system linking software, intelligence, and the physical world"
    >
      <div className="visual-topline">
        <span>
          <i /> SYSTEM EXPLORATION
        </span>
        <span>YZ / 001</span>
      </div>
      <div className="orbital-scene">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <div className="axis axis-x" />
        <div className="axis axis-y" />
        <div className="core-halo" />
        <div className="system-core">
          <span className="core-mark">
            y<span>z</span>
          </span>
          <span className="core-caption">BUILD. ITERATE.</span>
        </div>
        <span className="orbit-node node-one" />
        <span className="orbit-node node-two" />
        <span className="orbit-node node-three" />
        <div className="system-label label-software">
          <span>01</span> SOFTWARE
        </div>
        <div className="system-label label-ai">
          <span>02</span> INTELLIGENCE
        </div>
        <div className="system-label label-world">
          <span>03</span> PHYSICAL WORLD
        </div>
        <span className="coordinate coordinate-one">+ 43.4723° N</span>
        <span className="coordinate coordinate-two">80.5449° W +</span>
      </div>
      <div className="visual-bottomline">
        <span>
          IDEA <b>→</b> SYSTEM <b>→</b> IMPACT
        </span>
        <span className="signal-bars">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
