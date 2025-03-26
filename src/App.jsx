import { useState } from "react";
import ErrorBarChart from "./ui/SlopeChart";
import BugForm from "./ui/BugForm";
import styled from "styled-components";

export default function App() {
  const onSubmit = (e, formData) => {
    e.preventDefault();
    setSubmitData(formData);
    const timeSeriesByVersion = formData.affectVersion.map((data) =>
      data.time.split(",").map(Number)
    );
    console.log(timeSeriesByVersion);
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
        <ErrorBarChart chartData={chartData} />
        <FormContainer>
          <BugForm onSubmit={onSubmit} />
          <StyledTable>
            <thead>
              <Tr>
                <Th>Affects Versions ({submitData.majorVersion}.X)</Th>
                <Th>Bug Point</Th>
                <Th>Bug Count</Th>
              </Tr>
            </thead>
            <tbody>
              {submitData.affectVersion?.map((version, index) => {
                const cumulativeSum = submitData.affectVersion
                  .slice(0, index + 1)
                  .reduce((acc, curr) => acc + curr.bug_point, 0);
                return (
                  <Tr key={version.name}>
                    <Td>{version.name}</Td>
                    {version.name === "total" ? (
                      <Td>{cumulativeSum}</Td>
                    ) : (
                      <Td>{version.bug_point}</Td>
                    )}
                    <Td>{cumulativeSum}</Td>
                  </Tr>
                );
              })}
            </tbody>
          </StyledTable>
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

const StyledTable = styled.table`
  width: 70%;
  height: 50%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: "Calibri";
  font-size: 11px;
`;

const Th = styled.th`
  background-color: #007bff;
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border: solid 2px lightgrey;
  border-top: 1px solid #dee2e6;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;
