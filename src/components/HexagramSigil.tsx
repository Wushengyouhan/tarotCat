/** 六芒星召唤阵（双环符文 + 发光六芒星 + 顶点符号），供洗牌仪式垫底 */

const CX = 100;
const CY = 100;

/** 角度 0° 在正上方，顺时针 */
function polar(deg: number, r: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function polygonAtAngles(angles: number[], r: number): string {
  return angles
    .map((deg) => {
      const { x, y } = polar(deg, r);
      return `${x},${y}`;
    })
    .join(" ");
}

/** 外环密排符文（参考魔法阵外圈） */
const OUTER_RUNES =
  "☽☉♃♄♀♂✦◆◇☆✶♁☿⚶⚸⚹⚺⚻⚼⚽⚾⚀⚁⚂⚃⚄⚅✧✤✥✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿";

const VERTEX_GLYPHS = ["☉", "☽", "♃", "♄", "♀", "♂"] as const;

const SPARKLES: { x: number; y: number; r: number; o: number }[] = [
  { x: 42, y: 38, r: 1.2, o: 0.9 },
  { x: 158, y: 52, r: 0.9, o: 0.7 },
  { x: 68, y: 168, r: 1.1, o: 0.85 },
  { x: 148, y: 142, r: 0.8, o: 0.6 },
  { x: 28, y: 118, r: 1, o: 0.75 },
  { x: 172, y: 98, r: 1.3, o: 0.95 },
  { x: 88, y: 24, r: 0.7, o: 0.55 },
  { x: 112, y: 176, r: 1, o: 0.8 },
  { x: 54, y: 92, r: 0.6, o: 0.5 },
  { x: 138, y: 108, r: 0.85, o: 0.65 },
];

export function HexagramSigil() {
  const hexUp = polygonAtAngles([0, 120, 240], 54);
  const hexDown = polygonAtAngles([60, 180, 300], 54);
  const innerHex = polygonAtAngles([0, 60, 120, 180, 240, 300], 22);
  const runeCount = OUTER_RUNES.length;

  return (
    <svg
      className="tarot-hexagram pointer-events-none absolute inset-0 m-auto h-full w-full"
      viewBox="0 0 200 200"
      aria-hidden
    >
      <defs>
        <radialGradient id="hexagram-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(107 63 160 / 45%)" />
          <stop offset="55%" stopColor="rgb(107 63 160 / 18%)" />
          <stop offset="100%" stopColor="rgb(107 63 160 / 0%)" />
        </radialGradient>
        <filter id="hexagram-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hexagram-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 紫白辉光底 */}
      <circle cx={CX} cy={CY} r={92} fill="url(#hexagram-aura)" />
      <circle
        cx={CX}
        cy={CY}
        r={90}
        fill="none"
        stroke="rgb(232 224 240 / 12%)"
        strokeWidth={14}
      />

      {/* 外双环 */}
      <circle
        className="tarot-hexagram-ring-outer"
        cx={CX}
        cy={CY}
        r={88}
        fill="none"
        strokeWidth={1.1}
      />
      <circle
        className="tarot-hexagram-ring-inner"
        cx={CX}
        cy={CY}
        r={76}
        fill="none"
        strokeWidth={0.85}
      />

      {/* 外环符文 */}
      <g className="tarot-hexagram-runes" filter="url(#hexagram-soft-glow)">
        {Array.from({ length: runeCount }, (_, i) => {
          const deg = (360 / runeCount) * i;
          const { x, y } = polar(deg, 82);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${deg + 90} ${x} ${y})`}
              className="tarot-hexagram-rune-char"
            >
              {OUTER_RUNES[i]}
            </text>
          );
        })}
      </g>

      {/* 顶部小六芒星装饰 */}
      <g transform={`translate(${polar(0, 88).x} ${polar(0, 88).y})`} filter="url(#hexagram-soft-glow)">
        <polygon
          points="0,-5 4.3,2.5 -4.3,2.5"
          fill="none"
          className="tarot-hexagram-accent"
          strokeWidth={0.7}
        />
        <polygon
          points="0,5 4.3,-2.5 -4.3,-2.5"
          fill="none"
          className="tarot-hexagram-accent"
          strokeWidth={0.7}
        />
      </g>

      {/* 主六芒星 */}
      <g className="tarot-hexagram-star" filter="url(#hexagram-glow)">
        <polygon
          points={hexUp}
          fill="none"
          strokeWidth={1.35}
          strokeLinejoin="round"
        />
        <polygon
          points={hexDown}
          fill="none"
          strokeWidth={1.35}
          strokeLinejoin="round"
        />
      </g>

      {/* 六芒顶点符号 */}
      <g className="tarot-hexagram-vertices" filter="url(#hexagram-soft-glow)">
        {VERTEX_GLYPHS.map((glyph, i) => {
          const deg = i * 60;
          const { x, y } = polar(deg, 58);
          return (
            <text
              key={glyph}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className="tarot-hexagram-vertex-glyph"
            >
              {glyph}
            </text>
          );
        })}
      </g>

      {/* 内环 + 中心 */}
      <circle
        className="tarot-hexagram-ring-mid"
        cx={CX}
        cy={CY}
        r={38}
        fill="none"
        strokeWidth={0.75}
      />
      <polygon
        className="tarot-hexagram-core"
        points={innerHex}
        fill="rgb(107 63 160 / 12%)"
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
      <circle className="tarot-hexagram-core-dot" cx={CX} cy={CY} r={4.5} />
      <text
        x={CX}
        y={CY}
        textAnchor="middle"
        dominantBaseline="central"
        className="tarot-hexagram-core-glyph"
      >
        ✦
      </text>

      {/* 星屑微粒 */}
      <g className="tarot-hexagram-sparkles">
        {SPARKLES.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            className="tarot-hexagram-sparkle"
            style={{ opacity: s.o }}
          />
        ))}
      </g>
    </svg>
  );
}
