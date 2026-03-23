import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";

/* ─── Spring preset ──────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 280, damping: 22 };

/* ─── Fitness facts ──────────────────────────────────────────── */
const FITNESS_FACTS = [
  {
    icon: "🔥",
    title: "Calories Burned",
    value: "400–600 kcal",
    desc: "A typical 60-minute 5-a-side match burns as many calories as a 10 km run — in half the time.",
    color: "#ef4444",
  },
  {
    icon: "📏",
    title: "Distance Covered",
    value: "5–7 km",
    desc: "Players cover 5–7 km per match with constant sprinting, cutting, and positional movement on a compact pitch.",
    color: "#06b6d4",
  },
  {
    icon: "💪",
    title: "Muscle Groups",
    value: "Full Body",
    desc: "Quads, hamstrings, glutes, core, and calves all fire simultaneously — better than isolated gym exercises.",
    color: "#22c55e",
  },
  {
    icon: "❤️",
    title: "Heart Rate",
    value: "75–85% Max HR",
    desc: "5-a-side keeps your heart in the fat-burning and cardio zones for most of the match — superior aerobic training.",
    color: "#ec4899",
  },
  {
    icon: "🧠",
    title: "Mental Health",
    value: "Mood +40%",
    desc: "Team sport releases endorphins and serotonin. Studies show footballers report 40% higher wellbeing vs solo gym-goers.",
    color: "#a855f7",
  },
  {
    icon: "⚡",
    title: "Explosive Speed",
    value: "60+ Sprints",
    desc: "The stop-start nature of 5-a-side builds fast-twitch muscle fibres and reactive speed better than steady-state cardio.",
    color: "#f59e0b",
  },
];

/* ─── Questionnaire steps ───────────────────────────────────── */
const QUESTIONS = [
  {
    id: "age",
    label: "How old are you?",
    type: "options",
    options: ["Under 18", "18–25", "26–35", "36–45", "45+"],
  },
  {
    id: "weight",
    label: "What is your weight?",
    type: "options",
    options: ["Under 60 kg", "60–75 kg", "75–90 kg", "90–105 kg", "105+ kg"],
  },
  {
    id: "level",
    label: "What is your current fitness level?",
    type: "options",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: "position",
    label: "What position do you play?",
    type: "options",
    options: ["Goalkeeper (GK)", "Defender", "Midfielder", "Striker"],
  },
  {
    id: "goal",
    label: "What is your primary fitness goal?",
    type: "options",
    options: ["Endurance", "Speed", "Strength", "All-round"],
  },
];

