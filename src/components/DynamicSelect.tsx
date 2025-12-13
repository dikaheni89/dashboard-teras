import React from 'react';
import Select, { SingleValue, MultiValue } from 'react-select';

type Option = {
  value: string | number;
  label: string;
};

type DynamicSelectProps = {
  options: Option[];
  placeholder?: string;
  onChange?: (selected: SingleValue<Option> | MultiValue<Option> | null) => void;
  isMulti?: boolean;
  isClearable?: boolean;
};

const DynamicSelect: React.FC<DynamicSelectProps> = ({
                                                       options,
                                                       placeholder = "Select an option...",
                                                       onChange,
                                                       isMulti = false,
                                                       isClearable = true,
                                                     }) => {
  const handleChange = (selected: SingleValue<Option> | MultiValue<Option> | null) => {
    if (onChange) onChange(selected);
  };

  return (
    <Select
      options={options}
      placeholder={placeholder}
      onChange={handleChange}
      isMulti={isMulti}
      isClearable={isClearable}
      className="basic-single"
      classNamePrefix="select"
    />
  );
};

export default DynamicSelect;
