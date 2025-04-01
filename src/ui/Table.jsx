/* eslint-disable react/prop-types */
import styled from "styled-components";
function Table({ submitData }) {
  return (
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
  );
}

export default Table;

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
