/* eslint-disable react/prop-types */
export const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy || payload.length === 0) return null;
  return (
    <g key={cx}>
      <circle cx={cx} cy={cy} r={2.5} stroke="red" fill="red" />
      <text
        x={cx}
        y={cy - 10}
        fontFamily="sans-serif"
        textAnchor="middle"
        fontSize="11"
      >
        {payload.bug_point}
      </text>
    </g>
  );
};
