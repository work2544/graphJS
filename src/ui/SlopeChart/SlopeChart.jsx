/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import FractionDisplay from "../FractionSVGDisplay";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SlopeChart = ({ chartData }) => {
  const blue = "#34a3cf";
  const yellow = "#c9a00b";
  useEffect(() => {
    if (!chartData.length) return;
    const lastDataPoint = chartData.at(-2);
    setNumeratorDenominator({
      numerator: lastDataPoint.bugPoint,
      denominator: lastDataPoint.bugCount,
    });
  }, [chartData]);
  const CustomDot = (props) => {
    const { cx, cy, payload, yAxisHeight, index } = props;
    if (!cx || !cy || payload.length === 0) return null;
    if (!chartData[index].lastIndex || chartData[index].name === "total") {
      return (
        <g key={cx}>
          <circle cx={cx} cy={cy} r={2.5} stroke="red" fill="red" />
        </g>
      );
    }
    return (
      <g key={cx}>
        <circle cx={cx} cy={cy} r={3} stroke="red" fill="red" />
        <Fragment>
          <line
            x1={cx}
            x2={cx}
            y1={cy - yAxisHeight}
            y2={cy + yAxisHeight}
            stroke={blue}
            strokeWidth={1}
            strokeLinecap="round"
          />
          <text
            x={cx + 10}
            y={cy - 10}
            fontFamily="sans-serif"
            textAnchor="middle"
            transform={`rotate(-90, ${cx - 6}, ${cy - 13})`}
            fontSize="11"
          >
            {payload.name}
          </text>
        </Fragment>
      </g>
    );
  };
  const BugPointXAxisTick = (props) => {
    const { x, y, payload, width, index } = props;
    const arrowWidth = width / (2 * chartData.length - 2);
    if (payload.value === 0 || index === chartData.length - 1) {
      return null;
    }
    const nextDot = index !== chartData.length - 1 ? index + 1 : undefined;
    if (!nextDot) {
      return null;
    }
    return (
      <g transform={`translate(${x},${y + 2})`}>
        {/* Left Arrow */}
        <path
          d={`M 0 0 L ${arrowWidth} 0 M 0 0 L 10 -3.5 M 0 0 L 10 3.5`}
          stroke={blue}
          strokeWidth="1"
          fill="none"
        />
        {/* Right Arrow */}
        <path
          d={`M ${arrowWidth} 0 L ${2 * arrowWidth} 0 M ${2 * arrowWidth} 0 L ${
            2 * arrowWidth - 10
          } -3.5 M ${2 * arrowWidth} 0 L ${2 * arrowWidth - 10} 3.5`}
          stroke={blue}
          strokeWidth="1"
          fill="none"
        />

        {/* Text Label Centered */}
        <text
          x={arrowWidth}
          y={-5}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
        >
          {payload.value} Hrs
        </text>
      </g>
    );
  };
  const PercentileXAxisTick = (props) => {
    const { x, y, payload, width, index } = props;
    const arrowWidth90th = width * 0.45;
    const arrowWidth10th = width * 0.05;
    if (payload.value === 0) {
      return null;
    }
    if (index === 0)
      return (
        <g>
          <g transform={`translate(${x},${y + 2})`}>
            <path
              d={`M 0 0 L ${arrowWidth90th} 0 M 0 0 L 10 -3.5 M 0 0 L 10 3.5`}
              stroke={yellow}
              strokeWidth="1"
              fill="none"
            />
            <path
              d={`M ${arrowWidth90th} 0 L ${2 * arrowWidth90th} 0 M ${
                2 * arrowWidth90th
              } 0 L ${2 * arrowWidth90th - 10} -3.5 M ${
                2 * arrowWidth90th
              } 0 L ${2 * arrowWidth90th - 10} 3.5`}
              stroke={yellow}
              strokeWidth="1"
              fill="none"
            />
            <text
              x={arrowWidth90th}
              y={-5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
            >
              90%
            </text>
          </g>
          <g transform={`translate(${x + width * 0.9},${y + 2})`}>
            {/* Left Arrow */}
            <path
              d={`M 0 0 L ${arrowWidth10th} 0 M 0 0 L 10 -3.5 M 0 0 L 10 3.5`}
              stroke={yellow}
              strokeWidth="1"
              fill="none"
            />
            {/* Right Arrow */}
            <path
              d={`M ${arrowWidth10th} 0 L ${2 * arrowWidth10th} 0 M ${
                2 * arrowWidth10th
              } 0 L ${2 * arrowWidth10th - 10} -3.5 M ${
                2 * arrowWidth10th
              } 0 L ${2 * arrowWidth10th - 10} 3.5`}
              stroke={yellow}
              strokeWidth="1"
              fill="none"
            />

            {/* Text Label Centered */}
            <text
              x={arrowWidth10th}
              y={-5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
            >
              10%
            </text>
          </g>
        </g>
      );
  };

  const [numeratorDenominator, setNumeratorDenominator] = useState({
    numerator: 0,
    denominator: 0,
  });

  const bugCount = chartData.length > 0 ? chartData.at(-1).bugCount : 0;
  const positionScale = bugCount < 1 ? 0 : -50;
  const braceHeigth = chartData.length > 0 ? (bugCount < 1 ? 160 : 315) : 0;
  return (
    <ResponsiveContainer
      width="90%"
      height={400}
      style={{
        marginTop: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginRight: "80px",
      }}
    >
      <LineChart
        data={chartData}
        margin={{ top: 55, right: 30, left: 50, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis xAxisId="0" dataKey="sumTime" type={"category"}>
          <Label
            value="Test Hrs"
            offset={-10}
            dx={20}
            dy={20}
            position="insideBottomRight"
            fontSize={14}
          />
        </XAxis>
        <XAxis
          xAxisId="1"
          dataKey="timeUsed"
          tick={BugPointXAxisTick}
          axisLine={false}
          allowDuplicatedCategory={true}
          tickLine={false}
        />
        <XAxis
          xAxisId="2"
          dataKey="timeUsed"
          tick={PercentileXAxisTick}
          axisLine={false}
          allowDuplicatedCategory={true}
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          domain={[0, "dataMax"]}
          dataKey={"bugCount"}
        >
          <Label
            value="Bug Count"
            offset={-10}
            dx={0}
            dy={-20}
            position="insideTopLeft"
            fontSize={14}
          />
        </YAxis>
        <Line
          dataKey="bugCount"
          fill="#8884d8"
          strokeWidth={2}
          dot={<CustomDot yAxisHeight={400} />}
        />
      </LineChart>
      <svg
        style={{
          position: "absolute",
          right: -18,
          top: "43%",
          transform: `translateY(${positionScale}%)`,
          height: `${braceHeigth}px`,
          width: "100px",
          overflow: "visible",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 100 200"
      >
        <path
          d="M55 20
               C60 20, 65 25, 65 40
               L65 80
               C65 90, 65 94, 70 95
               L80 97
               L70 99
               C65 100, 65 110, 65 120
               L65 160
               C65 175, 60 180, 55 180"
          fill="none"
          stroke={blue}
          strokeWidth="1.7"
          style={{
            transform: `scale(1, 1)`,
            transformOrigin: "center",
          }}
        />

        <text
          x="82"
          y="100"
          style={{
            transform: `scale(1, 1)`,
            transformOrigin: "center",
            fontSize: "12px",
            fontFamily: "Arial",
            dominantBaseline: "middle",
          }}
        >
          {chartData.length > 0 ? chartData.at(-1).bugCount : 0}
        </text>
      </svg>
      <svg
        viewBox="0 0 1 50"
        style={{
          position: "absolute",
          top: "10px",
          right: "50%",
          width: "600px",
          height: "50px",
          overflow: "hidden",
        }}
      >
        <FractionDisplay
          numerator={numeratorDenominator.numerator}
          denominator={numeratorDenominator.denominator}
          x={60}
          y={20}
        />
      </svg>
    </ResponsiveContainer>
  );
};

export default SlopeChart;
