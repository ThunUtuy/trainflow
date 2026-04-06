import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ value, size = 120, strokeWidth = 10 }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const motionValue = useMotionValue(0);
  const strokeDashoffset = useTransform(motionValue, (v) => circumference - (v / 100) * circumference);
  const displayValue = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1],
    });
    return controls.stop;
  }, [value, motionValue]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-2xl font-bold text-foreground">
          {displayValue.get()}%
        </motion.span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">complete</span>
      </div>
    </div>
  );
};

// Need a wrapper that subscribes to motion value changes for re-render
const CircularProgressWrapper = (props: CircularProgressProps) => {
  return <CircularProgressInner {...props} />;
};

const CircularProgressInner = ({ value, size = 120, strokeWidth = 10 }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const motionValue = useMotionValue(0);
  const strokeDashoffset = useTransform(motionValue, (v) => circumference - (v / 100) * circumference);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1],
    });
    return controls.stop;
  }, [value, motionValue]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <MotionNumber motionValue={motionValue} />
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">complete</span>
      </div>
    </div>
  );
};

function MotionNumber({ motionValue }: { motionValue: ReturnType<typeof useMotionValue<number>> }) {
  const display = useTransform(motionValue, (v) => `${Math.round(v)}%`);

  return (
    <motion.span className="text-2xl font-bold text-foreground" style={{ display: "block" }}>
      <motion.span>{display}</motion.span>
    </motion.span>
  );
}

export default CircularProgressWrapper;
