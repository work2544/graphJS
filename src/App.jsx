import { useState } from "react";
import SlopeChart from "./ui/SlopeChart";
import BugForm from "./ui/BugForm";
import styled from "styled-components";
import Table from "./ui/Table";
import BugCurve from "./ui/BugCurve";

export default function App() {
  const onSubmit = (e, formData) => {
    e.preventDefault();
    setSubmitData(formData);
    const timeSeriesByVersion = formData.affectVersion.map((data) =>
      data.time.split(",").map(Number)
    );
    let cumulativeBugCount = 0;

    let versionTimeline = timeSeriesByVersion.flatMap(
      (versionTimes, versionIndex) => {
        return versionTimes.map((timestamp, timeIndex) => {
          const isFirstPoint = versionTimes.length === 1 || timeIndex === 0;
          const isLastPoint =
            versionTimes.length === 1 || timeIndex === versionTimes.length - 1;

          const currentVersion = formData.affectVersion[versionIndex];

          if (currentVersion.bug_point !== 0) {
            cumulativeBugCount += 1;
          }

          if (currentVersion.name === "total") {
            return {
              name: currentVersion.name.toLowerCase(),
              bugPoint: currentVersion.bug_point,
              bugCount: cumulativeBugCount,
              timeUsed: 0,
              sumTime: 0,
              firstIndex: false,
              lastIndex: false,
            };
          }

          return {
            name: currentVersion.name,
            bugPoint: currentVersion.bug_point,
            bugCount: cumulativeBugCount,
            timeUsed: timestamp,
            sumTime: 0,
            firstIndex: isFirstPoint,
            lastIndex: isLastPoint,
          };
        });
      }
    );

    let cumulativeTime = 0;
    versionTimeline = versionTimeline.map((dataPoint, index) => {
      if (index !== 0) {
        cumulativeTime += versionTimeline[index - 1].timeUsed;
      }
      return {
        ...dataPoint,
        sumTime: cumulativeTime,
      };
    });

    setChartData(versionTimeline);
  };
  const [chartData, setChartData] = useState([]);
  const [submitData, setSubmitData] = useState([]);

  return (
    <div className="App">
      <Container>
        <SlopeChart chartData={chartData} />
        <BugCurve formData={submitData} />
        <FormContainer>
          <BugForm onSubmit={onSubmit} />
          <Table submitData={submitData}></Table>
        </FormContainer>
      </Container>
    </div>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 24px;
`;