/* ─── Plan generator ────────────────────────────────────────── */
function generatePlan({ age, weight, level, position, goal }) {
  const isBegin = level === "Beginner";
  const isAdv = level === "Advanced";

  const warmup = [
    "5 min light jog in place",
    "10x leg swings each leg",
    "10x hip circles each direction",
    isBegin ? "2 min dynamic stretching" : "3 min dynamic stretching + skips",
  ];

  const cooldown = [
    "5 min walking cool-down",
    "30s quad stretch each leg",
    "30s hamstring stretch each leg",
    "1 min deep breathing",
  ];

  const enduranceDays = [
    {
      day: "Monday",
      focus: "Aerobic Base",
      exercises: [
        isAdv ? "5 km tempo run (75% effort)" : "3 km easy jog",
        "20x shuttle runs (10m x 10)",
        "3 sets x 45s plank",
      ],
    },
    {
      day: "Wednesday",
      focus: "Game Simulation",
      exercises: [
        "30 min continuous 5-a-side rondo",
        isAdv ? "4 x 200m sprint intervals" : "2 x 200m sprint intervals",
        "15 min cool-down walk",
      ],
    },
    {
      day: "Friday",
      focus: "Lactate Threshold",
      exercises: [
        isAdv ? "6 x 3 min hard runs (90% effort) + 90s rest" : "4 x 2 min hard runs + 2 min rest",
        "Shuttle sprints: 5m, 10m, 15m x 5 sets",
        "Core: 3 x 20 bicycle crunches",
      ],
    },
  ];

  const speedDays = [
    {
      day: "Monday",
      focus: "Sprint Mechanics",
      exercises: [
        "10x 20m acceleration sprints",
        isAdv ? "8x 40m max-effort sprints" : "5x 40m strides",
        "Agility ladder: 4 patterns x 4 reps",
      ],
    },
    {
      day: "Wednesday",
      focus: "Change of Direction",
      exercises: [
        "T-drill: 6 reps each direction",
        "5-5-5 cone drill: 8 sets",
        isAdv ? "Plyometric box jumps: 4 x 10" : "Standing broad jumps: 3 x 8",
      ],
    },
    {
      day: "Friday",
      focus: "Speed Endurance",
      exercises: [
        isAdv ? "10 x 100m at 95% with 45s rest" : "6 x 100m at 85% with 60s rest",
        "Reactive sprint drills (partner call): 8 reps",
        "Footwork ladder: 5 min continuous",
      ],
    },
  ];

  const strengthDays = [
    {
      day: "Monday",
      focus: "Lower Body Power",
      exercises: [
        isAdv ? "4 x 8 heavy squats" : "3 x 12 bodyweight squats",
        isAdv ? "3 x 8 Romanian deadlifts" : "3 x 12 glute bridges",
        "3 x 10 lateral lunges each leg",
      ],
    },
    {
      day: "Wednesday",
      focus: "Core & Upper Body",
      exercises: [
        isAdv ? "4 x 12 push-ups weighted" : "3 x 10 push-ups",
        "3 x 15 dumbbell rows each arm",
        "3 x 30s hollow body hold",
        "Dead bugs: 3 x 10 each side",
      ],
    },
    {
      day: "Friday",
      focus: "Functional Power",
      exercises: [
        isAdv ? "5 x 5 jump squats (loaded)" : "3 x 10 jump squats (bodyweight)",
        "Medicine ball slams: 4 x 8",
        "Single-leg Romanian deadlift: 3 x 8 each",
        "Battle rope intervals: 4 x 20s",
      ],
    },
  ];

  const allRoundDays = [
    {
      day: "Monday",
      focus: "Speed + Lower Body",
      exercises: [
        "10x 20m sprints",
        isAdv ? "4 x 10 Bulgarian split squats" : "3 x 12 reverse lunges",
        "Agility ladder: 3 patterns",
        "3 x 45s plank",
      ],
    },
    {
      day: "Wednesday",
      focus: "Endurance + Core",
      exercises: [
        isAdv ? "4 km tempo run" : "2.5 km easy run",
        "Circuit: 3 rounds (10 push-ups, 15 sit-ups, 10 burpees, 20 mountain climbers)",
        "3 x 20 bicycle crunches",
      ],
    },
    {
      day: "Friday",
      focus: "Football Conditioning",
      exercises: [
        "5-a-side rondo: 20 min",
        "Sprint ladder: 10m, 20m, 30m x 6 sets",
        isAdv ? "4 x 10 plyometric jumps" : "3 x 8 squat jumps",
        "Dribbling + shooting drills: 10 min",
      ],
    },
  ];

  let workDays;
  if (goal === "Endurance") workDays = enduranceDays;
  else if (goal === "Speed") workDays = speedDays;
  else if (goal === "Strength") workDays = strengthDays;
  else workDays = allRoundDays;

  // Position-specific tips
  const positionTips = {
    "Goalkeeper (GK)": [
      "Add 3 x 10 lateral explosive jumps each session",
      "Practice reaction dives: partner rolls ball, dive and return — 4 x 6 each side",
      "Core stability is your foundation — add 2 x 60s plank to every session",
    ],
    Defender: [
      "Focus on 1v1 defensive footwork drills after every session",
      "Add 3 x 8 side shuffles + backpedal sprints per session",
      "Upper body strength (chest/shoulders) helps in physical duels — add 3 x 10 push-ups",
    ],
    Midfielder: [
      "Box-to-box running endurance is essential — add 5 min sustained sprint intervals",
      "Vision training: juggling + wall-pass combos after warm-up",
      "Add 2 x 20 calf raises for sustained running efficiency",
    ],
    Striker: [
      "Explosiveness off the mark wins games — do 3 x 10 explosive start drills",
      "Add 3 x 8 single-leg jumps for shooting power",
      "First touch + turn drill: 10 min each session to stay sharp in tight spaces",
    ],
  };

  const restDays = ["Tuesday", "Thursday", "Saturday", "Sunday"];
  const gameDay = "Saturday or Sunday (Match Day)";

  return {
    level,
    goal,
    position,
    workDays,
    warmup,
    cooldown,
    positionTips: positionTips[position] || [],
    restDays,
    gameDay,
  };
}

