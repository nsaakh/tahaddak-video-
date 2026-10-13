import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { COPY, Copy, Lang, SCENE_SECS, Service, VOICE, stripTashkeel } from "./content";

// فيديو خدمات إينا سمارت — عمودي 1080×1920 لتيك توك والريلز
export const FPS = 30;

// عائلتين منفصلتين: لو كانت وحدة، المتصفح يختار الوزن قبل نطاق الحروف ويطلع الإنجليزي بخط احتياطي
const FONT = "EanaLatin, EanaArabic";
loadFont({
  family: "EanaLatin",
  url: staticFile("fonts/manrope-latin-wght-normal.woff2"),
  weight: "200 800",
  unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2190-2199, U+2212",
});
for (const w of ["400", "500", "600", "700"]) {
  loadFont({
    family: "EanaArabic",
    url: staticFile(`fonts/ibm-plex-sans-arabic-arabic-${w}-normal.woff2`),
    weight: w,
    unicodeRange: "U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+2010-2011, U+FB50-FDFF, U+FE70-FEFC",
  });
}

// ألوان الهوية من موقع الشركة
const K = {
  navy: "#0A1633",
  deep: "#070F26",
  ink: "#0F1B3D",
  blue: "#1E5EFF",
  cyan: "#21D4FD",
  purple: "#7B3FE4",
  muted: "#8590AB",
  light: "#F4F7FC",
  white: "#FFFFFF",
};
const GRAD = `linear-gradient(90deg, ${K.cyan} 0%, ${K.blue} 50%, ${K.purple} 100%)`;

export const timeline = (lang: Lang) => {
  let t = 0;
  return SCENE_SECS[lang].map((sec) => {
    const start = Math.round(t * FPS);
    t += sec;
    return { start, dur: Math.round(t * FPS) - start };
  });
};
export const totalFrames = (lang: Lang) => Math.round(SCENE_SECS[lang].reduce((a, b) => a + b, 0) * FPS);

// ───────── أدوات حركة ─────────

const useIn = (delay = 0, damping = 18, stiffness = 120) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

const Rise: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number }> = ({
  delay = 0,
  children,
  style,
  dist = 60,
}) => {
  const s = useIn(delay);
  return (
    <div style={{ opacity: s, transform: `translateY(${(1 - s) * dist}px)`, filter: `blur(${(1 - s) * 8}px)`, ...style }}>
      {children}
    </div>
  );
};

const GradText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span
    style={{
      background: GRAD,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      ...style,
    }}
  >
    {children}
  </span>
);

