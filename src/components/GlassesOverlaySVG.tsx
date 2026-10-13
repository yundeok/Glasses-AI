interface GlassesOverlayProps {
  frameType: string;
  className?: string;
}

export function GlassesOverlaySVG({ frameType, className }: GlassesOverlayProps) {
  return (
    <svg
      viewBox="0 0 240 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Frame material gradients */}
        <linearGradient id="frame-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="50%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="frame-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c860" />
          <stop offset="40%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="frame-brown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a0522d" />
          <stop offset="50%" stopColor="#6b3410" />
          <stop offset="100%" stopColor="#3e1f08" />
        </linearGradient>
        <linearGradient id="frame-pink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f088ae" />
          <stop offset="50%" stopColor="#d6336c" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>
        <linearGradient id="frame-tortoise" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a2c17" />
          <stop offset="30%" stopColor="#6b3e1f" />
          <stop offset="60%" stopColor="#3a1e0a" />
          <stop offset="100%" stopColor="#2a1606" />
        </linearGradient>

        {/* Lens gradients — semi-transparent with realistic tint */}
        <radialGradient id="lens-clear" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="30%" stopColor="rgba(200,225,240,0.12)" />
          <stop offset="70%" stopColor="rgba(160,190,210,0.08)" />
          <stop offset="100%" stopColor="rgba(100,130,160,0.06)" />
        </radialGradient>
        <radialGradient id="lens-brown" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="rgba(255,230,180,0.30)" />
          <stop offset="40%" stopColor="rgba(180,130,70,0.35)" />
          <stop offset="100%" stopColor="rgba(100,60,20,0.45)" />
        </radialGradient>
        <radialGradient id="lens-pink" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="rgba(255,220,230,0.30)" />
          <stop offset="40%" stopColor="rgba(230,150,180,0.25)" />
          <stop offset="100%" stopColor="rgba(190,80,130,0.20)" />
        </radialGradient>
        <radialGradient id="lens-dark" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="rgba(180,200,220,0.20)" />
          <stop offset="40%" stopColor="rgba(80,100,130,0.30)" />
          <stop offset="100%" stopColor="rgba(30,40,60,0.45)" />
        </radialGradient>

        {/* Highlight gradient for lens reflection */}
        <linearGradient id="lens-highlight" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="frame-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
        </filter>
        <filter id="lens-shadow" x="-5%" y="-5%" width="110%" height="115%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>

      {renderFrame(frameType)}
    </svg>
  );
}

function renderFrame(type: string) {
  switch (type) {
    case 'round':
      return <RoundFrames />;
    case 'square':
      return <SquareFrames />;
    case 'cat-eye':
      return <CatEyeFrames />;
    case 'aviator':
      return <AviatorFrames />;
    case 'oval':
      return <OvalFrames />;
    case 'heart':
      return <HeartFrames />;
    default:
      return <RoundFrames />;
  }
}

// ── Frame components ──────────────────────────────────────────
// Each renders: temple arms (behind) → lens fills → frame outlines → highlights

function RoundFrames() {
  const fill = 'url(#frame-dark)';
  const lens = 'url(#lens-clear)';
  const sw = 4;

  return (
    <g filter="url(#frame-shadow)">
      {/* Temple arms */}
      <path d="M16 48 Q6 44 0 38" stroke={fill} strokeWidth={sw * 1.2} fill="none" strokeLinecap="round" />
      <path d="M224 48 Q234 44 240 38" stroke={fill} strokeWidth={sw * 1.2} fill="none" strokeLinecap="round" />

      {/* Left lens */}
      <circle cx="58" cy="50" r="34" fill={lens} filter="url(#lens-shadow)" />
      <circle cx="58" cy="50" r="34" stroke={fill} strokeWidth={sw} fill="none" />
      {/* Right lens */}
      <circle cx="182" cy="50" r="34" fill={lens} filter="url(#lens-shadow)" />
      <circle cx="182" cy="50" r="34" stroke={fill} strokeWidth={sw} fill="none" />

      {/* Bridge */}
      <path d="M92 47 Q120 40 148 47" stroke={fill} strokeWidth={sw} fill="none" strokeLinecap="round" />

      {/* Lens highlights */}
      <ellipse cx="48" cy="40" rx="16" ry="10" fill="url(#lens-highlight)" opacity="0.5" />
      <ellipse cx="172" cy="40" rx="16" ry="10" fill="url(#lens-highlight)" opacity="0.5" />
    </g>
  );
}

