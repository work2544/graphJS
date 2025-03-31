import { Fragment, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";

const INITIAL_VERSION = {
  name: "",
  bug_point: 0,
  time: "0",
};

// eslint-disable-next-line react/prop-types
const BugForm = ({ onSubmit }) => {
  const [majorVersion, setMajorVersion] = useState("x.x");
  const [formData, setFormData] = useState({
    majorVersion: "x.x",
    hours: 0,
    affectVersion: [{ ...INITIAL_VERSION, name: `ver_x.x.0` }],
  });
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const handleVersionChange = (index, field, value) => {
    const newVersions = formData.affectVersion.map((version, i) =>
      i === index ? { ...version, [field]: value } : version
    );
    updateFormData({ affectVersion: newVersions });
  };

  const addVersion = (total = "") => {
    let updatedVersions = [...formData.affectVersion];

    if (updatedVersions.at(-1).name === "total") {
      updatedVersions.pop();
    }

    const newVersion =
      total === "total"
        ? { ...INITIAL_VERSION, name: "total" }
        : {
            ...INITIAL_VERSION,
            name: `ver_${majorVersion}.${updatedVersions.length}`,
            time: `${formData.hours}`,
          };

    updateFormData({
      affectVersion: [...updatedVersions, newVersion],
    });
  };

  const deleteVersion = (index) => {
    updateFormData({
      affectVersion: formData.affectVersion.filter((_, i) => i !== index),
    });
  };
  return (
    <FormContainer>
      <FormHeader>
        <h2>Enter Bug Data</h2>
      </FormHeader>

      <form onSubmit={(e) => onSubmit(e, formData)}>
        <div>
          <DataGrid>
            <InputGroupLabel htmlFor="major">Major Version</InputGroupLabel>
            <Input
              id="major"
              value={majorVersion}
              onChange={(e) => {
                const newMajor = e.target.value;
                setMajorVersion(newMajor);
                updateFormData({
                  majorVersion: newMajor,
                  affectVersion: formData.affectVersion.map(
                    (version, index) => {
                      if (version.name !== "total")
                        return {
                          ...version,
                          name: `ver_${newMajor}.${index}`,
                        };
                      else {
                        return { ...version, name: "total" };
                      }
                    }
                  ),
                });
              }}
            />
          </DataGrid>
          <DataGrid>
            <InputGroupLabel htmlFor="hours">Test Hours</InputGroupLabel>
            <Input
              id="hours"
              type="number"
              min={0}
              value={String(formData.hours).replace(/^0+/, "")}
              onChange={(e) => {
                const number = e.target.value? parseInt(e.target.value.replace(/^0+/, "")) : 0;
                const newVersions = formData.affectVersion.map((version) => ({
                  ...version,
                  time: Array(version.bug_point || 1)
                    .fill(number)
                    .join(","),
                }));
                updateFormData({ hours: number, affectVersion: newVersions });
              }}
            />
          </DataGrid>

          <DataGrid columns="repeat(3, 1fr)">
            <InputGroupLabel>Name</InputGroupLabel>
            <InputGroupLabel>Bug Point</InputGroupLabel>
            <InputGroupLabel />

            {formData.affectVersion.map((version, index) => (
              <Fragment key={`bug-${index}`}>
                <Input
                  value={version.name}
                  onChange={(e) =>
                    handleVersionChange(index, "name", e.target.value)
                  }
                />
                <Input
                  type="number"
                  min="0"
                  onChange={(e) => {
                    let bugnumber = Number(e.target.value);
                    let timenumber = bugnumber == 0 ? 1 : bugnumber
                   
                    const newVersions = formData.affectVersion.map(
                      (version, i) =>
                        i === index
                          ? {
                              ...version,
                              bug_point: bugnumber,
                              time: Array(timenumber)
                                .fill(formData.hours)
                                .join(","),
                            }
                          : version
                    );
                    updateFormData({ affectVersion: newVersions });
                  }}
                  placeholder="e.g. 1"
                />
                {formData.affectVersion.length > 1 && (
                  <DeleteButton
                    type="button"
                    onClick={() => deleteVersion(index)}
                  >
                    Remove
                  </DeleteButton>
                )}
              </Fragment>
            ))}
          </DataGrid>

          <RowAction>
            <AddRowButton type="button" onClick={addVersion}>
              + Add bug
            </AddRowButton>
          </RowAction>
        </div>

        <SubmitButton
          type="submit"
          onClick={() => {
            if (
              formData.affectVersion[formData.affectVersion.length - 1].name !==
              "total"
            ) {
              addVersion("total");
            }
            //
          }}
        >
          Update Graph
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

// Styled components remain unchanged
const FormContainer = styled.div`
  max-width: fit-content;
  margin-right: 20px;
  padding-right: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => columns || "1fr"};
  gap: 10px;
  margin-bottom: 20px;
`;

const InputGroupLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const RowAction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  border: none;
  border-radius: 4px;
  width: fit-content;
  height: 32px;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const AddRowButton = styled(Button)`
  background-color: #28a745;
  color: white;
  &:hover {
    background-color: #218838;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #007bff;
  color: white;
  width: 100%;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  &:hover {
    background-color: #c82333;
  }
`;

export default BugForm;
