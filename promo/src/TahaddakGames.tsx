import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./fonts";

// فيديو "كل ألعاب تحداك" — عمودي 1080×1920
export const FPS = 30;

// لما يجهز التعليق الصوتي: حط الملفات في public/voice/<id>.mp3 وخلّها true
const VOICE_READY = false;

const C = {
  navy: "#0B1533",
  navy2: "#16245A",
  gold: "#FFC93C",
  gold2: "#FF9F1C",
  white: "#FFFFFF",
  coral: "#FF6B6B",
  sky: "#4CC9F0",
  mint: "#06D6A0",
  grape: "#9B5DE5",
  pink: "#F15BB5",
  orange: "#FF8C42",
};

type Clip = { src: string; rate?: number };
type Chip = { name: string; emoji: string };

type SceneDef = {
  id: string;
  kind: "intro" | "game" | "chips" | "soon" | "outro";
  sec: number;
  vo: string;
  title?: string;
  emoji?: string;
  color?: string;
  clips?: Clip[];
  chips?: Chip[];
};

export const SCENES: SceneDef[] = [
  { id: "01-intro", kind: "intro", sec: 3.6, vo: "يا هلا! جمعتكم حلوة… بس ناقصها شي… تحدي!" },
  {
    id: "02-tease",
    kind: "game",
    sec: 3.6,
    vo: "تحداك… عشرين لعبة، للكبار والصغار!",
    title: "تحداك",
    emoji: "🎮",
    color: C.gold2,
    clips: [{ src: "home" }],
  },
  {
    id: "03-huroof",
    kind: "game",
    sec: 5,
    vo: "في تحدي الحروف: اختر حرفك، جاوب صح، وصِل خطّك قبل الفريق الثاني!",
    title: "تحدي الحروف",
    emoji: "🔤",
    color: C.mint,
    clips: [{ src: "huroof" }],
  },
  {
    id: "04-fiat",
    kind: "game",
    sec: 5.6,
    vo: "تحدي الفئات: كل فريق يختار ثلاث فئات، من ميتين لثمانمية نقطة… وكل ما زادت النقاط، زادت الحرارة!",
    title: "تحدي الفئات",
    emoji: "🏆",
    color: C.coral,
    clips: [{ src: "fiat" }],
  },
  {
    id: "05-asra",
    kind: "game",
    sec: 4.4,
    vo: "الأسرع: كلكم تجاوبون من جوالاتكم… والأسرع يطلع منصة التتويج!",
    title: "الأسرع",
    emoji: "⚡",
    color: C.gold2,
    clips: [{ src: "asra" }],
  },
  {
    id: "06-mnana",
    kind: "game",
    sec: 4,
    vo: "من أنا؟ خمس تلميحات… كل ما عرفت أبكر، كسبت أكثر!",
    title: "من أنا؟",
    emoji: "🕵️",
    color: C.grape,
    clips: [{ src: "mnana", rate: 1.5 }],
  },
  {
    id: "07-sahkhata",
    kind: "game",
    sec: 3.3,
    vo: "صح أو خطأ؟ ثمان ثواني بس… قرّر!",
    title: "صح أو خطأ",
    emoji: "✅",
    color: C.pink,
    clips: [{ src: "sahkhata", rate: 1.3 }],
  },
  {
    id: "08-akthar",
    kind: "game",
    sec: 3.5,
    vo: "الأكثر أو الأقل: أيهم أعلى؟ خمّن وكمّل السلسلة!",
    title: "الأكثر أو الأقل",
    emoji: "↕️",
    color: C.orange,
    clips: [{ src: "akthar", rate: 1.6 }],
  },
  {
    id: "09-sura",
    kind: "game",
    sec: 3.6,
    vo: "في أي سورة؟ تطلع لك آية… وانت تعرف سورتها.",
    title: "في أي سورة؟",
    emoji: "📖",
    color: C.mint,
    clips: [{ src: "sura", rate: 1.6 }],
  },
  {
    id: "10-mathal",
    kind: "game",
    sec: 4,
    vo: "وأكمل المثل… صاحب الحاجة…؟ أرعن!",
    title: "أكمل المثل",
    emoji: "💬",
    color: C.coral,
    clips: [{ src: "mathal", rate: 1.6 }],
  },
  {
    id: "11-cards",
    kind: "game",
    sec: 5,
    vo: "وللمّة الحلوة: جاكارو بالورق والكرات، ولودو والنرد يحكم!",
    title: "جاكارو ولودو",
    emoji: "🎲",
    color: C.sky,
    clips: [{ src: "jackaroo", rate: 2 }, { src: "ludo", rate: 2 }],
  },
  {
    id: "12-brain",
    kind: "chips",
    sec: 5.4,
    vo: "تبي تشغّل مخك؟ كلمة اليوم، عشرة، بلوكات بنقشة السدو، والمتقاطعة.",
    title: "ألعاب الذكاء",
    emoji: "🧠",
    color: C.grape,
    clips: [{ src: "blocks", rate: 3 }],
    chips: [
      { name: "كلمة اليوم", emoji: "📅" },
      { name: "عشرة", emoji: "🔟" },
      { name: "بلوكات", emoji: "🧱" },
      { name: "متقاطعة", emoji: "✏️" },
    ],
  },
  {
    id: "13-board",
    kind: "chips",
    sec: 6.2,
    vo: "وألعاب المجالس: مرطاخ، الضامة، الشطرنج حتى ثلاثي الأبعاد، إكس أو وأربعة في خط!",
    title: "ألعاب المجالس",
    emoji: "♟️",
    color: C.gold2,
    clips: [{ src: "martakh", rate: 3 }, { src: "chess", rate: 2.5 }],
    chips: [
      { name: "مرطاخ", emoji: "⚫" },
      { name: "الضامة", emoji: "🔴" },
      { name: "الشطرنج", emoji: "♞" },
      { name: "إكس أو", emoji: "❌" },
      { name: "أربعة في خط", emoji: "🟡" },
    ],
  },
  {
    id: "14-kids",
    kind: "game",
    sec: 7,
    vo: "وللصغار ركن الأطفال: مسابقات على قدّهم، ألعاب ذكاء، ومدرستي يراجعون دروسهم وهم يلعبون… وبدون أونلاين مع غرباء.",
    title: "ركن الأطفال",
    emoji: "🧸",
    color: C.pink,
    clips: [{ src: "kids" }],
  },
  {
    id: "15-madrasti",
    kind: "game",
    sec: 4.4,
    vo: "وحتى طلاب المتوسط والثانوي: اختر صفك ومادتك… وتحدّى!",
    title: "مدرستي",
    emoji: "🎒",
    color: C.sky,
    clips: [{ src: "madrasti", rate: 1.5 }],
  },
  {
    id: "16-soon",
    kind: "soon",
    sec: 4.6,
    vo: "وقريب: كيرم، وين المكان؟، وفتوحات المملكة!",
    title: "قريباً",
    emoji: "🚀",
    color: C.mint,
    chips: [
      { name: "كيرم", emoji: "🎯" },
      { name: "وين المكان؟", emoji: "🗺️" },
      { name: "فتوحات المملكة", emoji: "🏰" },
    ],
  },
  {
    id: "17-outro",
    kind: "outro",
    sec: 5.5,
    vo: "جمعتكم أحلى مع تحداك… ادخل الحين tahaddak.com وتحدّاهم!",
  },
];