function SquareFrames() {
  const fill = 'url(#frame-dark)';
  const lens = 'url(#lens-clear)';
  const sw = 5;

  return (
    <g filter="url(#frame-shadow)">
      {/* Thin temples matching the supplied black acetate frame */}
      <path d="M23 25 Q10 20 0 18" stroke={fill} strokeWidth={sw * 1.15} fill="none" strokeLinecap="round" />
      <path d="M217 25 Q230 20 240 18" stroke={fill} strokeWidth={sw * 1.15} fill="none" strokeLinecap="round" />

      {/* Left lens: wide rectangular acetate shape with a gently curved bottom */}
      <path
        d="M22 20 Q23 12 33 12 Q60 11 94 18 L94 52 Q91 67 80 73 Q53 78 28 70 Q20 64 20 52 Z"
        fill={lens}
        filter="url(#lens-shadow)"
      />
      <path
        d="M22 20 Q23 12 33 12 Q60 11 94 18 L94 52 Q91 67 80 73 Q53 78 28 70 Q20 64 20 52 Z"
        stroke={fill}
        strokeWidth={sw}
        fill="none"
        strokeLinejoin="round"
      />

      {/* Right lens */}
      <path
        d="M218 20 Q217 12 207 12 Q180 11 146 18 L146 52 Q149 67 160 73 Q187 78 212 70 Q220 64 220 52 Z"
        fill={lens}
        filter="url(#lens-shadow)"
      />
      <path
        d="M218 20 Q217 12 207 12 Q180 11 146 18 L146 52 Q149 67 160 73 Q187 78 212 70 Q220 64 220 52 Z"
        stroke={fill}
        strokeWidth={sw}
        fill="none"
        strokeLinejoin="round"
      />

      {/* Strong high bridge from the reference frame */}
      <path d="M94 23 Q120 32 146 23" stroke={fill} strokeWidth={sw * 1.25} fill="none" strokeLinecap="round" />

      {/* Soft lens reflections, kept subtle so the face remains visible */}
      <path d="M29 20 Q50 16 74 22 L68 34 Q48 28 31 34 Z" fill="url(#lens-highlight)" opacity="0.28" />
      <path d="M211 20 Q190 16 166 22 L172 34 Q192 28 209 34 Z" fill="url(#lens-highlight)" opacity="0.28" />
    </g>
  );
}

function CatEyeFrames() {
  const fill = 'url(#frame-brown)';
  const lens = 'url(#lens-clear)';
  const sw = 4.5;

  return (
    <g filter="url(#frame-shadow)">
      {/* Temple arms — swept up at outer corners */}
      <path d="M18 36 Q8 28 0 20" stroke={fill} strokeWidth={sw * 1.2} fill="none" strokeLinecap="round" />
      <path d="M222 36 Q232 28 240 20" stroke={fill} strokeWidth={sw * 1.2} fill="none" strokeLinecap="round" />

      {/* Left lens — upswept outer corner */}
      <path
        d="M18 38 Q20 16 52 16 Q82 18 86 36 Q84 58 56 62 Q24 60 18 44 Z"
        fill={lens}
        filter="url(#lens-shadow)"
      />
      <path
        d="M18 38 Q20 16 52 16 Q82 18 86 36 Q84 58 56 62 Q24 60 18 44 Z"
        stroke={fill}
        strokeWidth={sw}
        fill="none"
        strokeLinejoin="round"
      />
      {/* Right lens */}
      <path
        d="M222 38 Q220 16 188 16 Q158 18 154 36 Q156 58 184 62 Q216 60 222 44 Z"
        fill={lens}
        filter="url(#lens-shadow)"
      />
      <path
        d="M222 38 Q220 16 188 16 Q158 18 154 36 Q156 58 184 62 Q216 60 222 44 Z"
        stroke={fill}
        strokeWidth={sw}
        fill="none"
        strokeLinejoin="round"
      />

      {/* Bridge */}
      <path d="M86 34 Q120 28 154 34" stroke={fill} strokeWidth={sw} fill="none" strokeLinecap="round" />

      {/* Lens highlights */}
      <ellipse cx="38" cy="28" rx="18" ry="8" fill="url(#lens-highlight)" opacity="0.45" />
      <ellipse cx="202" cy="28" rx="18" ry="8" fill="url(#lens-highlight)" opacity="0.45" />
    </g>
  );
}

