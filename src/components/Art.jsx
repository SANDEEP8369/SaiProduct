// Hand-drawn equipment illustrations (yellow + graphite) used when an item has no photo.
const Y = '#FFC400'
const K = '#23221E'
const W = '#FFFFFF'
const G = '#8A877D'
const L = '#FFE27A'

export function guessArt(text = '') {
  const t = text.toLowerCase()
  if (/monkey|hoist|lift/.test(t)) return 'monkey'
  if (/mix|concrete|batch/.test(t)) return 'mixer'
  if (/excavat|jcb|loader|backhoe|dozer|earth/.test(t)) return 'excavator'
  if (/hydra|truck|mobile|pick/.test(t)) return 'truck'
  return 'crane'
}

function Mast({ x, y, w, h, step = 16 }) {
  const n = Math.floor(h / step)
  const lines = []
  for (let i = 0; i < n; i++) {
    const y1 = y + i * step
    lines.push(
      <line key={i} x1={i % 2 ? x + w : x} y1={y1} x2={i % 2 ? x : x + w} y2={y1 + step} />
    )
  }
  return (
    <g stroke={K} strokeWidth="2" fill="none">
      <rect x={x} y={y} width={w} height={h} strokeWidth="3" fill={W} fillOpacity=".35" />
      {lines}
    </g>
  )
}

function Crane() {
  const trussTop = []
  for (let x = 40; x < 360; x += 16) {
    trussTop.push(<line key={x} x1={x} y1={56} x2={x + 8} y2={64} />)
    trussTop.push(<line key={'b' + x} x1={x + 8} y1={64} x2={x + 16} y2={56} />)
  }
  return (
    <g>
      <rect x="150" y="256" width="100" height="14" fill={K} />
      <Mast x={190} y={70} w={20} h={188} />
      <rect x="180" y="58" width="40" height="14" fill={K} />
      <rect x="200" y="42" width="24" height="18" fill={W} stroke={K} strokeWidth="2.5" />
      <polygon points="200,16 188,58 212,58" fill={Y} stroke={K} strokeWidth="2.5" strokeLinejoin="round" />
      <g stroke={K} strokeWidth="1.6">
        <line x1="200" y1="16" x2="350" y2="56" />
        <line x1="200" y1="16" x2="70" y2="56" />
      </g>
      <rect x="30" y="54" width="340" height="12" fill={Y} stroke={K} strokeWidth="2.5" />
      <g stroke={K} strokeWidth="1.4">{trussTop}</g>
      <rect x="34" y="66" width="30" height="24" fill={K} />
      <rect x="292" y="66" width="18" height="7" fill={K} />
      <line className="cable" x1="301" y1="73" x2="301" y2="150" stroke={K} strokeWidth="1.8" />
      <g className="load">
        <rect x="283" y="150" width="36" height="28" fill={Y} stroke={K} strokeWidth="2.5" />
        <path d="M301 144v6" stroke={K} strokeWidth="3" strokeLinecap="round" />
        <path d="M290 150l11-6 11 6" stroke={K} strokeWidth="1.6" fill="none" />
      </g>
    </g>
  )
}

function Monkey() {
  return (
    <g>
      <rect x="50" y="252" width="150" height="12" fill={K} />
      <rect x="64" y="212" width="72" height="40" fill={Y} stroke={K} strokeWidth="2.5" />
      <circle cx="100" cy="232" r="11" fill={W} stroke={K} strokeWidth="2.5" />
      <circle cx="100" cy="232" r="3" fill={K} />
      <rect x="112" y="218" width="18" height="10" fill={K} />
      <Mast x={186} y={64} w={18} h={190} />
      <polygon points="186,64 318,72 318,82 186,84" fill={Y} stroke={K} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="195" y1="130" x2="306" y2="80" stroke={K} strokeWidth="2" />
      <circle cx="312" cy="86" r="9" fill={W} stroke={K} strokeWidth="2.5" />
      <line x1="112" y1="222" x2="190" y2="70" stroke={K} strokeWidth="1.3" strokeDasharray="4 3" />
      <line x1="312" y1="95" x2="312" y2="190" stroke={K} strokeWidth="1.8" />
      <path d="M286 190h52l-8 42h-36z" fill={Y} stroke={K} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M296 190c0-12 32-12 32 0" fill="none" stroke={K} strokeWidth="2" />
    </g>
  )
}

