import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";

const EditMarriage = (props) => {
  const [formData, setFormData] = useState({
    uuid_marriage: undefined,
    d_o_mar: undefined,
  });
  moment.tz.setDefault("UTC");

  useEffect(() => {
    let selectedMarriage = props.state.spouses.filter((marriage) => {
      return marriage.uuid_marriage === props.UUID;
    })[0];
    setFormData({
      d_o_mar: new Date(selectedMarriage.d_o_mar),
      uuid_marriage: selectedMarriage.uuid_marriage,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleChangeMarriageDate = (date) => {
    setFormData({
      ...formData,
      d_o_mar: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.submitEditedMarriageDetails({
      ...formData,
      d_o_mar: moment(
        `${formData.d_o_mar.getFullYear()}-${
          formData.d_o_mar.getMonth() + 1
        }-${formData.d_o_mar.getDate()}`,
        "YYYY-MM-DD"
      ).toISOString(),
    });
  };

  return (
    <div className="idcard-form translucent-card">
      <form onSubmit={handleSubmit}>
        <h3>Edit marriage</h3>
        <label>Date of marriage:</label>
        <DatePicker
          id="marriage"
          shouldCloseOnSelect={true}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={40}
          maxDate={new Date()}
          autoComplete="off"
          onChange={handleChangeMarriageDate}
          selected={formData.d_o_mar}
        />

        <input className="bubble-button" type="submit" value="Save"></input>
      </form>
    </div>
  );
};
export default EditMarriage;
