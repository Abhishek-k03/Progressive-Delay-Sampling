// src/hooks/useProgressiveDecaySampler.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Mulberry32 fallback PRNG for seeding without deps
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function useProgressiveDecaySampler({
  N,
  initialDecay = 0.5, // exponential factor
  decayType = "exponential", // 'exponential' | 'linear' | 'custom'
  linearStep = 0.1, // linear decrement per hit
  customDecay, // (w, i) => number
  speedMs = 500,
  turbo = false, // draw rapidly via rAF
  autoPlayMode = "stop", // 'stop' | 'loop' | 'infinite'
  seed, // string | number
  maxHistory = 2000, // history cap to bound memory
}) {
  const [weights, setWeights] = useState(() => Array(N).fill(1));
  const [collected, setCollected] = useState(() => new Set());
  const [history, setHistory] = useState([]);
  const [turn, setTurn] = useState(0);
  const [running, setRunning] = useState(false);
  const [lastDraw, setLastDraw] = useState(null);
  const [drawCounts, setDrawCounts] = useState(() => Array(N).fill(0)); // NEW

  // refs for fast reads in callbacks
  const decayRef = useRef(initialDecay);
  const linearRef = useRef(linearStep);
  const decayTypeRef = useRef(decayType);
  const customDecayRef = useRef(customDecay);
  const modeRef = useRef(autoPlayMode);
  const maxHistoryRef = useRef(maxHistory);

  // Seeded RNG
  const rng = useMemo(() => {
    if (seed === undefined || seed === null || seed === "") return Math.random;
    // If using seedrandom:
    // const srng = seedrandom(String(seed));
    // return () => srng();
    const s =
      typeof seed === "number"
        ? seed
        : Array.from(String(seed)).reduce((a, c) => a + c.charCodeAt(0), 0);
    const gen = mulberry32(s);
    return () => gen();
  }, [seed]);

  // Derived
  const total = useMemo(() => weights.reduce((a, b) => a + b, 0), [weights]);
  const probs = useMemo(
    () =>
      weights.map((w, i) => ({
        name: String(i + 1),
        prob: total > 0 ? w / total : 0,
      })),
    [weights, total]
  );

  const applyDecay = useCallback((w, i) => {
    const t = decayTypeRef.current;
    if (t === "exponential") return w * decayRef.current;
    if (t === "linear") return Math.max(0, w - linearRef.current);
    if (t === "custom" && typeof customDecayRef.current === "function") {
      return Math.max(0, customDecayRef.current(w, i));
    }
    return w;
  }, []);

  const reinitRound = useCallback(() => {
    setCollected(new Set());
    setWeights(Array(N).fill(1));
    setHistory([]);
    setTurn(0);
    setLastDraw(null);
    setDrawCounts(Array(N).fill(0)); // NEW
  }, [N]);

  const drawOnce = useCallback(() => {
    const complete = collected.size === N;
    if (complete) {
      if (modeRef.current === "loop") {
        reinitRound();
        return;
      }
      if (modeRef.current === "stop") return;
      // 'infinite': proceed but nothing new is collected
    }

    const totalW = weights.reduce((a, b) => a + b, 0);
    if (totalW <= 0) return;

    const r = rng() * totalW;
    let s = 0,
      chosen = 0;
    for (let i = 0; i < N; i++) {
      s += weights[i];
      if (r <= s) {
        chosen = i;
        break;
      }
    }

    const newWeights = weights.slice();
    newWeights[chosen] = applyDecay(newWeights[chosen], chosen);

    const nextCollected = new Set(collected);
    nextCollected.add(chosen);

    const nextTurn = turn + 1;
    const nextCollectedCount = nextCollected.size;

    setWeights(newWeights);
    setCollected(nextCollected);
    setTurn(nextTurn);
    setLastDraw(chosen);
    setHistory((prev) => {
      const next = [...prev, { turn: nextTurn, collected: nextCollectedCount }];
      const cap = maxHistoryRef.current ?? 2000;
      return cap > 0 ? next.slice(-cap) : next;
    });
    setDrawCounts((prev) => {
      // NEW
      const next = prev.slice();
      next[chosen] = (next[chosen] ?? 0) + 1;
      return next;
    });
  }, [N, collected, turn, weights, rng, applyDecay, reinitRound]);

  // Autoplay interval or turbo loop
  useEffect(() => {
    if (!running) return;
    if (turbo) {
      let raf;
      const loop = () => {
        // Do several draws per frame for speed
        for (let i = 0; i < 20; i++) drawOnce();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    } else {
      const id = setInterval(drawOnce, speedMs);
      return () => clearInterval(id);
    }
  }, [running, turbo, speedMs, drawOnce]);

  // Reinitialize when structural inputs change
  useEffect(() => {
    reinitRound();
  }, [N, decayType, initialDecay, linearStep, customDecay, reinitRound]);

  // Sync refs
  useEffect(() => {
    decayRef.current = initialDecay;
  }, [initialDecay]);
  useEffect(() => {
    linearRef.current = linearStep;
  }, [linearStep]);
  useEffect(() => {
    decayTypeRef.current = decayType;
  }, [decayType]);
  useEffect(() => {
    customDecayRef.current = customDecay;
  }, [customDecay]);
  useEffect(() => {
    modeRef.current = autoPlayMode;
  }, [autoPlayMode]);
  useEffect(() => {
    maxHistoryRef.current = maxHistory;
  }, [maxHistory]);

  const reset = useCallback(() => reinitRound(), [reinitRound]);
  const toggleRunning = useCallback(() => setRunning((v) => !v), []);

  // Export / Import
  const exportSettings = useCallback(() => {
    return JSON.stringify(
      {
        N,
        decayType,
        initialDecay,
        linearStep,
        autoPlayMode,
        seed,
        speedMs,
        turbo,
        maxHistory,
      },
      null,
      2
    );
  }, [
    N,
    decayType,
    initialDecay,
    linearStep,
    autoPlayMode,
    seed,
    speedMs,
    turbo,
    maxHistory,
  ]);

  const importSettings = useCallback((json) => {
    const cfg = JSON.parse(json);
    return cfg;
  }, []);

  return {
    weights,
    probs,
    total,
    collected,
    history,
    turn,
    running,
    lastDraw,
    drawCounts, // NEW
    drawOnce,
    reset,
    toggleRunning,
    exportSettings,
    importSettings,
  };
}
