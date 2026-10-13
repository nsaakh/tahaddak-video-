// نصوص فيديو إينا سمارت بالعربي والإنجليزي.
// vo = نص التعليق الصوتي (العربي مشكّل لـ ElevenLabs)، والترجمة على الشاشة تنشال منها الحركات تلقائياً.

export type Lang = "ar" | "en";

export type Service = {
  num: string;
  title: string;
  tagline: string;
  chips: string[];
  art: "ai" | "platforms" | "automation" | "data" | "transform";
};

export type Copy = {
  dir: "rtl" | "ltr";
  vo: string[]; // 10 جمل، وحدة لكل مشهد
  hook: { before: string; digital: string; after: string; intelligent: string };
  logoLine: string;
  saudi: string;
  steps: string[];
  clients: string[];
  ideaToLive: [string, string];
  services: Service[];
  fiveAreas: string;
  oneSystem: string;
  stages: string[];
  tagline: [string, string];
  url: string;
  email: string;
};

export const COPY: Record<Lang, Copy> = {
  en: {
    dir: "ltr",
    vo: [
      "The world isn't just going digital. It's going intelligent.",
      "Eana Smart Technology. A Saudi AI and digital transformation company.",
      "We design, build and operate intelligent systems for government entities and enterprises, from the first idea to live operation.",
      "Artificial Intelligence. AI assistants, generative AI, intelligent document processing and predictive analytics, built to solve real business problems.",
      "Digital Platforms and Applications. Web, mobile and enterprise apps, engineered around your business model.",
      "Intelligent Automation. Agents that understand, decide and act, running workflows end to end.",
      "Data Intelligence. Data platforms, dashboards and business intelligence, because data is the basis of every decision.",
      "Digital Transformation. Process redesign, service digitisation and systems integration.",
      "Five capability areas. One system. From discovery to launch, and beyond.",
      "Eana Smart Technology. Smarter today. Brighter tomorrow. eanasmart.com",
    ],
    hook: { before: "The world isn't just going", digital: "digital.", after: "It's going", intelligent: "intelligent." },
    logoLine: "AI & Digital Transformation",
    saudi: "A Saudi Company",
    steps: ["Design", "Build", "Operate"],
    clients: ["Government Entities", "Enterprises"],
    ideaToLive: ["First idea", "Live operation"],
    services: [
      {
        num: "01",
        title: "Artificial Intelligence",
        tagline: "We use AI to solve business problems — not to add a chatbot.",
        chips: ["AI Assistants", "Generative AI", "Intelligent Document Processing", "Predictive Analytics"],
        art: "ai",
      },
      {
        num: "02",
        title: "Digital Platforms & Applications",
        tagline: "We start from the business model — then engineer the platform that runs it.",
        chips: ["Web Applications", "Mobile Applications", "Enterprise Applications", "Customer Applications"],
        art: "platforms",
      },
      {
        num: "03",
        title: "Intelligent Automation",
        tagline: "Automation that understands, decides and acts.",
        chips: ["Document Processing", "Data Entry", "Request Classification", "Automated Responses"],
        art: "automation",
      },
      {
        num: "04",
        title: "Data Intelligence",
        tagline: "Data is not a report. It is the basis of every decision.",
        chips: ["Data Platforms", "Dashboards", "Business Intelligence", "Predictive Analytics"],
        art: "data",
      },
      {
        num: "05",
        title: "Digital Transformation",
        tagline: "From digital transformation to intelligent transformation.",
        chips: ["Process Redesign", "Service Digitisation", "Systems Integration", "Data Foundations"],
        art: "transform",
      },
    ],
    fiveAreas: "5 Capability Areas",
    oneSystem: "1 System",
    stages: [
      "Discover",
      "Diagnose",
      "Define",
      "Design",
      "Prototype",
      "Build",
      "Embed AI",
      "Automate & Integrate",
      "Launch",
      "Optimise & Scale",
    ],
    tagline: ["Smarter Today.", "Brighter Tomorrow."],
    url: "eanasmart.com",
    email: "info@eanasmart.com",
  },
  ar: {
    dir: "rtl",
    vo: [
      "العالَمُ لا يَتَحَوَّلُ إلى الرَّقْمِيِّ فَقَط… بَلْ إلى الذَّكِيّ.",
      "إينا سْمارْت… شَرِكَةٌ سُعودِيَّةٌ لِلذَّكاءِ الاصْطِناعِيِّ والتَّحَوُّلِ الرَّقْمِيّ.",
      "نُصَمِّمُ، ونَبْني، ونُشَغِّلُ أَنْظِمَةً ذَكِيَّةً لِلجِهاتِ الحُكومِيَّةِ والمُؤَسَّسات… مِنَ الفِكْرَةِ الأُولى، إلى التَّشْغيلِ الفِعْلِيّ.",
      "الذَّكاءُ الاصْطِناعِيّ: مُساعِداتٌ ذَكِيَّة، وذَكاءٌ تَوْليدِيّ، ومُعالَجَةٌ ذَكِيَّةٌ لِلمُسْتَنَدات، وتَحْليلاتٌ تَنَبُّئِيَّة… لِحَلِّ مُشْكِلاتِ الأَعْمالِ الحَقيقِيَّة.",
      "المِنَصّاتُ والتَّطْبيقاتُ الرَّقْمِيَّة: تَطْبيقاتُ وِيب، وجَوّال، ومُؤَسَّسات… تُبْنى حَوْلَ نَموذَجِ عَمَلِك.",
      "الأَتْمَتَةُ الذَّكِيَّة: وُكَلاءُ يَفْهَمون، ويُقَرِّرون، ويُنَفِّذون… ويُديرونَ سَيْرَ العَمَلِ مِنَ البِدايَةِ إلى النِّهايَة.",
      "ذَكاءُ البَيانات: مِنَصّاتُ بَيانات، ولَوْحاتُ مُؤَشِّرات، وذَكاءُ أَعْمال… لِأَنَّ البَياناتِ أَساسُ كُلِّ قَرار.",
      "التَّحَوُّلُ الرَّقْمِيّ: إِعادَةُ تَصْميمِ الإِجْراءات، ورَقْمَنَةُ الخَدَمات، وتَكامُلُ الأَنْظِمَة.",
      "خَمْسَةُ مَجالات… مَنْظومَةٌ واحِدَة. مِنَ الاكْتِشافِ إلى الإِطْلاق… وما بَعْدَه.",
      "إينا سْمارْت… أَذْكى اليَوْم، وأَكْثَرُ إِشْراقاً غَداً. eanasmart.com",
    ],
    hook: { before: "العالم لا يتحول إلى", digital: "الرقمي فقط", after: "بل إلى", intelligent: "الذكي" },
    logoLine: "الذكاء الاصطناعي والتحول الرقمي",
    saudi: "شركة سعودية",
    steps: ["نصمّم", "نبني", "نشغّل"],
    clients: ["الجهات الحكومية", "المؤسسات"],
    ideaToLive: ["الفكرة الأولى", "التشغيل الفعلي"],
    services: [
      {
        num: "01",
        title: "الذكاء الاصطناعي",
        tagline: "نوظّف الذكاء الاصطناعي لحل مشكلات الأعمال، لا لإضافة روبوت محادثة.",
        chips: ["مساعدات ذكية", "الذكاء التوليدي", "المعالجة الذكية للمستندات", "التحليلات التنبؤية"],
        art: "ai",
      },
      {
        num: "02",
        title: "المنصات والتطبيقات الرقمية",
        tagline: "نبدأ من نموذج العمل، ثم نبني المنصة التي تديره.",
        chips: ["تطبيقات الويب", "تطبيقات الجوال", "تطبيقات المؤسسات", "تطبيقات العملاء"],
        art: "platforms",
      },
      {
        num: "03",
        title: "الأتمتة الذكية",
        tagline: "أتمتة تفهم، وتقرر، وتنفّذ.",
        chips: ["معالجة المستندات", "إدخال البيانات", "تصنيف الطلبات", "الردود الآلية"],
        art: "automation",
      },
      {
        num: "04",
        title: "ذكاء البيانات",
        tagline: "البيانات ليست تقريراً، بل أساس كل قرار.",
        chips: ["منصات البيانات", "لوحات المؤشرات", "ذكاء الأعمال", "التحليلات التنبؤية"],
        art: "data",
      },
      {
        num: "05",
        title: "التحول الرقمي",
        tagline: "من التحول الرقمي إلى التحول الذكي.",
        chips: ["إعادة تصميم الإجراءات", "رقمنة الخدمات", "تكامل الأنظمة", "أسس البيانات"],
        art: "transform",
      },
    ],
    fiveAreas: "5 مجالات",
    oneSystem: "منظومة واحدة",
    stages: [
      "الاكتشاف",
      "التشخيص",
      "التحديد",
      "التصميم",
      "النموذج الأولي",
      "البناء",
      "دمج الذكاء الاصطناعي",
      "الأتمتة والتكامل",
      "الإطلاق",
      "التحسين والتوسع",
    ],
    tagline: ["أذكى اليوم…", "وأكثر إشراقاً غداً"],
    url: "eanasmart.com",
    email: "info@eanasmart.com",
  },
};

// مدة كل مشهد بالثواني — مضبوطة على الوقفات بين الجمل في ملفات الصوت
export const SCENE_SECS: Record<Lang, number[]> = {
  en: [3.85, 4.62, 7.98, 9.65, 6.56, 6.34, 7.41, 5.61, 5.19, 7.6],
  ar: [4.67, 5.77, 9.56, 12.28, 7.99, 8.97, 9.07, 6.53, 6.08, 7.89],
};

// لما يوصل الصوت: public/voice/eana-<lang>.mp3 ونغيّرها لـ true
export const VOICE: Record<Lang, boolean> = { en: true, ar: true };

export const stripTashkeel = (s: string) => s.replace(/[ً-ْٰ]/g, "");
