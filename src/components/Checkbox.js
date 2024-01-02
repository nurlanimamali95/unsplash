import React from "react";

const Checkbox = ({ onChange, checked }) => {
  const handleCheckboxChange = (event) => {
    onChange(event.target.checked);
  };

  return (
    <label>
      <input
        type="checkbox"
        onChange={handleCheckboxChange}
        checked={checked}
      />
      Popular
    </label>
  );
};

export default Checkbox;