// ───────── الخلفية ─────────

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const orbs = [
    { c: K.blue, x: 200, y: 400, r: 520, sx: 0.011, sy: 0.009 },
    { c: K.purple, x: 900, y: 1300, r: 560, sx: 0.008, sy: 0.012 },
    { c: K.cyan, x: 700, y: 200, r: 360, sx: 0.013, sy: 0.007 },
  ];
  const gridShift = (frame * 1.6) % 90;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.deep} 0%, ${K.navy} 55%, ${K.deep} 100%)`, overflow: "hidden" }}>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x + Math.sin(frame * o.sx + i) * 120 - o.r / 2,
            top: o.y + Math.cos(frame * o.sy + i) * 140 - o.r / 2,
            width: o.r,
            height: o.r,
            borderRadius: "50%",
            background: o.c,
            opacity: 0.28,
            filter: "blur(140px)",
          }}
        />
      ))}
      {/* شبكة منظور في الأسفل */}
      <div
        style={{
          position: "absolute",
          left: -540,
          right: -540,
          bottom: -200,
          height: 900,
          transform: "perspective(700px) rotateX(62deg)",
          transformOrigin: "bottom",
          backgroundImage: `linear-gradient(${K.blue}55 2px, transparent 2px), linear-gradient(90deg, ${K.blue}55 2px, transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${gridShift}px`,
          maskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          opacity: 0.55,
        }}
      />
      {/* نقاط ناعمة */}
      {Array.from({ length: 28 }).map((_, i) => {
        const x = (i * 389) % 1080;
        const y = (((i * 677) % 1920) - frame * (0.4 + (i % 5) * 0.15) + 1920 * 4) % 1920;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              borderRadius: "50%",
              background: i % 2 ? K.cyan : K.white,
              opacity: 0.25 + (i % 4) * 0.08,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ───────── الترجمة أسفل الشاشة ─────────

const Subtitle: React.FC<{ text: string; dur: number; dir: Copy["dir"] }> = ({ text, dur, dir }) => {
  const frame = useCurrentFrame();
  const clean = stripTashkeel(text).replace(/…/g, "…");
  const words = clean.split(" ");
  const span = dur * 0.82;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 150,
        left: 70,
        right: 70,
        fontFamily: FONT,
        direction: dir,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "4px 14px",
        fontSize: 44,
        fontWeight: 600,
        lineHeight: 1.5,
        textAlign: "center",
      }}
    >
      {words.map((w, i) => {
        const at = 4 + (i / words.length) * span;
        const p = interpolate(frame, [at, at + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span key={i} style={{ color: p > 0.5 ? K.white : "#5B6687", opacity: 0.35 + p * 0.65, direction: /[a-z]/i.test(w) && dir === "rtl" ? "ltr" : dir }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Frame: React.FC<{ c: Copy; children: React.ReactNode }> = ({ c, children }) => (
  <AbsoluteFill style={{ fontFamily: FONT, direction: c.dir, color: K.white, alignItems: "center" }}>{children}</AbsoluteFill>
);

const SmallLogo: React.FC = () => (
  <Img src={staticFile("eana/logo-light.png")} style={{ position: "absolute", top: 90, width: 230, opacity: 0.9 }} />
);

// ───────── المشاهد ─────────

const Hook: React.FC<{ c: Copy; dur: number }> = ({ c, dur }) => {
  const frame = useCurrentFrame();
  // التوقيت نسبةً لطول المشهد عشان يمشي مع نطق "الرقمي" ثم "الذكي"
  const strikeAt = Math.round(dur * 0.48);
  const intelAt = Math.round(dur * 0.66);
  const strike = interpolate(frame, [strikeAt, strikeAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glow = useIn(intelAt, 12);
  return (
    <Frame c={c}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 10, padding: 80, textAlign: "center" }}>
        <Rise>
          <div style={{ fontSize: 66, fontWeight: 600, color: "#C8D0E8" }}>{c.hook.before}</div>
        </Rise>
        <Rise delay={10}>
          <div style={{ position: "relative", fontSize: 120, fontWeight: 700, color: strike > 0.5 ? K.muted : K.white }}>
            {c.hook.digital}
            <div
              style={{
                position: "absolute",
                top: "55%",
                [c.dir === "rtl" ? "right" : "left"]: 0,
                width: `${strike * 100}%`,
                height: 10,
                borderRadius: 5,
                background: K.cyan,
              }}
            />
          </div>
        </Rise>
        <Rise delay={intelAt - 8} style={{ marginTop: 50 }}>
          <div style={{ fontSize: 66, fontWeight: 600, color: "#C8D0E8" }}>{c.hook.after}</div>
        </Rise>
        <div style={{ transform: `scale(${0.6 + glow * 0.4})`, opacity: glow }}>
          <GradText style={{ fontSize: 170, fontWeight: 800, filter: `drop-shadow(0 0 ${40 * glow}px ${K.blue})`, lineHeight: 1.35 }}>
            {c.hook.intelligent}
          </GradText>
        </div>
      </AbsoluteFill>
    </Frame>
  );
};

const LogoReveal: React.FC<{ c: Copy }> = ({ c }) => {
  const frame = useCurrentFrame();
  const s = useIn(0, 16, 90);
  const sweep = interpolate(frame, [12, 40], [-120, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <Frame c={c}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div
          style={{
            position: "absolute",
            width: 900 * ring,
            height: 900 * ring,
            borderRadius: "50%",
            border: `3px solid ${K.cyan}`,
            opacity: (1 - ring) * 0.8,
          }}
        />
        <div style={{ position: "relative", transform: `scale(${0.7 + s * 0.3})`, opacity: s, overflow: "hidden" }}>
          <Img src={staticFile("eana/logo-light.png")} style={{ width: 820, display: "block" }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sweep}%`,
              width: "30%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              transform: "skewX(-20deg)",
              mixBlendMode: "overlay",
            }}
          />
        </div>
        <Rise delay={22} style={{ marginTop: 70 }}>
          <div style={{ fontSize: 56, fontWeight: 700, textAlign: "center" }}>
            <GradText>{c.logoLine}</GradText>
          </div>
        </Rise>
        <Rise delay={34} style={{ marginTop: 40 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              padding: "14px 40px",
              borderRadius: 999,
              border: `2px solid ${K.cyan}66`,
              background: "rgba(33,212,253,0.08)",
              color: K.light,
            }}
          >
            {c.saudi}
          </div>
        </Rise>
      </AbsoluteFill>
    </Frame>
  );
};

