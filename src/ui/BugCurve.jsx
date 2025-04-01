/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  Bar,
} from "recharts";
function BugCurve({ formData }) {
  const blue = "#34a3cf";
  const yellow = "#FCA510";
  if (formData) {
    if (formData.affectVersion) {
      formData.affectVersion = formData.affectVersion.filter(
        (item) => item.name !== "total"
      );
    }
  }
  const CustomDot = (props) => {
    const { cx, cy, payload, yAxisHeight, index } = props;
    if (!cx || !cy || payload.length === 0) return null;
    console.log(payload);
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
  return (
    <ResponsiveContainer
      width="90%"
      height={420}
      style={{
        marginTop: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginRight: "80px",
      }}
    >
      <ComposedChart
        data={formData.affectVersion}
        margin={{ top: 0, right: 30, left: 50, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} fontSize={12} tickMargin={20} />
        <YAxis />

        <Bar dataKey="bug_point" barSize={20} fill={blue} />
        <Line
          type="monotone"
          dataKey="bug_point"
          stroke={blue}
          dot={CustomDot}
          activeDot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default BugCurve;
