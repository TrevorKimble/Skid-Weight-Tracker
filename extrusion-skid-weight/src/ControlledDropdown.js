import React, { useState } from 'react'
import { Form, InputGroup, Dropdown } from 'react-bootstrap'


function ControlledDropdown({ options, label, shortLabel, id, updateFormData, required}) {
  //const [selectedName, setSelectedName] = useState() // Initialize with an empty string or a default value
  const [selectedValue, setSelectedValue] = useState()

  const handleChange = (value, name) => {
    //debugger
    setSelectedValue(value)
    //setSelectedName(name)
    updateFormData(id, value)
  };

  return (
    <div>
      <InputGroup className={'input-group'}> {/*Shift*/}
      <InputGroup.Text className={'scrap-label'} id="shift">{label}</InputGroup.Text>
        <Dropdown>
          <Dropdown.Toggle className={'scrap-toggle'} variant="secondary" id={id + "-dropdown"}>
            Select {shortLabel ?? label}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ alignContent: 'center', overflow: "hidden",  overflowY: 'scroll' ,maxHeight: "350px",}}>
            {options.map((option, index) => (
              <Dropdown.Item style={{ borderBottom: "3px solid rgb(212, 212, 212)", textAlign: 'center'}} key={index} onClick={() =>handleChange(option.value, option.name)}>{option.name}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Form.Control
          placeholder={"(" + id + ")"}
          aria-label="{params.label}"
          aria-describedby={id}
          className={'value-field'}
          value={selectedValue}
          readOnly={true}
      />
      </InputGroup>
    </div>
  );
};

export default ControlledDropdown