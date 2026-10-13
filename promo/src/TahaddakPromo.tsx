import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { fontFamily } from "./fonts";

// ألوان مرحة للعائلة
const C = {
  bg: "#FFF4D6",
  ink: "#2B1D3A",
  sun: "#FFB703",
  coral: "#FF6B6B",
  sky: "#4CC9F0",
  mint: "#06D6A0",
  grape: "#9B5DE5",
};

const GAMES = [
  { name: "حروف", emoji: "🔤", color: C.sun },
  { name: "تحدي الفئات", emoji: "🏆", color: C.sky },
  { name: "مرطاخ", emoji: "⚡", color: C.coral },
  { name: "العبقري", emoji: "🧠", color: C.grape },
  { name: "أكمل المثل", emoji: "💬", color: C.mint },
  { name: "كلمة اليوم", emoji: "📅", color: C.sun },
];

const FEATURES = [
  { text: "أسئلة ما تتكرر أبداً", emoji: "♾️" },
  { text: "العب أونلاين أو مع أصحابك", emoji: "👨‍👩‍👧‍👦" },
  { text: "ركن الأطفال ومدرستي", emoji: "🎒" },
];

// خلفية بفقاعات متحركة
const Bubbles: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [C.sun, C.coral, C.sky, C.mint, C.grape, C.sun, C.sky, C.coral];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      {dots.map((color, i) => {
        const x = (i * 137) % 1080;
        const y = ((frame * (0.6 + i * 0.15)) + i * 260) % 2100 - 150;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: 1920 - y,
              width: 90 + i * 15,
              height: 90 + i * 15,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: 0.18,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Pop: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({
  children,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 140 } });
  return <div style={{ transform: `scale(${s})`, opacity: s, ...style }}>{children}</div>;
};

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily,
      direction: "rtl",
      textAlign: "center",
      color: C.ink,
      padding: 80,
    }}
  >
    {children}
  </AbsoluteFill>
);

// 1) الافتتاحية
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const wiggle = Math.sin(frame / 6) * 4;
  return (
    <Center>
      <Pop>
        <div
          style={{
            fontSize: 230,
            fontWeight: 900,
            color: C.coral,
            transform: `rotate(${wiggle}deg)`,
            textShadow: `12px 12px 0 ${C.sun}`,
          }}
        >
          تحداك
        </div>
      </Pop>
      <Pop delay={20}>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 40 }}>
          منصة الألعاب الثقافية للعائلة كلها
        </div>
      </Pop>
    </Center>
  );
};

// 2) الخطّاف
const Hook: React.FC = () => (
  <Center>
    <Pop>
      <div style={{ fontSize: 150 }}>🥱</div>
    </Pop>
    <Pop delay={12}>
      <div style={{ fontSize: 90, fontWeight: 900, lineHeight: 1.4 }}>
        مللت من نفس الأسئلة؟
      </div>
    </Pop>
    <Pop delay={30}>
      <div style={{ fontSize: 110, fontWeight: 900, color: C.grape, marginTop: 30 }}>
        جرّب تحداك! 🎉
      </div>
    </Pop>
  </Center>
);

// 3) الألعاب
const GameCard: React.FC<{ game: (typeof GAMES)[number]; index: number }> = ({ game, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fromRight = index % 2 === 0;
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 120 } });
  const x = interpolate(s, [0, 1], [fromRight ? 1200 : -1200, 0]);
  return (
    <div
      style={{
        transform: `translateX(${x}px) rotate(${(1 - s) * (fromRight ? 15 : -15)}deg)`,
        backgroundColor: game.color,
        borderRadius: 60,
        padding: "60px 80px",
        display: "flex",
        alignItems: "center",
        gap: 50,
        boxShadow: `0 20px 0 ${C.ink}22`,
        width: 850,
      }}
    >
      <div style={{ fontSize: 150 }}>{game.emoji}</div>
      <div style={{ fontSize: 100, fontWeight: 900, color: "#fff" }}>{game.name}</div>
    </div>
  );
};

const Games: React.FC = () => {
  const per = 60;
  return (
    <Center>
      <div style={{ fontSize: 80, fontWeight: 900, position: "absolute", top: 180 }}>
        أكثر من ١٠ ألعاب 🎮
      </div>
      {GAMES.map((g, i) => (
        <Sequence key={g.name} from={i * per} durationInFrames={per} layout="none">
          <GameCard game={g} index={i} />
        </Sequence>
      ))}
    </Center>
  );
};

// 4) المميزات
const Features: React.FC = () => (
  <Center>
    <div style={{ display: "flex", flexDirection: "column", gap: 70 }}>
      {FEATURES.map((f, i) => (
        <Pop key={f.text} delay={i * 25}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              padding: "50px 70px",
              display: "flex",
              alignItems: "center",
              gap: 40,
              border: `8px solid ${[C.sun, C.sky, C.mint][i]}`,
            }}
          >
            <div style={{ fontSize: 110 }}>{f.emoji}</div>
            <div style={{ fontSize: 68, fontWeight: 800 }}>{f.text}</div>
          </div>
        </Pop>
      ))}
    </div>
  </Center>
);

// 5) الختام
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 5) * 0.05;
  return (
    <Center>
      <Pop>
        <div style={{ fontSize: 100, fontWeight: 900, lineHeight: 1.3 }}>
          العب مجاناً الآن 🎁
        </div>
      </Pop>
      <Pop delay={15}>
        <div
          style={{
            marginTop: 60,
            backgroundColor: C.coral,
            color: "#fff",
            fontSize: 80,
            fontWeight: 900,
            padding: "40px 90px",
            borderRadius: 999,
            transform: `scale(${pulse})`,
            boxShadow: `0 15px 0 ${C.ink}33`,
            direction: "ltr",
          }}
        >
          tahaddak.com
        </div>
      </Pop>
      <Pop delay={30}>
        <div style={{ fontSize: 56, marginTop: 70, fontWeight: 700 }}>
          تحدّى أهلك وأصحابك 💪
        </div>
      </Pop>
    </Center>
  );
};

// انتقال بسيط بين المشاهد
const Scene: React.FC<{ from: number; duration: number; children: React.ReactNode }> = ({
  from,
  duration,
  children,
}) => {
  const Inner: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.ease,
    });
    return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
  };
  return (
    <Sequence from={from} durationInFrames={duration}>
      <Inner />
    </Sequence>
  );
};

export const TahaddakPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Bubbles />
      <Scene from={0} duration={120}><Intro /></Scene>
      <Scene from={120} duration={120}><Hook /></Scene>
      <Scene from={240} duration={360}><Games /></Scene>
      <Scene from={600} duration={210}><Features /></Scene>
      <Scene from={810} duration={240}><Outro /></Scene>
    </AbsoluteFill>
  );
};
