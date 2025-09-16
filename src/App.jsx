// src/App.jsx
import { useState, useCallback } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import AnimatedBackground from "./components/AnimatedBackground";
import BallsGrid from "./components/BallsGrid";
import Controls from "./components/Controls";
import ProbabilityChart from "./components/ProbabilityChart";
import ProgressChart from "./components/ProgressChart";
import AdvancedControls from "./components/AdvancedControls";
import { darkTheme } from "./theme";
import { useProgressiveDecaySampler } from "./hooks/useProgressiveDecaySampler";

export default function App() {
  const [adv, setAdv] = useState({
    N: 10,
    decayType: "exponential",
    initialDecay: 0.5,
    linearStep: 0.1,
    autoPlayMode: "stop",
    seed: "",
    speedMs: 500,
    turbo: false,
    displayMode: "linear",
    maxHistory: 2000,
  });

  const customDecayFn = useCallback((w, i) => w * 0.8, []);

  const {
    weights,
    probs,
    total,
    collected,
    history,
    turn,
    running,
    lastDraw,
    drawOnce,
    drawCounts,
    reset,
    toggleRunning,
    exportSettings,
    importSettings,
  } = useProgressiveDecaySampler({
    N: adv.N,
    initialDecay: adv.initialDecay,
    decayType: adv.decayType,
    linearStep: adv.linearStep,
    customDecay: adv.decayType === "custom" ? customDecayFn : undefined,
    speedMs: adv.speedMs,
    turbo: adv.turbo,
    autoPlayMode: adv.autoPlayMode,
    seed: adv.seed?.length ? adv.seed : undefined,
    maxHistory: adv.maxHistory,
  });

  const canComplete = collected.size === adv.N;

  const patchAdvanced = (patch) => setAdv((s) => ({ ...s, ...patch }));

  const handleApply = () => reset();

  const handleExport = () => {
    const json = exportSettings();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sampler-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (json) => {
    try {
      const cfg = importSettings(json);
      setAdv((s) => ({ ...s, ...cfg }));
      reset();
    } catch (e) {
      alert("Invalid settings JSON");
    }
  };

  // Quick-access decay maps to exponential factor
  const handleChangeDecayQuick = (val) => {
    patchAdvanced({ initialDecay: val, decayType: "exponential" });
  };

  return (
    <StyledThemeProvider theme={darkTheme}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AnimatedBackground />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: "16px",
              background: "rgba(30, 30, 30, 0.85)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
              sx={{ textShadow: "0 0 8px rgba(144, 202, 249, 0.5)" }}
            >
              Progressive Decay Sampling
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Each draw reduces the probability of the chosen item. Collect all{" "}
              {adv.N}!
            </Typography>

            <BallsGrid
              N={adv.N}
              collected={collected}
              lastDraw={lastDraw}
              drawCounts={drawCounts}
            />

            <Controls
              running={running}
              canComplete={canComplete}
              onStartStop={toggleRunning}
              onDrawOnce={drawOnce}
              onReset={reset}
              decay={adv.initialDecay}
              onChangeDecay={handleChangeDecayQuick}
              speed={adv.speedMs}
              onChangeSpeed={(v) => patchAdvanced({ speedMs: v })}
            />

            <AdvancedControls
              values={adv}
              onChange={patchAdvanced}
              onApply={handleApply}
              onExport={handleExport}
              onImport={handleImport}
            />

            <Box
              display="grid"
              gridTemplateColumns={{ md: "1fr 1fr" }}
              gap={4}
              mt={2}
            >
              <ProbabilityChart
                weights={weights}
                probs={probs}
                displayMode={adv.displayMode}
              />
              <ProgressChart data={history} N={adv.N} />
            </Box>

            <Box mt={3}>
              <Typography variant="body1">
                Draws: <strong style={{ color: "#90caf9" }}>{turn}</strong> |
                Collected:{" "}
                <strong style={{ color: "#82ca9d" }}>{collected.size}</strong>/
                {adv.N}
              </Typography>
              {canComplete && (
                <p
                  style={{
                    color: "#82ca9d",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    marginTop: 8,
                  }}
                >
                  All items collected in {turn} turns!
                </p>
              )}
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </StyledThemeProvider>
  );
}
