import { useState } from "react";
import ErrorBarChart from "./ui/SlopeChart";
import BugForm from "./ui/BugForm";
import styled from "styled-components";

export default function App() {
  const onSubmit = (e, formData) => {
    e.preventDefault();
    setSubmitData(formData);
    var all_dots = formData.affectVersion.map((data) =>
      data.time.split(",").map(Number)
    );
    let bugCount = 0;
    let chartData = all_dots.flatMap((timesVersion, index) => {
      return timesVersion.map((timeUsed, idx) => {
        let firstIndex = false;
        let lastIndex = false;
        if (timesVersion.length === 1) {
          firstIndex = true;
          lastIndex = true;
        } else if (timesVersion.length - 1 === idx) {
          firstIndex = false;
          lastIndex = true;
        } else if (idx === 0) {
          firstIndex = true;
          lastIndex = false;
        }
        if (formData.affectVersion[index].name === "total") {
          const prev_time =
            all_dots[all_dots.length - 2][
              all_dots[all_dots.length - 2].length - 1
            ];
          return {
            name: formData.affectVersion[index].name.toLowerCase,
            bugPoint: formData.affectVersion[index].bug_point,
            bugCount: bugCount,
            timeUsed: prev_time,
            sumTime: 0,
            firstIndex: false,
            lastIndex: false,
          };
        }
        if (formData.affectVersion[index].bug_point !== 0) bugCount += 1;
        return {
          name: formData.affectVersion[index].name,
          bugPoint: formData.affectVersion[index].bug_point,
          bugCount: bugCount,
          timeUsed: timeUsed,
          sumTime: 0,
          firstIndex: firstIndex,
          lastIndex: lastIndex,
        };
      });
    });
    let sumTime = 0;
    chartData = chartData.map((data, idx) => {
      if (idx !== 0) sumTime += chartData[idx - 1].timeUsed;
      return {
        ...data,
        sumTime: sumTime,
      };
    });
    console.log(chartData);
    setChartData(chartData);
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
