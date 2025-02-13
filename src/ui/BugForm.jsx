import { Fragment } from "react";
import { useState } from "react";
import styled from "styled-components";

const INITIAL_VERSION = {
  name: "",
  bug_point: 0,
  time: "",
};

// eslint-disable-next-line react/prop-types
const BugForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    majorVersion: "",
    affectVersion: [
      { ...INITIAL_VERSION, name: "ver_1" },
      { ...INITIAL_VERSION, name: "ver_2" },
    ],
  });

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

  const addVersion = (total = '') => {
    let newVersion;
    if (total === 'total') {
      newVersion = {
        ...INITIAL_VERSION,
        name: `total`,
      };
    } else {
      newVersion = {
        ...INITIAL_VERSION,
        name: `ver_${formData.affectVersion.length + 1}`,
      };
    }

    updateFormData({
      affectVersion: [...formData.affectVersion, newVersion],
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
            <InputGroupLabel htmlFor="major">Major Version:</InputGroupLabel>
            <Input
              id="major"
              value={formData.majorVersion}
              onChange={(e) => updateFormData({ majorVersion: e.target.value })}
            />
          </DataGrid>

          <DataGrid columns="repeat(4, 1fr)">
            <InputGroupLabel>Name</InputGroupLabel>
            <InputGroupLabel>Bug Point</InputGroupLabel>
            <InputGroupLabel>Test (Hrs)</InputGroupLabel>
            <InputGroupLabel />

            {formData.affectVersion.map((version, index) => (
              <Fragment key={`bug-${index}`}>
                <Input
                  value={version.name}
                  onChange={(e) =>
                    handleVersionChange(index, "name", e.target.value)
                  }
                  placeholder="e.g. ver_1"
                />
                <Input
                  type="number"
                  min="0"
                  value={version.bug_point}
                  onChange={(e) =>
                    handleVersionChange(
                      index,
                      "bug_point",
                      Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 1"
                />
                <Input
                  pattern="^[0-9]+(,[0-9]+)*$"
                  value={version.time}
                  onChange={(e) =>
                    handleVersionChange(index, "time", e.target.value)
                  }
                  placeholder="e.g. 8,8,16"
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
              formData.affectVersion[formData.affectVersion.length - 1].name !== "total"
            ){
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
