import React, { useRef } from "react";
import classnames from "classnames";
import { asField } from "informed";

const DropDown = ({ fieldApi, fieldState, ...props }) => {
  const { value } = fieldState;
  const { setTouched, setValue } = fieldApi;
  const {
    onChange,
    onBlur,
    field,
    initialValue,
    children,
    forwardedRef,
    debug,
    multiple,
    className,
    options,
    optionsNames,
    faClass,
    label,
    icon,
    content,
    required,
    ...rest
  } = props;

  const selectRef = useRef();

  return (
    <>
      {faClass && !icon && <i className={faClass}></i>}
      {label && (
        <label>
          {icon && icon}
          {label}
          {required && <i style={{ color: "red" }}>*</i>}
        </label>
      )}
      <select
        {...rest}
        multiple={multiple}
        name={field}
        style={fieldState.error ? { appearance: "none" } : null}
        required={false}
        ref={selectRef}
        value={value || (multiple ? [] : "")}
        className={classnames(`form-control ${className}`, {
          "is-invalid": fieldState.error,
        })}
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) {
            onChange(e);
          }
        }}
        onBlur={(e) => {
          setTouched(true);
          if (onBlur) {
            onBlur(e);
          }
        }}
      >
        <option value="">Select {label}</option>
        {options &&
          options.map((option, index) => {
            return (
              <option
                // ref={forwardedRef}
                key={index}
                value={option[optionsNames.value]}
              >
                {option[optionsNames.label]}
              </option>
            );
          })}
      </select>
      {/* {props.helper &&  <small className="form-text text-muted">{content}</small>} */}
      {fieldState.error ? (
        <div className="invalid-field">{fieldState.error}</div>
      ) : null}
    </>
  );
};

export default asField(DropDown);
