const INK = "var(--wsink)";

/**
 * שני דפי המקור שסיפק יניב עבור "המחשה לסרטון משולש שווה צלעות".
 * המקור נשמר מבחינה מתמטית ומסודר מחדש כ-SVG חד, כדי שהדפסה תהיה A4 נקייה
 * ולא תהיה תלויה בטעינת Google Drive.
 */
export function AidEquilateralTriangles() {
  return (
    <div className="aid-fig">
      <svg
        viewBox="0 0 596 842"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="חמישה משולשים שווי צלעות בגדלים שונים"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="596" height="842" fill="#fff" />

        {/* צורות חיצוניות — לפי פריסת דף המקור. */}
        <g fill={INK}>
          <polygon points="113.10,219.06 219.48,34.81 325.86,219.06" />
          <polygon points="401.96,171.96 481.15,34.80 560.34,171.96" />
          <polygon points="438.22,323.30 481.15,248.95 524.07,323.30" />
          <polygon points="31.06,570.52 210.45,259.83 389.83,570.52" />
          <polygon points="281.84,791.63 429.76,535.44 577.68,791.63" />
        </g>

        {/* החללים הפנימיים משחזרים את עוביי המסגרת השונים שבמקור. */}
        <g fill="#fff">
          <polygon points="122.93,213.40 219.48,46.17 316.03,213.40" />
          <polygon points="409.28,167.74 481.15,43.26 553.02,167.74" />
          <polygon points="442.19,321.01 481.15,253.53 520.11,321.01" />
          <polygon points="47.64,560.98 210.45,278.99 373.25,560.98" />
          <polygon points="295.51,783.76 429.76,551.24 564.01,783.76" />
        </g>
      </svg>
    </div>
  );
}

function Angle60({ x, y, mirror = false }: { x: number; y: number; mirror?: boolean }) {
  const dir = mirror ? -1 : 1;
  const horizontalX = x + dir * 145;
  const slantX = x + dir * 72.5;
  const slantY = y - 125.6;
  const arcR = 38;
  const arcEndX = x + dir * arcR * 0.5;
  const arcEndY = y - arcR * 0.8660254;
  const arcStartX = x + dir * arcR;
  const sweep = mirror ? 1 : 0;
  const labelX = x + dir * 50;

  return (
    <g>
      <path
        d={`M ${x} ${y} L ${horizontalX} ${y} M ${x} ${y} L ${slantX} ${slantY}`}
        fill="none"
        stroke={INK}
        strokeWidth={2.35}
        strokeDasharray="0.8 3.6"
        strokeLinecap="round"
      />
      <path
        d={`M ${arcStartX} ${y} A ${arcR} ${arcR} 0 0 ${sweep} ${arcEndX} ${arcEndY}`}
        fill="none"
        stroke={INK}
        strokeWidth={1.25}
      />
      <text
        x={labelX}
        y={y - 20}
        fill={INK}
        fontSize={16}
        fontWeight={600}
        textAnchor={mirror ? "end" : "start"}
        style={{ fontFamily: "var(--font-rubik), sans-serif", direction: "ltr", unicodeBidi: "isolate" }}
      >
        60°
      </text>
    </g>
  );
}

export function AidSixtyDegreeAngles() {
  return (
    <div className="aid-fig">
      <svg
        viewBox="0 0 596 842"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="שש המחשות של זווית בת שישים מעלות"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="596" height="842" fill="#fff" />
        <Angle60 x={106} y={218} />
        <Angle60 x={490} y={218} mirror />
        <Angle60 x={106} y={405} />
        <Angle60 x={490} y={405} mirror />
        <Angle60 x={106} y={592} />
        <Angle60 x={490} y={592} mirror />
      </svg>
    </div>
  );
}
