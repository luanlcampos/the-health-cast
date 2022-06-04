import React from "react";
import Select from "react-select";
import list from "../../../data/listOfConsumerHealthInfoTopics";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const AddInterestTagsFormInput = ({ ...props }) => {
  return (
    <>
      <Select
        className="w-full"
        components={animatedComponents}
        isMulti
        isSearchable
        options={list}
        value={list.find((c) => c.value === props.value)}
        onChange={(val) => {
          return props.handleInterestsChange(val);
        }}
      />
    </>
  );
};

export default AddInterestTagsFormInput;
