import React, { useState } from "react";

import DatePicker from "react-datepicker";

const NewChild = (props) => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    d_o_b: null,
    gender: null,
    father:
      props.state.target.gender === "Male"
        ? props.state.target.uuid
        : props.state.spouses[0]
        ? props.state.spouses[0].uuid
        : null,
    mother:
      props.state.target.gender === "Female"
        ? props.state.target.uuid
        : props.state.spouses[0]
        ? props.state.spouses[0].uuid
        : null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeBirth = (date) => {
    setFormData({
      ...formData,
      d_o_b: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const response = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      father: formData.father,
      mother: formData.mother,
      d_o_b: formData.d_o_b,
      gender: formData.gender,
    };
    props.submitNewChild(response);
  };

  return (
    <div className="new-child">
      <h3>Add child</h3>
      <form onSubmit={handleSubmit}>
        <label>
          First name
          <br />
          <input
            type="text"
            name="first_name"
            autoComplete="off"
            value={formData.first_name}
            onChange={handleChange}
          ></input>
        </label>
        <br />
        <label>
          Middle name
          <br />
          <input
            type="text"
            autoComplete="no"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleChange}
          ></input>
        </label>
        <br />
        <label>
          Last name
          <br />
          <input
            type="text"
            autoComplete="no"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          ></input>
        </label>
        <br />
        <label htmlFor="birthday">Date of birth</label>

        <br />
        <DatePicker
          id="birthday"
          shouldCloseOnSelect={true}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={40}
          maxDate={new Date()}
          autoComplete="off"
          onChange={handleChangeBirth}
          selected={formData.d_o_b}
        />
        <br />

        <label>
          Gender
          <br />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            {" "}
            <option value="" selected disabled hidden>
              ---
            </option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </label>
        <br />

        <label>
          {props.state.target.gender !== "Male" ? "Father" : "Mother"}
          <br />
          <select
            name={props.state.target.gender !== "Male" ? "father" : "mother"}
            value={
              props.state.target.gender !== "Male"
                ? formData.father
                : formData.mother
            }
            onChange={handleChange}
          >
            {props.state.spouses.map((spouse) => {
              return (
                <option value={spouse.uuid}>{spouse.name.join(" ")}</option>
              );
            })}
          </select>
        </label>
        <br />
        <br />
        <input type="submit" value="Save"></input>
      </form>
    </div>
  );
};

export default NewChild;
