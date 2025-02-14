import styled from "styled-components";

const FractionSVG = styled.svg`
  display: inline-block;
  vertical-align: middle;
  dominant-baseline: middle;
  transform-origin: center;
  overflow: visible;
`;

const FractionText = styled.text`
  font-size: 12px; /* Reduce font size to fit */
  text-anchor: middle;
  dominant-baseline: middle;
  white-space: nowrap; /* Prevents breaking */
  font-weight: bold;
`;

const Line = styled.line`
  stroke: black;
  stroke-width: 1;
`;

// eslint-disable-next-line react/prop-types
const FractionSVGDisplay = ({ numerator, denominator, x = 50, y = 20 }) => {
  if (denominator === 0) return <></>;
  const ratio = numerator / denominator;
  const formattedRatio = ratio.toFixed(2);

  return (
    <FractionSVG width={120} height={60} viewBox={`0 0 ${10} ${60}`}>
      <FractionText x={x + 10} y={y}>
        Slope =
      </FractionText>

      <FractionText x={x + 40} y={y - 5}>
        {numerator}
      </FractionText>

      <Line x1={x + 30} y1={y + 2} x2={x + 50} y2={y + 2} />

      <FractionText x={x + 40} y={y + 15}>
        {denominator}
      </FractionText>

      <FractionText x={x + 90} y={y}>
        = {formattedRatio} {ratio < 0.04 && "< 0.04"}
      </FractionText>
    </FractionSVG>
  );
};

export default FractionSVGDisplay;