/* ─── Notification Opt-In ───────────────────────────────────── */
function NotificationSection() {
  const LS_KEY = "5s_fitness_subs";
  const [subs, setSubs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || { email: false, push: false, sms: false, whatsapp: false };
    } catch {
      return { email: false, push: false, sms: false, whatsapp: false };
    }
  });
  const [saved, setSaved] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const toggle = (key) => setSubs((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(subs));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const channels = [
    { key: "email", label: "Email", icon: "📧", desc: "Weekly plan every Sunday morning" },
    { key: "push", label: "Push Notifications", icon: "🔔", desc: "In-browser reminders on workout days" },
    { key: "sms", label: "SMS", icon: "💬", desc: "Short reminder texts on training days" },
    { key: "whatsapp", label: "WhatsApp", icon: "📱", desc: "Full plan dropped in your WhatsApp" },
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={SPRING}
      className="max-w-2xl mx-auto px-4 py-14"
    >
      <div
        className="rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2
          className="text-3xl text-white mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          GET YOUR PLAN EVERY SUNDAY
        </h2>
        <p className="text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)" }}>
          Choose how you want to receive your weekly 5-a-side fitness plan.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          {channels.map(({ key, label, icon, desc }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200"
              style={{
                background: subs[key] ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                border: subs[key] ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span className="text-2xl">{icon}</span>
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ fontFamily: "'Oswald', sans-serif", color: subs[key] ? "#22c55e" : "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}
                >
                  {label}
                </p>
                <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.4)" }}>
                  {desc}
                </p>
              </div>
              <span
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  background: subs[key] ? "#22c55e" : "transparent",
                  border: subs[key] ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.2)",
                }}
              >
                {subs[key] && <span className="text-xs font-bold text-black">✓</span>}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              className="w-full py-3 rounded-xl text-center text-sm font-semibold"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.06em",
                background: "linear-gradient(135deg, #22c55e, #06b6d4)",
                color: "#030712",
              }}
            >
              PREFERENCES SAVED!
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSave}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.06em",
                background: "linear-gradient(135deg, #22c55e, #06b6d4)",
                color: "#030712",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              SUBSCRIBE TO WEEKLY FITNESS PLAN
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* ─── Questionnaire ─────────────────────────────────────────── */
function FitnessQuestionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [plan, setPlan] = useState(null);
  const [showPlan, setShowPlan] = useState(false);

  const current = QUESTIONS[step];
  const progress = Math.round((step / QUESTIONS.length) * 100);
  const isLast = step === QUESTIONS.length - 1;

  const handleNext = () => {
    if (!selected) return;
    const updated = { ...answers, [current.id]: selected };
    setAnswers(updated);
    setSelected(null);
    if (isLast) {
      const generated = generatePlan(updated);
      setPlan(generated);
      setShowPlan(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setSelected(null);
    setPlan(null);
    setShowPlan(false);
  };

  const glassCard = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={SPRING}
        viewport={{ once: true, margin: "-60px" }}
        className="text-center mb-8"
      >
        <h2
          className="text-4xl md:text-5xl text-white mb-3"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          AI FITNESS TRAINER
        </h2>
        <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)" }}>
          Answer 5 quick questions to get your personalised 5-a-side weekly fitness plan.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showPlan ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={SPRING}
            className="rounded-2xl p-7"
            style={glassCard}
          >
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ fontFamily: "'Oswald', sans-serif", color: "rgba(255,255,255,0.4)" }}
                >
                  Step {step + 1} of {QUESTIONS.length}
                </span>
                <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "#22c55e" }}>
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{ background: "linear-gradient(90deg, #22c55e, #06b6d4)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Question */}
            <h3
              className="text-xl text-white mb-5"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em" }}
            >
              {current.label}
            </h3>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-6">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelected(opt)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: selected === opt ? "rgba(34,197,94,0.13)" : "rgba(255,255,255,0.04)",
                    border: selected === opt ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(255,255,255,0.07)",
                    color: selected === opt ? "#22c55e" : "rgba(255,255,255,0.8)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      border: selected === opt ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {selected === opt && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: "#22c55e" }}
                      />
                    )}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <motion.button
              onClick={handleNext}
              disabled={!selected}
              whileHover={selected ? { scale: 1.02 } : {}}
              whileTap={selected ? { scale: 0.98 } : {}}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.06em",
                background: selected
                  ? "linear-gradient(135deg, #22c55e, #06b6d4)"
                  : "rgba(255,255,255,0.06)",
                color: selected ? "#030712" : "rgba(255,255,255,0.25)",
                cursor: selected ? "pointer" : "not-allowed",
              }}
            >
              {isLast ? "GENERATE MY PLAN" : "NEXT"}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={SPRING}
          >
            {/* Plan header */}
            <div
              className="rounded-2xl p-6 mb-5 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(6,182,212,0.12))",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Oswald', sans-serif", color: "#06b6d4" }}
              >
                Your Personalised Plan
              </p>
              <h3
                className="text-3xl text-white mb-1"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
              >
                {plan.level} · {plan.goal} · {plan.position}
              </h3>
              <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)" }}>
                3 training days · 4 rest days · 1 match day per week
              </p>
            </div>

            {/* Warm-up */}
            <div className="rounded-2xl p-5 mb-4" style={glassCard}>
              <h4
                className="text-lg text-white mb-3"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em", color: "#f59e0b" }}
              >
                WARM-UP (Every Session)
              </h4>
              <ul className="flex flex-col gap-1.5">
                {plan.warmup.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.75)" }}>
                    <span style={{ color: "#f59e0b", marginTop: 2 }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Training days */}
            <div className="flex flex-col gap-4 mb-4">
              {plan.workDays.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SPRING, delay: i * 0.08 }}
                  className="rounded-2xl p-5"
                  style={glassCard}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: "0.06em",
                        background: "linear-gradient(135deg, rgba(34,197,94,0.25), rgba(6,182,212,0.2))",
                        color: "#22c55e",
                        border: "1px solid rgba(34,197,94,0.3)",
                      }}
                    >
                      {day.day}
                    </span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: "'Oswald', sans-serif", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}
                    >
                      {day.focus}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {day.exercises.map((ex, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm"
                        style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.8)" }}
                      >
                        <span style={{ color: "#22c55e", marginTop: 2, flexShrink: 0 }}>✓</span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Rest days */}
            <div className="rounded-2xl p-5 mb-4" style={glassCard}>
              <h4
                className="text-lg mb-3"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em", color: "#06b6d4" }}
              >
                REST DAYS
              </h4>
              <div className="flex flex-wrap gap-2">
                {plan.restDays.map((d) => (
                  <span
                    key={d}
                    className="px-3 py-1.5 rounded-lg text-xs"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      background: "rgba(6,182,212,0.1)",
                      color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(6,182,212,0.2)",
                    }}
                  >
                    {d} — Active Recovery or Full Rest
                  </span>
                ))}
              </div>
            </div>

            {/* Cool-down */}
            <div className="rounded-2xl p-5 mb-4" style={glassCard}>
              <h4
                className="text-lg mb-3"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em", color: "#a855f7" }}
              >
                COOL-DOWN (Every Session)
              </h4>
              <ul className="flex flex-col gap-1.5">
                {plan.cooldown.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.75)" }}>
                    <span style={{ color: "#a855f7", marginTop: 2 }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Position tips */}
            {plan.positionTips.length > 0 && (
              <div className="rounded-2xl p-5 mb-5" style={{ ...glassCard, border: "1px solid rgba(245,158,11,0.2)" }}>
                <h4
                  className="text-lg mb-3"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em", color: "#f59e0b" }}
                >
                  POSITION TIPS — {plan.position.toUpperCase()}
                </h4>
                <ul className="flex flex-col gap-2">
                  {plan.positionTips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm"
                      style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.8)" }}
                    >
                      <span style={{ color: "#f59e0b", marginTop: 2, flexShrink: 0 }}>⚡</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-sm font-semibold"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.06em",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              START OVER
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── Fitness facts section ──────────────────────────────────── */
function FitnessFactsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={SPRING}
        className="text-center mb-10"
      >
        <h2
          className="text-4xl md:text-5xl text-white mb-3"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          WHY 5-A-SIDE IS THE ULTIMATE WORKOUT
        </h2>
        <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)" }}>
          Science-backed reasons why the small pitch beats the big gym.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {FITNESS_FACTS.map((fact) => (
          <motion.div
            key={fact.title}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.97 },
              show: { opacity: 1, y: 0, scale: 1, transition: SPRING },
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{fact.icon}</span>
              <div>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ fontFamily: "'Oswald', sans-serif", color: fact.color }}
                >
                  {fact.title}
                </p>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
                >
                  {fact.value}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.55)" }}>
              {fact.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Main export ───────────────────────────────────────────── */
export default function FitnessPage() {
  useEffect(() => {
    document.title = "Fitness | 5s Arena";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#030712", minHeight: "100vh" }}>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "72vh" }}
      >
        {/* Pitch-line texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #052e16 0%, #042f2e 40%, #030712 100%)",
          }}
        />
        {/* Subtle pitch lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 58px, rgba(255,255,255,0.25) 58px, rgba(255,255,255,0.25) 60px), repeating-linear-gradient(90deg, transparent, transparent 58px, rgba(255,255,255,0.25) 58px, rgba(255,255,255,0.25) 60px)",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(34,197,94,0.2) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)",
          }}
        />

        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            className="text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "'Oswald', sans-serif", color: "#06b6d4" }}
          >
            5s Arena · Fitness Hub
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="text-white leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.2rem, 10vw, 8rem)",
              letterSpacing: "0.04em",
              background: "linear-gradient(135deg, #22c55e 0%, #06b6d4 60%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            GET FIT. PLAY HARDER.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.25 }}
            className="text-base max-w-xl mx-auto mb-8"
            style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}
          >
            Personalised 5-a-side training plans, fitness science, and weekly programmes — built for players, not gym rats.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.35 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a
              href="#trainer"
              className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.08em",
                background: "linear-gradient(135deg, #22c55e, #06b6d4)",
                color: "#030712",
              }}
            >
              GET MY PLAN
            </a>
            <Link
              to="/posts"
              className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.08em",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              READ ARTICLES
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── AI Trainer questionnaire ──────────────────────────── */}
      <div id="trainer">
        <FitnessQuestionnaire />
      </div>

      {/* ── Notification opt-in ───────────────────────────────── */}
      <NotificationSection />

      {/* ── Fitness facts ─────────────────────────────────────── */}
      <FitnessFactsSection />

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section className="text-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={SPRING}
          viewport={{ once: true, margin: "-60px" }}
        >
          <h2
            className="text-3xl md:text-4xl text-white mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
          >
            READY TO DOMINATE THE PITCH?
          </h2>
          <p className="text-sm mb-7" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)" }}>
            Check our latest tactical breakdowns and training articles.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/tactics"
              className="px-8 py-3 rounded-xl text-sm font-semibold"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.07em",
                background: "linear-gradient(135deg, #22c55e, #06b6d4)",
                color: "#030712",
              }}
            >
              TACTICS PAGE
            </Link>
            <Link
              to="/posts"
              className="px-8 py-3 rounded-xl text-sm font-semibold"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.07em",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              ALL POSTS
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