const StepIcon: React.FC<{ i: number }> = ({ i }) => {
  const common = { fill: "none", stroke: K.white, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (i === 0)
    return (
      <svg width="70" height="70" viewBox="0 0 64 64">
        <path d="M10 54 L22 50 L52 20 L44 12 L14 42 Z" {...common} />
        <path d="M38 18 L46 26" {...common} />
      </svg>
    );
  if (i === 1)
    return (
      <svg width="70" height="70" viewBox="0 0 64 64">
        <path d="M22 18 L8 32 L22 46 M42 18 L56 32 L42 46 M36 12 L28 52" {...common} />
      </svg>
    );
  return (
    <svg width="70" height="70" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="10" {...common} />
      <path d="M32 6 V14 M32 50 V58 M6 32 H14 M50 32 H58 M13 13 L19 19 M45 45 L51 51 M13 51 L19 45 M45 19 L51 13" {...common} />
    </svg>
  );
};

const WhatWeDo: React.FC<{ c: Copy; dur: number }> = ({ c, dur }) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [dur * 0.55, dur * 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <Frame c={c}>
      <SmallLogo />
      <div style={{ position: "absolute", top: 300, display: "flex", flexDirection: "column", gap: 34, width: 800 }}>
        {c.steps.map((st, i) => (
          <Rise key={st} delay={6 + i * 14} dist={80}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 36,
                padding: "30px 44px",
                borderRadius: 36,
                background: "linear-gradient(135deg, rgba(30,94,255,0.22), rgba(123,63,228,0.14))",
                border: `2px solid ${[K.cyan, K.blue, K.purple][i]}88`,
                boxShadow: `0 0 40px ${[K.cyan, K.blue, K.purple][i]}33`,
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 28,
                  background: GRAD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <StepIcon i={i} />
              </div>
              <div style={{ fontSize: 72, fontWeight: 700 }}>{st}</div>
            </div>
          </Rise>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1040, display: "flex", gap: 24 }}>
        {c.clients.map((cl, i) => (
          <Rise key={cl} delay={50 + i * 10}>
            <div style={{ fontSize: 40, fontWeight: 600, padding: "14px 34px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.18)" }}>
              {cl}
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={Math.round(dur * 0.5)} style={{ position: "absolute", top: 1210, width: 860 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 36, fontWeight: 600, color: K.muted, marginBottom: 18 }}>
          <span>{c.ideaToLive[0]}</span>
          <span style={{ color: bar > 0.98 ? K.cyan : K.muted }}>{c.ideaToLive[1]}</span>
        </div>
        <div style={{ height: 16, borderRadius: 8, background: "rgba(255,255,255,0.1)", overflow: "hidden", direction: c.dir }}>
          <div style={{ width: `${bar * 100}%`, height: "100%", background: GRAD, borderRadius: 8, boxShadow: `0 0 24px ${K.cyan}` }} />
        </div>
      </Rise>
    </Frame>
  );
};

// ───────── رسومات الخدمات ─────────

const ArtAI: React.FC = () => {
  const frame = useCurrentFrame();
  const layers = [3, 5, 5, 3];
  const pts = layers.map((n, li) =>
    Array.from({ length: n }).map((_, k) => ({ x: 70 + li * 153, y: 300 + (k - (n - 1) / 2) * 105 })),
  );
  const lines: { a: { x: number; y: number }; b: { x: number; y: number }; id: number }[] = [];
  let id = 0;
  for (let l = 0; l < pts.length - 1; l++) for (const a of pts[l]) for (const b of pts[l + 1]) lines.push({ a, b, id: id++ });
  return (
    <svg width="600" height="600" viewBox="0 0 600 600">
      {lines.map(({ a, b, id: n }) => {
        const appear = interpolate(frame, [n * 0.5, n * 0.5 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const t = ((frame * 0.03 + n * 0.137) % 1 + 1) % 1;
        return (
          <g key={n} opacity={appear}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={K.blue} strokeOpacity={0.35} strokeWidth={2} />
            {n % 3 === 0 ? <circle cx={a.x + (b.x - a.x) * t} cy={a.y + (b.y - a.y) * t} r={5} fill={K.cyan} /> : null}
          </g>
        );
      })}
      {pts.flat().map((p, i) => {
        const pulse = 1 + Math.sin(frame / 8 + i) * 0.15;
        return <circle key={i} cx={p.x} cy={p.y} r={20 * pulse} fill={K.navy} stroke={i % 2 ? K.cyan : K.purple} strokeWidth={5} />;
      })}
    </svg>
  );
};

const ArtPlatforms: React.FC = () => {
  const frame = useCurrentFrame();
  const row = (i: number) => interpolate(frame, [8 + i * 6, 20 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width="600" height="600" viewBox="0 0 600 600">
      <rect x="20" y="90" width="430" height="330" rx="24" fill={K.ink} stroke={K.blue} strokeWidth="4" />
      <rect x="20" y="90" width="430" height="50" rx="24" fill={K.blue} opacity="0.5" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={50 + i * 26} cy={115} r={8} fill={K.white} opacity={0.7} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="50" y={170 + i * 55} width={(i === 0 ? 220 : 360 - i * 40) * row(i)} height="26" rx="13" fill={i === 0 ? K.cyan : "#2A3A6E"} />
      ))}
      <g transform={`translate(${380 + (1 - row(2)) * 80} 200)`} opacity={row(1)}>
        <rect x="0" y="0" width="190" height="370" rx="34" fill={K.navy} stroke={K.purple} strokeWidth="5" />
        <rect x="70" y="16" width="50" height="10" rx="5" fill={K.purple} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="22" y={56 + i * 74} width="146" height="56" rx="14" fill={i === 1 ? K.purple : "#22305E"} opacity={row(i)} />
        ))}
      </g>
    </svg>
  );
};

const ArtAutomation: React.FC = () => {
  const frame = useCurrentFrame();
  const nodes = [
    { x: 300, y: 90 },
    { x: 510, y: 300 },
    { x: 300, y: 510 },
    { x: 90, y: 300 },
  ];
  const t = (frame / 36) % 4;
  const seg = Math.floor(t);
  const f = t - seg;
  const a = nodes[seg];
  const b = nodes[(seg + 1) % 4];
  const rot = frame * 2;
  return (
    <svg width="600" height="600" viewBox="0 0 600 600">
      <circle cx="300" cy="300" r="210" fill="none" stroke={K.blue} strokeOpacity="0.4" strokeWidth="4" strokeDasharray="14 14" transform={`rotate(${rot / 4} 300 300)`} />
      <g transform={`rotate(${rot} 300 300)`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="288" y="232" width="24" height="40" rx="6" fill={K.purple} transform={`rotate(${i * 45} 300 300)`} />
        ))}
        <circle cx="300" cy="300" r="52" fill={K.purple} />
        <circle cx="300" cy="300" r="22" fill={K.navy} />
      </g>
      {nodes.map((n, i) => {
        const done = (frame / 36) % 4 > i || frame > 140;
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="48" fill={K.ink} stroke={done ? K.cyan : K.blue} strokeWidth="5" />
            <path
              d={`M${n.x - 18} ${n.y} L${n.x - 4} ${n.y + 14} L${n.x + 20} ${n.y - 12}`}
              fill="none"
              stroke={K.cyan}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={done ? 1 : 0.15}
            />
          </g>
        );
      })}
      <circle cx={a.x + (b.x - a.x) * f} cy={a.y + (b.y - a.y) * f} r="14" fill={K.white} style={{ filter: `drop-shadow(0 0 12px ${K.cyan})` }} />
    </svg>
  );
};

