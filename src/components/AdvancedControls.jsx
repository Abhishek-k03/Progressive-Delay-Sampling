// src/components/AdvancedControls.jsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AdvancedControls({
  values,
  onChange,
  onApply,
  onExport,
  onImport,
}) {
  const [importText, setImportText] = React.useState("");

  return (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Advanced Controls</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={2}
        >
          <TextField
            label="Number of Balls (N)"
            type="number"
            value={values.N}
            onChange={(e) =>
              onChange({
                N: Math.max(1, Math.floor(Number(e.target.value) || 1)),
              })
            }
            size="small"
          />
          <FormControl size="small">
            <InputLabel>Decay Type</InputLabel>
            <Select
              label="Decay Type"
              value={values.decayType}
              onChange={(e) => onChange({ decayType: e.target.value })}
            >
              <MenuItem value="exponential">Exponential</MenuItem>
              <MenuItem value="linear">Linear</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {values.decayType === "exponential" && (
            <Box>
              <Typography variant="caption">Decay (d)</Typography>
              <Slider
                min={0.01}
                max={0.99}
                step={0.01}
                value={values.initialDecay}
                onChange={(_, v) => onChange({ initialDecay: v })}
                valueLabelDisplay="auto"
              />
            </Box>
          )}

          {values.decayType === "linear" && (
            <Box>
              <Typography variant="caption">Linear Step (k)</Typography>
              <Slider
                min={0.001}
                max={1}
                step={0.001}
                value={values.linearStep}
                onChange={(_, v) => onChange({ linearStep: v })}
                valueLabelDisplay="auto"
              />
            </Box>
          )}

          <FormControl size="small">
            <InputLabel>Auto-Play Mode</InputLabel>
            <Select
              label="Auto-Play Mode"
              value={values.autoPlayMode}
              onChange={(e) => onChange({ autoPlayMode: e.target.value })}
            >
              <MenuItem value="stop">Stop on Completion</MenuItem>
              <MenuItem value="loop">Loop (Auto-Reset)</MenuItem>
              <MenuItem value="infinite">Infinite</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="RNG Seed"
            value={values.seed ?? ""}
            onChange={(e) => onChange({ seed: e.target.value })}
            size="small"
          />

          <FormControl size="small">
            <InputLabel>Prob Display</InputLabel>
            <Select
              label="Prob Display"
              value={values.displayMode}
              onChange={(e) => onChange({ displayMode: e.target.value })}
            >
              <MenuItem value="linear">Linear</MenuItem>
              <MenuItem value="log">Log</MenuItem>
              <MenuItem value="raw-weights">Raw Weights</MenuItem>
              <MenuItem value="normalized">Normalized</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="caption">Turbo</Typography>
            <Switch
              checked={values.turbo}
              onChange={(_, v) => onChange({ turbo: v })}
            />
          </Box>

          <Box>
            <Typography variant="caption">Speed (ms)</Typography>
            <Slider
              min={0}
              max={2000}
              step={50}
              value={values.speedMs}
              onChange={(_, v) => onChange({ speedMs: v })}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography variant="caption">Max History</Typography>
            <Slider
              min={0}
              max={20000}
              step={100}
              value={values.maxHistory}
              onChange={(_, v) => onChange({ maxHistory: v })}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>

        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" onClick={onApply}>
            Apply
          </Button>
          <Button variant="outlined" onClick={onExport}>
            Export Settings
          </Button>
        </Box>

        <Box mt={2}>
          <TextField
            label="Import Settings JSON"
            multiline
            minRows={3}
            fullWidth
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <Box mt={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onImport(importText)}
            >
              Import
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
