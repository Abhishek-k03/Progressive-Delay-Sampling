// src/components/Controls.jsx
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";

export default function Controls({
  running,
  canComplete,
  onStartStop,
  onDrawOnce,
  onReset,
  decay,
  onChangeDecay,
  speed,
  onChangeSpeed,
}) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center"
      gap={2}
      mb={4}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={onStartStop}
        disabled={canComplete}
      >
        {canComplete
          ? "Completed"
          : running
          ? "Pause Auto-Play"
          : "Start Auto-Play"}
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={onDrawOnce}
        disabled={canComplete || running}
      >
        Draw Once
      </Button>
      <Button variant="contained" color="error" onClick={onReset}>
        Reset
      </Button>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Decay</InputLabel>
        <Select
          value={decay}
          label="Decay"
          onChange={(e) => onChangeDecay(Number(e.target.value))}
        >
          <MenuItem value={0.9}>0.9 (Slow)</MenuItem>
          <MenuItem value={0.75}>0.75 (Medium)</MenuItem>
          <MenuItem value={0.5}>0.5 (Fast)</MenuItem>
          <MenuItem value={0.25}>0.25 (Very Fast)</MenuItem>
        </Select>
      </FormControl>
      <Box display="flex" alignItems="center" width={200} ml={2}>
        <Typography variant="caption" mr={1}>
          Speed
        </Typography>
        <Slider
          min={0}
          max={2000}
          step={50}
          value={speed}
          onChange={(_, v) => onChangeSpeed(v)}
          valueLabelDisplay="auto"
          color="secondary"
        />
      </Box>
    </Box>
  );
}