const ArtData: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = [0.35, 0.55, 0.45, 0.7, 0.62, 0.88];
  const grow = (i: number) => interpolate(frame, [6 + i * 5, 26 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const line = interpolate(frame, [30, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts = bars.map((v, i) => `${80 + i * 85},${500 - v * 380 - 30}`).join(" ");
  return (
    <svg width="600" height="600" viewBox="0 0 600 600">
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="40" x2="560" y1={500 - i * 110} y2={500 - i * 110} stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />
      ))}
      {bars.map((v, i) => (
        <rect key={i} x={55 + i * 85} y={500 - v * 380 * grow(i)} width="52" height={v * 380 * grow(i)} rx="10" fill={i === bars.length - 1 ? K.cyan : K.blue} opacity={i === bars.length - 1 ? 1 : 0.75} />
      ))}
      <polyline points={pts} fill="none" stroke={K.purple} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - line} />
      {line > 0.98 ? <circle cx={80 + 5 * 85} cy={500 - 0.88 * 380 - 30} r="14" fill={K.white} style={{ filter: `drop-shadow(0 0 14px ${K.purple})` }} /> : null}
    </svg>
  );
};

const ArtTransform: React.FC = () => {
  const frame = useCurrentFrame();
  const lit = (i: number) => interpolate(frame, [10 + i * 16, 22 + i * 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boxes = [
    { x: 40, y: 120 },
    { x: 330, y: 120 },
    { x: 40, y: 360 },
    { x: 330, y: 360 },
  ];
  const links: [number, number][] = [
    [0, 1],
    [1, 3],
    [3, 2],
  ];
  return (
    <svg width="600" height="600" viewBox="0 0 600 600">
      {links.map(([p, q], i) => {
        const A = boxes[p];
        const B = boxes[q];
        return (
          <line
            key={i}
            x1={A.x + 115}
            y1={A.y + 60}
            x2={B.x + 115}
            y2={B.y + 60}
            stroke={K.cyan}
            strokeWidth="6"
            strokeDasharray="12 10"
            strokeDashoffset={-frame * 2}
            opacity={lit(i + 1)}
          />
        );
      })}
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width="230" height="120" rx="24" fill={lit(i) > 0.5 ? "url(#tg)" : K.ink} stroke={lit(i) > 0.5 ? K.cyan : "#33406E"} strokeWidth="4" />
          <rect x={b.x + 30} y={b.y + 36} width={120 * (0.5 + lit(i) * 0.5)} height="16" rx="8" fill={K.white} opacity={0.4 + lit(i) * 0.5} />
          <rect x={b.x + 30} y={b.y + 68} width="80" height="16" rx="8" fill={K.white} opacity={0.25 + lit(i) * 0.3} />
        </g>
      ))}
      <defs>
        <linearGradient id="tg" x1="0" x2="1">
          <stop offset="0" stopColor={K.blue} />
          <stop offset="1" stopColor={K.purple} />
        </linearGradient>
      </defs>
    </svg>
  );
};

