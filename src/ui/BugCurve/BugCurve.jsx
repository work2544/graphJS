/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {CustomDot} from "./custom";
import {
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  Bar,
} from "recharts";
function BugCurve({ formData }) {
  const blue = "#34a3cf";
  if (formData) {
    if (formData.affectVersion) {
      formData.affectVersion = formData.affectVersion.filter(
        (item) => item.name !== "total"
      );
    }
  }

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