function Mixer() {
  return (
    <g>
      <rect x="62" y="226" width="276" height="12" fill={K} />
      <circle cx="120" cy="250" r="22" fill={K} />
      <circle cx="120" cy="250" r="8" fill={W} />
      <circle cx="300" cy="250" r="22" fill={K} />
      <circle cx="300" cy="250" r="8" fill={W} />
      <polygon points="190,226 215,176 255,176 280,226" fill={K} />
      <polygon points="50,120 104,120 112,222 78,222" fill={L} stroke={K} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="60" y1="150" x2="106" y2="150" stroke={K} strokeWidth="2" />
      <line x1="64" y1="184" x2="108" y2="184" stroke={K} strokeWidth="2" />
      <g transform="rotate(-24 230 140)">
        <rect x="160" y="82" width="140" height="104" rx="22" fill={Y} stroke={K} strokeWidth="2.5" />
        <line x1="190" y1="84" x2="190" y2="184" stroke={K} strokeWidth="2" />
        <line x1="222" y1="84" x2="222" y2="184" stroke={K} strokeWidth="2" />
        <line x1="254" y1="84" x2="254" y2="184" stroke={K} strokeWidth="2" />
        <ellipse cx="300" cy="134" rx="13" ry="34" fill={K} />
        <ellipse cx="300" cy="134" rx="7" ry="22" fill={W} />
      </g>
      <rect x="296" y="196" width="40" height="30" fill={Y} stroke={K} strokeWidth="2.5" />
    </g>
  )
}

function Excavator() {
  return (
    <g>
      <rect x="84" y="228" width="212" height="36" rx="18" fill={K} />
      {[108, 160, 212, 264].map((cx) => (
        <circle key={cx} cx={cx} cy="246" r="9" fill={W} />
      ))}
      <rect x="104" y="184" width="158" height="46" rx="6" fill={Y} stroke={K} strokeWidth="2.5" />
      <rect x="92" y="190" width="20" height="38" fill={K} />
      <rect x="170" y="140" width="76" height="46" rx="4" fill={W} stroke={K} strokeWidth="2.5" />
      <rect x="178" y="148" width="40" height="30" fill={L} />
      <polyline points="246,198 312,108" fill="none" stroke={K} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="246,198 312,108" fill="none" stroke={Y} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="312,108 352,192" fill="none" stroke={K} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="312,108 352,192" fill="none" stroke={Y} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="252" y1="186" x2="296" y2="132" stroke={G} strokeWidth="5" strokeLinecap="round" />
      <path d="M334 188l40 10-6 36-30 4z" fill={K} />
    </g>
  )
}

function Truck() {
  return (
    <g>
      <rect x="36" y="224" width="336" height="16" fill={K} />
      <rect x="56" y="192" width="212" height="32" fill={L} stroke={K} strokeWidth="2.5" />
      <path d="M284 224v-62h48l28 32v30z" fill={Y} stroke={K} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M294 172h32l18 22h-50z" fill={W} stroke={K} strokeWidth="2" />
      {[92, 150, 316].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="246" r="21" fill={K} />
          <circle cx={cx} cy="246" r="8" fill={W} />
        </g>
      ))}
      <rect x="82" y="166" width="38" height="28" fill={Y} stroke={K} strokeWidth="2.5" />
      <line x1="104" y1="172" x2="232" y2="62" stroke={K} strokeWidth="18" strokeLinecap="round" />
      <line x1="104" y1="172" x2="232" y2="62" stroke={Y} strokeWidth="11" strokeLinecap="round" />
      <line x1="232" y1="62" x2="232" y2="146" stroke={K} strokeWidth="1.8" />
      <rect x="222" y="146" width="20" height="14" fill={K} />
    </g>
  )
}

const ARTS = { crane: Crane, monkey: Monkey, mixer: Mixer, excavator: Excavator, truck: Truck }

export default function Art({ type = 'crane', className = '' }) {
  const Piece = ARTS[type] || Crane
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      role="img"
      aria-label={`${type} illustration`}
      preserveAspectRatio="xMidYMax meet"
    >
      <line x1="10" y1="270" x2="390" y2="270" stroke={K} strokeWidth="3" strokeLinecap="round" />
      <Piece />
    </svg>
  )
}
