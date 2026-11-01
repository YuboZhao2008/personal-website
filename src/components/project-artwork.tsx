import type { Project } from "@/data/profile";

/** Editorial diagrams, deliberately distinct from screenshots or inference output. */
export function ProjectArtwork({ variant }: { variant: Project["visual"] }) {
  return (
    <svg className={`project-artwork artwork-${variant}`} viewBox="0 0 800 430" aria-hidden="true" fill="none">
      {variant === "warcraft" && <>
        <path className="art-faint" d="M70 80H730V350H70Z M180 80V350M290 80V350M400 80V350M510 80V350M620 80V350M70 170H730M70 260H730" />
        <path className="art-terrain" d="M70 80h150v62l-50 28H70Zm550 0h110v90H620ZM70 280h110v70H70Zm430-35h120v105H500Z" />
        <path className="art-route" d="M180 260h110l110-90h220" />
        <g className="art-unit"><path d="m180 221 28 16v32l-28 16-28-16v-32Z" /><path d="m152 237 28 16 28-16m-28 16v32" /></g>
        <circle className="art-target" cx="620" cy="170" r="29" /><path className="art-target" d="M620 125v90m-45-45h90" />
        <circle className="art-dot" cx="290" cy="260" r="5" /><circle className="art-dot" cx="400" cy="170" r="5" />
        <path className="art-callout" d="M180 305v75h-70M620 215v165h70" />
      </>}
      {variant === "medical" && <>
        <path className="art-faint" d="M110 215H690M400 40V390M180 70h-25v25m465-25h25v25M155 335v25h25m465-25v25h-25" />
        <ellipse className="art-scan-outline" cx="400" cy="215" rx="145" ry="171" />
        {Array.from({length:11},(_,i)=><path key={i} className="art-contour" d={`M400 ${65+i*11} C${224+i*11} ${45+i*12}, ${205+i*13} ${354-i*11}, 400 ${370-i*11} C${595-i*13} ${354-i*11}, ${576-i*11} ${45+i*12},400 ${65+i*11}Z`} />)}
        <path className="art-contour" d="M400 70c-46 52 42 81 0 138s45 100 0 150" />
        {[0,1,2,3,4,5].map(i=><rect className="art-patch" key={i} x={430+i%2*32} y={155+Math.floor(i/2)*32} width="26" height="26" />)}
        <path className="art-scan" d="M225 215H575" /><circle className="art-dot" cx="225" cy="215" r="4" />
      </>}
      {variant === "intelligence" && <>
        <circle className="art-faint" cx="400" cy="215" r="155" /><circle className="art-orbit" cx="400" cy="215" r="116" />
        <path className="art-route" d="M110 215h175m230 0h175M400 60v40M400 330v40" />
        <circle className="art-core" cx="400" cy="215" r="72" />
        {[-3,-2,-1,0,1,2,3].map((v,i)=><path key={i} className="art-wave" d={`M${400+v*14} ${215-(4-Math.abs(v))*10}v${(4-Math.abs(v))*20}`} />)}
        <rect className="art-node" x="90" y="193" width="44" height="44" rx="22" /><path className="art-icon" d="M112 202v18m-7-10v5a7 7 0 0 0 14 0v-5m-7 13v5" />
        <rect className="art-node" x="668" y="193" width="44" height="44" rx="4" /><path className="art-icon" d="M679 204h22v17h-22Zm4 24h14" />
        <circle className="art-dot" cx="400" cy="60" r="7" /><circle className="art-dot" cx="400" cy="370" r="7" />
      </>}
      {variant === "roomread" && <>
        {[0,1,2].map(i=><g key={i} transform={`translate(${110+i*24} ${110+i*30})`}><rect className="art-page" width="150" height="180" rx="3" /><path className="art-faint" d="M24 35h90M24 59h102M24 83h70M24 135h94M24 155h60" /><rect className="art-highlight" x="20" y="96" width="110" height="18" /></g>)}
        <path className="art-route" d="M330 215h110m100 0h100" />
        <path className="art-core" d="m490 142 73 73-73 73-73-73Z" /><path className="art-icon" d="m466 214 16 16 33-35" />
        <rect className="art-page" x="640" y="140" width="85" height="150" rx="3" /><path className="art-icon" d="M657 162h50M657 178h38M657 235h50M657 252h30" /><circle className="art-dot" cx="682" cy="210" r="9" />
      </>}
      {variant === "gesture" && <>
        <path className="art-faint" d="M140 90h45m-45 0v45M615 90h45v45M140 295v45h45m430 0h45v-45" />
        <path className="art-hand" d="M345 345 302 285 265 245 235 213 216 188M345 345l-22-126-10-65-6-55-3-42M345 345l46-153-2-69-2-55-1-36M345 345l97-132 10-62 6-47 8-43M345 345l140-85 26-45 22-32 24-28M323 219l68-27 51 21 43 47" />
        {[[345,345],[302,285],[265,245],[235,213],[216,188],[323,219],[313,154],[307,99],[304,57],[391,192],[389,123],[387,68],[386,32],[442,213],[452,151],[458,104],[466,61],[485,260],[511,215],[533,183],[557,155]].map(([x,y],i)=><circle className={i===8?'art-fingertip':'art-landmark'} key={i} cx={x} cy={y} r={i===8?10:5}/>)}
        <path className="art-draw" d="M304 57C235 15 134 51 145 157s65 146 5 224" />
      </>}
      {variant === "simulation" && <>
        <path className="art-faint" d="m120 240 280-160 280 160-280 160Z M190 280 470 120M260 320 540 160M330 360 610 200M190 200l280 160M260 160l280 160M330 120l280 160" />
        {[[260,240,55],[400,160,90],[470,280,35],[540,240,65],[330,280,20]].map(([x,y,h],i)=><g key={i} className={`art-column art-column-${i}`}><path className="art-column-side" d={`M${x-34} ${y-h}l34 20 34-20v${h}l-34 20-34-20Z`} /><path className="art-column-top" d={`m${x-34} ${y-h} 34-20 34 20-34 20Z`} /><path className="art-faint" d={`M${x} ${y-h+20}v${h}`} /></g>)}
        <path className="art-route" d="M625 320v-80l60-35m-60 35 60 25" /><circle className="art-dot" cx="685" cy="205" r="7" /><circle className="art-target" cx="685" cy="265" r="7" />
      </>}
    </svg>
  );
}
