import { useState } from "react";
import ErrorBarChart from "./ui/SlopeChart";
import BugForm from "./ui/BugForm";
import styled from "styled-components";

export default function App() {
  const onSubmit = (e, formData) => {
    e.preventDefault();
    setSubmitData(formData);
    const processChartData = (formData) => {
      // Input validation
      if (!formData?.affectVersion?.length) {
        throw new Error("Invalid form data: affectVersion is required");
      }

      // Transform time strings to number arrays
      const timesByVersion = formData.affectVersion.map((data) => {
        if (!data.time) return [];
        return data.time.split(",").map((time) => {
          const num = Number(time);
          if (isNaN(num)) {
            throw new Error(`Invalid time value: ${time}`);
          }
          return num;
        });
      });

      let bugCount = 0;

      // Process each version's data
      const chartData = timesByVersion.flatMap((times, versionIndex) => {
        const currentVersion = formData.affectVersion[versionIndex];

        // Handle special case for "total" version
        if (currentVersion.name === "total") {
          const previousVersionIndex = timesByVersion.length - 2;
          if (previousVersionIndex < 0) {
            throw new Error('Cannot process "total" without previous versions');
          }

          const previousTimes = timesByVersion[previousVersionIndex];
          const prevTime = previousTimes[previousTimes.length - 1] || 0;

          return [
            {
              name: currentVersion.name.toLowerCase(),
              bugPoint: currentVersion.bug_point,
              bugCount,
              timeUsed: prevTime,
              sumTime: 0,
              firstIndex: false,
              lastIndex: false,
            },
          ];
        }

        // Increment bug count if necessary
        if (currentVersion.bug_point !== 0) {
          bugCount++;
        }

        // Map times to data points
        return times.map((timeUsed, timeIndex) => {
          const isFirstIndex = times.length === 1 || timeIndex === 0;
          const isLastIndex =
            times.length === 1 || timeIndex === times.length - 1;

          return {
            name: currentVersion.name,
            bugPoint: currentVersion.bug_point,
            bugCount,
            timeUsed,
            sumTime: 0, // Will be calculated in the next step
            firstIndex: isFirstIndex,
            lastIndex: isLastIndex,
          };
        });
      });

      // Calculate cumulative time
      let cumulativeTime = 0;
      const finalChartData = chartData.map((data) => ({
        ...data,
        sumTime: (cumulativeTime += data.timeUsed),
      }));

      return finalChartData;
    };

    try {
      const chartData = processChartData(formData);
      setChartData(chartData);
    } catch (error) {
      console.error("Error processing chart data:", error);
    }
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