const frames = (s: SceneDef) => Math.round(s.sec * FPS);
export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + frames(s), 0);

// ───────── عناصر مشتركة ─────────

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [C.gold, C.coral, C.sky, C.mint, C.grape, C.pink, C.gold, C.sky, C.coral, C.mint];
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 30%, ${C.navy2} 0%, ${C.navy} 70%)`,
        overflow: "hidden",
      }}
    >
      {dots.map((color, i) => {
        const size = 70 + ((i * 37) % 110);
        const x = (i * 211) % 1080;
        const y = (frame * (0.8 + (i % 4) * 0.35) + i * 230) % 2200;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: 1920 + 150 - y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: 0.13,
              filter: "blur(2px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const usePop = (delay = 0, damping = 10) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 150 } });
};

const Pop: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({
  children,
  delay = 0,
  style,
}) => {
  const s = usePop(delay);
  return <div style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), ...style }}>{children}</div>;
};

const Base: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ fontFamily, direction: "rtl", color: C.white, alignItems: "center" }}>
    {children}
  </AbsoluteFill>
);

const TitlePill: React.FC<{ title: string; emoji: string; color: string }> = ({ title, emoji, color }) => {
  const s = usePop(0, 9);
  const y = interpolate(s, [0, 1], [-200, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        transform: `translateY(${y}px) rotate(${(1 - s) * -8}deg)`,
        background: color,
        borderRadius: 999,
        padding: "18px 64px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        boxShadow: `0 14px 0 rgba(0,0,0,0.25)`,
      }}
    >
      <span style={{ fontSize: 84 }}>{emoji}</span>
      <span style={{ fontSize: 92, fontWeight: 900, textShadow: "0 5px 0 rgba(0,0,0,0.2)" }}>{title}</span>
    </div>
  );
};

const Phone: React.FC<{ clips: Clip[]; color: string; width: number; height: number; top: number; dur: number }> = ({
  clips,
  color,
  width,
  height,
  top,
  dur,
}) => {
  const frame = useCurrentFrame();
  const s = usePop(6, 12);
  const y = interpolate(s, [0, 1], [500, 0]);
  const tilt = Math.sin(frame / 22) * 1.2;
  const part = Math.ceil(dur / clips.length);
  return (
    <div
      style={{
        position: "absolute",
        top,
        width,
        height,
        transform: `translateY(${y}px) rotate(${tilt + (1 - s) * 10}deg)`,
        borderRadius: 64,
        border: `14px solid #070D22`,
        boxShadow: `0 0 0 8px ${color}, 0 40px 80px rgba(0,0,0,0.5)`,
        overflow: "hidden",
        background: "#000",
      }}
    >
      {clips.map((c, i) => (
        <Sequence key={c.src} from={i * part} durationInFrames={part} layout="none">
          <OffthreadVideo
            src={staticFile(`clips/${c.src}.mp4`)}
            muted
            playbackRate={c.rate ?? 1}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
        </Sequence>
      ))}
    </div>
  );
};