const ARTS: Record<Service["art"], React.FC> = {
  ai: ArtAI,
  platforms: ArtPlatforms,
  automation: ArtAutomation,
  data: ArtData,
  transform: ArtTransform,
};

const ServiceScene: React.FC<{ c: Copy; s: Service; dur: number }> = ({ c, s, dur }) => {
  const Art = ARTS[s.art];
  const art = useIn(10, 20, 80);
  return (
    <Frame c={c}>
      <div style={{ position: "absolute", top: 110, width: 940, display: "flex", alignItems: "center", gap: 30 }}>
        <Rise>
          <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1, WebkitTextStroke: `3px ${K.cyan}`, color: "transparent", direction: "ltr" }}>{s.num}</div>
        </Rise>
        <Rise delay={6}>
          <div style={{ fontSize: s.title.length > 22 ? 62 : 74, fontWeight: 700, lineHeight: 1.2 }}>{s.title}</div>
        </Rise>
      </div>
      <Rise delay={14} style={{ position: "absolute", top: 330, width: 900 }}>
        <div style={{ fontSize: 42, fontWeight: 500, color: "#B9C3DE", lineHeight: 1.5, textAlign: c.dir === "rtl" ? "right" : "left" }}>{s.tagline}</div>
      </Rise>
      <div style={{ position: "absolute", top: 470, opacity: art, transform: `scale(${0.85 + art * 0.15})`, direction: "ltr" }}>
        <Art />
      </div>
      <div style={{ position: "absolute", top: 1110, width: 960, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
        {s.chips.map((ch, i) => (
          <Rise key={ch} delay={Math.round(dur * 0.15) + i * Math.round(dur * 0.12)} dist={30}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 600,
                padding: "14px 30px",
                borderRadius: 999,
                background: "rgba(30,94,255,0.16)",
                border: `2px solid ${K.blue}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 6, background: K.cyan, boxShadow: `0 0 12px ${K.cyan}` }} />
              {ch}
            </div>
          </Rise>
        ))}
      </div>
    </Frame>
  );
};

const OneSystem: React.FC<{ c: Copy; dur: number }> = ({ c, dur }) => {
  const frame = useCurrentFrame();
  const merge = interpolate(frame, [20, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const line = interpolate(frame, [dur * 0.45, dur * 0.95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const active = Math.min(c.stages.length - 1, Math.floor(line * c.stages.length));
  return (
    <Frame c={c}>
      <div style={{ position: "absolute", top: 230, width: 600, height: 600 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const ang = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const r = 230 * (1 - merge);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 300 + Math.cos(ang) * r - 70,
                top: 300 + Math.sin(ang) * r - 70,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: [K.cyan, K.blue, K.purple, K.blue, K.cyan][i],
                opacity: 0.85 - merge * 0.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 50,
                fontWeight: 800,
                direction: "ltr",
              }}
            >
              {merge < 0.6 ? `0${i + 1}` : ""}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 300 - 200 * merge,
            top: 300 - 200 * merge,
            width: 400 * merge,
            height: 400 * merge,
            borderRadius: "50%",
            border: `8px solid ${K.cyan}`,
            boxShadow: `0 0 80px ${K.blue}, inset 0 0 60px ${K.purple}`,
            opacity: merge,
          }}
        />
      </div>
      <Rise delay={8} style={{ position: "absolute", top: 880 }}>
        <div style={{ fontSize: 76, fontWeight: 800, textAlign: "center" }}>
          {c.fiveAreas} · <GradText>{c.oneSystem}</GradText>
        </div>
      </Rise>
      <div style={{ position: "absolute", top: 1080, width: 900 }}>
        <div style={{ position: "relative", height: 40, direction: c.dir }}>
          <div style={{ position: "absolute", top: 17, left: 0, right: 0, height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 3 }} />
          <div style={{ position: "absolute", top: 17, [c.dir === "rtl" ? "right" : "left"]: 0, width: `${line * 100}%`, height: 6, background: GRAD, borderRadius: 3 }} />
          {c.stages.map((_, i) => {
            const pos = (i / (c.stages.length - 1)) * 100;
            const on = i <= active && line > 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: on ? 4 : 8,
                  [c.dir === "rtl" ? "right" : "left"]: `calc(${pos}% - ${on ? 16 : 12}px)`,
                  width: on ? 32 : 24,
                  height: on ? 32 : 24,
                  borderRadius: "50%",
                  background: on ? K.cyan : K.ink,
                  border: `3px solid ${on ? K.white : "#3A4776"}`,
                }}
              />
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 34, fontSize: 48, fontWeight: 700, color: K.cyan, opacity: line > 0 ? 1 : 0 }}>
          <span style={{ display: "inline-flex", gap: 18, alignItems: "baseline" }}>
            <span style={{ color: K.muted }}>{String(active + 1).padStart(2, "0")}</span>
            <span>{c.stages[active]}</span>
          </span>
        </div>
      </div>
    </Frame>
  );
};

const Outro: React.FC<{ c: Copy }> = ({ c }) => {
  const frame = useCurrentFrame();
  const s = useIn(0, 16, 90);
  const pulse = 1 + Math.sin(frame / 9) * 0.025;
  return (
    <Frame c={c}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ transform: `scale(${0.8 + s * 0.2})`, opacity: s }}>
          <Img src={staticFile("eana/logo-light.png")} style={{ width: 760 }} />
        </div>
        <Rise delay={20} style={{ marginTop: 60, textAlign: "center" }}>
          <div style={{ fontSize: 64, fontWeight: 700 }}>{c.tagline[0]}</div>
          <div style={{ fontSize: 64, fontWeight: 700 }}>
            <GradText>{c.tagline[1]}</GradText>
          </div>
        </Rise>
        <Rise delay={44} style={{ marginTop: 80 }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              padding: "26px 70px",
              borderRadius: 999,
              background: GRAD,
              transform: `scale(${pulse})`,
              boxShadow: `0 20px 60px ${K.blue}88`,
              direction: "ltr",
            }}
          >
            {c.url}
          </div>
        </Rise>
        <Rise delay={60} style={{ marginTop: 40 }}>
          <div style={{ fontSize: 40, fontWeight: 500, color: "#B9C3DE", direction: "ltr" }}>{c.email}</div>
        </Rise>
      </AbsoluteFill>
    </Frame>
  );
};

// انتقال ناعم بين المشاهد
const Shell: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const frame = useCurrentFrame();
  const inn = first ? 1 : interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const out = last ? 0 : interpolate(frame, [dur - 8, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: inn * (1 - out), transform: `scale(${1.04 - inn * 0.04 + out * 0.04})`, filter: `blur(${out * 10}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const EanaPromo: React.FC<{ lang: Lang }> = ({ lang }) => {
  const c = COPY[lang];
  const tl = timeline(lang);
  const scene = (i: number, dur: number) => {
    if (i === 0) return <Hook c={c} dur={dur} />;
    if (i === 1) return <LogoReveal c={c} />;
    if (i === 2) return <WhatWeDo c={c} dur={dur} />;
    if (i >= 3 && i <= 7) return <ServiceScene c={c} s={c.services[i - 3]} dur={dur} />;
    if (i === 8) return <OneSystem c={c} dur={dur} />;
    return <Outro c={c} />;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: K.deep }}>
      <Background />
      {tl.map(({ start, dur }, i) => (
        <Sequence key={i} from={start} durationInFrames={dur} name={`scene-${i + 1}`}>
          <Shell dur={dur} first={i === 0} last={i === tl.length - 1}>
            {scene(i, dur)}
            <Subtitle text={c.vo[i]} dur={dur} dir={c.dir} />
          </Shell>
        </Sequence>
      ))}
      {VOICE[lang] ? <Audio src={staticFile(`voice/eana-${lang}.mp3`)} /> : null}
    </AbsoluteFill>
  );
};