function AviatorFrames() {
  const fill = 'url(#frame-gold)';
  const lens = 'url(#lens-brown)';
  const sw = 3.5;

  return (
    <g filter="url(#frame-shadow)">
      {/* Temple arms */}
      <path d="M16 32 Q6 28 0 22" stroke={fill} strokeWidth={sw * 1.3} fill="none" strokeLinecap="round" />
      <path d="M224 32 Q234 28 240 22" stroke={fill} strokeWidth={sw * 1.3} fill="none" strokeLinecap="round" />

      {/* Left lens — teardrop shape */}
      <path
        d="M16 26 Q48 20 84 28 Q84 64 58 72 Q30 70 18 52 Q12 38 16 26 Z"
        fill={lens}
        filter="url(#lens-shadow)"
      />
      <path
        d="M16 26 Q48 20 84 28 Q84 64 58 72 Q30 70 18 52 Q12 38 16 26 Z"
        stroke={fill}
        strokeWidth={sw}
        fill="none"
        strokeLinejoin="round"
      />
      {/* Right lens */}
      <path
        d="M224 26 Q192 20 156 28 Q156 64 182 72 Q210 70 222 52 Q228 38 224 26 Z"
        fill={lens}
        filter="url(#lens-shadow)"
      />
      <path
        d="M224 26 Q192 20 156 28 Q156 64 182 72 Q210 70 222 52 Q228 38 224 26 Z"
        stroke={fill}
        strokeWidth={sw}
        fill="none"
        strokeLinejoin="round"
      />

      {/* Double bridge */}
      <path d="M84 30 Q120 22 156 30" stroke={fill} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M82 38 Q120 32 158 38" stroke={fill} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" opacity="0.8" />

      {/* Lens highlights */}
      <ellipse cx="34" cy="36" rx="16" ry="20" fill="url(#lens-highlight)" opacity="0.35" />
      <ellipse cx="206" cy="36" rx="16" ry="20" fill="url(#lens-highlight)" opacity="0.35" />
    </g>
  );
}

function OvalFrames() {
  const fill = 'url(#frame-dark)';
  const lens = 'url(#lens-clear)';
  const sw = 4;

  return (
    <g filter="url(#frame-shadow)">
      {/* Temple arms */}
      <path d="M18 48 Q8 44 0 38" stroke={fill} strokeWidth={sw * 1.2} fill="none" strokeLinecap="round" />
      <path d="M222 48 Q232 44 240 38" stroke={fill} strokeWidth={sw * 1.2} fill="none" strokeLinecap="round" />

      {/* Left lens */}
      <ellipse cx="60" cy="50" rx="36" ry="26" fill={lens} filter="url(#lens-shadow)" />
      <ellipse cx="60" cy="50" rx="36" ry="26" stroke={fill} strokeWidth={sw} fill="none" />
      {/* Right lens */}
      <ellipse cx="180" cy="50" rx="36" ry="26" fill={lens} filter="url(#lens-shadow)" />
      <ellipse cx="180" cy="50" rx="36" ry="26" stroke={fill} strokeWidth={sw} fill="none" />

      {/* Bridge */}
      <path d="M96 46 Q120 40 144 46" stroke={fill} strokeWidth={sw} fill="none" strokeLinecap="round" />

      {/* Lens highlights */}
      <ellipse cx="48" cy="38" rx="18" ry="10" fill="url(#lens-highlight)" opacity="0.5" />
      <ellipse cx="168" cy="38" rx="18" ry="10" fill="url(#lens-highlight)" opacity="0.5" />
    </g>
  );
}

function HeartFrames() {
  const fill = 'url(#frame-pink)';
  const lens = 'url(#lens-pink)';
  const sw = 4;

  return (
    <g filter="url(#frame-shadow)">
      {/* Temple arms */}
      <path d="M18 34 Q8 28 0 22" stroke={fill} strokeWidth={sw * 1.2} fill="none" strokeLinecap="round" />
      <path d="M222 34 Q232 28 240 22" stroke={fill} strokeWidth={sw * 1.2} fill="none" strokeLinecap="round" />

      {/* Left lens — heart-leaf shape */}
      <path
        d="M18 32 Q22 14 44 14 Q58 16 60 30 Q58 46 44 54 Q26 52 18 40 Z"
        fill={lens}
        filter="url(#lens-shadow)"
      />
      <path
        d="M18 32 Q22 14 44 14 Q58 16 60 30 Q58 46 44 54 Q26 52 18 40 Z"
        stroke={fill}
        strokeWidth={sw}
        fill="none"
        strokeLinejoin="round"
      />
      {/* Right lens */}
      <path
        d="M222 32 Q218 14 196 14 Q182 16 180 30 Q182 46 196 54 Q214 52 222 40 Z"
        fill={lens}
        filter="url(#lens-shadow)"
      />
      <path
        d="M222 32 Q218 14 196 14 Q182 16 180 30 Q182 46 196 54 Q214 52 222 40 Z"
        stroke={fill}
        strokeWidth={sw}
        fill="none"
        strokeLinejoin="round"
      />

      {/* Bridge */}
      <path d="M60 28 Q120 22 180 28" stroke={fill} strokeWidth={sw} fill="none" strokeLinecap="round" />

      {/* Lens highlights */}
      <ellipse cx="34" cy="24" rx="12" ry="6" fill="url(#lens-highlight)" opacity="0.5" />
      <ellipse cx="206" cy="24" rx="12" ry="6" fill="url(#lens-highlight)" opacity="0.5" />
    </g>
  );
}