// الكلام المكتوب يطلع كلمة كلمة مع التعليق
const Caption: React.FC<{ text: string; dur: number; top?: number }> = ({ text, dur, top = 1500 }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const span = dur * 0.78;
  return (
    <div
      style={{
        position: "absolute",
        top,
        width: 960,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 18px",
        fontSize: 58,
        fontWeight: 800,
        lineHeight: 1.45,
        textAlign: "center",
      }}
    >
      {words.map((w, i) => {
        const at = 6 + (i / words.length) * span;
        const p = interpolate(frame, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span
            key={i}
            style={{
              opacity: 0.25 + p * 0.75,
              transform: `translateY(${(1 - p) * 14}px)`,
              color: p > 0.5 ? C.white : "#9AA6CF",
              direction: /[a-z]/i.test(w) ? "ltr" : "rtl",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const ChipRow: React.FC<{ chips: Chip[]; color: string; top: number; delay: number; gap: number }> = ({
  chips,
  color,
  top,
  delay,
  gap,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      width: 1000,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 20,
    }}
  >
    {chips.map((c, i) => (
      <Pop key={c.name} delay={delay + i * gap}>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            border: `5px solid ${color}`,
            borderRadius: 999,
            padding: "10px 34px",
            fontSize: 50,
            fontWeight: 800,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <span>{c.emoji}</span>
          <span>{c.name}</span>
        </div>
      </Pop>
    ))}
  </div>
);

// ───────── المشاهد ─────────

const Intro: React.FC<{ s: SceneDef; dur: number }> = () => {
  const frame = useCurrentFrame();
  const shake = frame > 62 ? Math.sin(frame * 1.7) * Math.max(0, 8 - (frame - 62) * 0.5) : 0;
  return (
    <Base>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40 }}>
        <Pop>
          <div style={{ fontSize: 120 }}>👋</div>
        </Pop>
        <Pop delay={8}>
          <div style={{ fontSize: 86, fontWeight: 900 }}>يا هلا!</div>
        </Pop>
        <Pop delay={24}>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#C9D2F0" }}>جمعتكم حلوة… بس ناقصها شي</div>
        </Pop>
        <Pop delay={60}>
          <div
            style={{
              fontSize: 210,
              fontWeight: 1000,
              color: C.gold,
              textShadow: `10px 10px 0 ${C.coral}`,
              transform: `translateX(${shake}px) rotate(${shake / 2}deg)`,
            }}
          >
            تحدي!
          </div>
        </Pop>
      </AbsoluteFill>
    </Base>
  );
};

const Game: React.FC<{ s: SceneDef; dur: number }> = ({ s, dur }) => (
  <Base>
    <TitlePill title={s.title!} emoji={s.emoji!} color={s.color!} />
    <Phone clips={s.clips!} color={s.color!} width={760} height={1040} top={380} dur={dur} />
    {s.id === "02-tease" ? (
      <Pop delay={18} style={{ position: "absolute", top: 330, left: 70 }}>
        <div
          style={{
            background: C.coral,
            borderRadius: "50%",
            width: 230,
            height: 230,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-12deg)",
            boxShadow: "0 12px 0 rgba(0,0,0,0.25)",
            lineHeight: 1.05,
          }}
        >
          <span style={{ fontSize: 96, fontWeight: 1000 }}>20</span>
          <span style={{ fontSize: 44, fontWeight: 900 }}>لعبة</span>
        </div>
      </Pop>
    ) : null}
    <Caption text={s.vo} dur={dur} />
  </Base>
);

const Chips: React.FC<{ s: SceneDef; dur: number }> = ({ s, dur }) => (
  <Base>
    <TitlePill title={s.title!} emoji={s.emoji!} color={s.color!} />
    <Phone clips={s.clips!} color={s.color!} width={600} height={800} top={360} dur={dur} />
    <ChipRow chips={s.chips!} color={s.color!} top={1220} delay={14} gap={Math.round((dur * 0.6) / s.chips!.length)} />
    <Caption text={s.vo} dur={dur} top={1560} />
  </Base>
);

const Soon: React.FC<{ s: SceneDef; dur: number }> = ({ s, dur }) => {
  const frame = useCurrentFrame();
  return (
    <Base>
      <TitlePill title={s.title!} emoji={s.emoji!} color={s.color!} />
      <div style={{ position: "absolute", top: 420, display: "flex", flexDirection: "column", gap: 44 }}>
        {s.chips!.map((c, i) => (
          <Pop key={c.name} delay={10 + i * 22}>
            <div
              style={{
                width: 820,
                background: "rgba(255,255,255,0.08)",
                border: `6px dashed ${[C.gold, C.sky, C.mint][i]}`,
                borderRadius: 50,
                padding: "34px 50px",
                display: "flex",
                alignItems: "center",
                gap: 36,
                transform: `rotate(${Math.sin((frame + i * 20) / 14) * 1.5}deg)`,
              }}
            >
              <span style={{ fontSize: 96 }}>{c.emoji}</span>
              <span style={{ fontSize: 62, fontWeight: 900, flex: 1, whiteSpace: "nowrap" }}>{c.name}</span>
              <span
                style={{
                  background: C.coral,
                  borderRadius: 999,
                  padding: "4px 26px",
                  fontSize: 36,
                  fontWeight: 800,
                }}
              >
                قريباً
              </span>
            </div>
          </Pop>
        ))}
      </div>
      <Caption text={s.vo} dur={dur} top={1560} />
    </Base>
  );
};

const Outro: React.FC<{ s: SceneDef; dur: number }> = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 5) * 0.05;
  return (
    <Base>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Pop>
          <div style={{ fontSize: 64, fontWeight: 800, color: "#C9D2F0" }}>جمعتكم أحلى مع</div>
        </Pop>
        <Pop delay={8}>
          <div
            style={{
              fontSize: 250,
              fontWeight: 1000,
              color: C.gold,
              textShadow: `12px 12px 0 ${C.coral}`,
              transform: `rotate(${Math.sin(frame / 7) * 3}deg)`,
              lineHeight: 1.3,
            }}
          >
            تحداك
          </div>
        </Pop>
        <Pop delay={40}>
          <div
            style={{
              marginTop: 50,
              background: `linear-gradient(180deg, ${C.gold} 0%, ${C.gold2} 100%)`,
              color: C.navy,
              fontSize: 86,
              fontWeight: 1000,
              padding: "30px 90px",
              borderRadius: 999,
              transform: `scale(${pulse})`,
              boxShadow: "0 16px 0 rgba(0,0,0,0.3)",
              direction: "ltr",
            }}
          >
            tahaddak.com
          </div>
        </Pop>
        <Pop delay={75}>
          <div style={{ fontSize: 76, fontWeight: 900, marginTop: 80 }}>وتحدّاهم! 💪</div>
        </Pop>
        <Pop delay={95}>
          <div style={{ fontSize: 44, fontWeight: 700, marginTop: 30, color: "#C9D2F0" }}>
            للكبار والصغار • أونلاين أو على نفس الشاشة
          </div>
        </Pop>
      </AbsoluteFill>
    </Base>
  );
};

const SCENE_COMPONENTS: Record<SceneDef["kind"], React.FC<{ s: SceneDef; dur: number }>> = {
  intro: Intro,
  game: Game,
  chips: Chips,
  soon: Soon,
  outro: Outro,
};

// دخول وخروج المشهد
const SceneShell: React.FC<{ dur: number; children: React.ReactNode; last: boolean }> = ({ dur, children, last }) => {
  const frame = useCurrentFrame();
  const out = last ? 0 : interpolate(frame, [dur - 7, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.08})` }}>{children}</AbsoluteFill>
  );
};

export const TahaddakGames: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      <Background />
      {SCENES.map((s, i) => {
        const dur = frames(s);
        const Comp = SCENE_COMPONENTS[s.kind];
        const start = from;
        from += dur;
        return (
          <Sequence key={s.id} from={start} durationInFrames={dur} name={s.id}>
            <SceneShell dur={dur} last={i === SCENES.length - 1}>
              <Comp s={s} dur={dur} />
            </SceneShell>
            {VOICE_READY ? <Audio src={staticFile(`voice/${s.id}.mp3`)} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
