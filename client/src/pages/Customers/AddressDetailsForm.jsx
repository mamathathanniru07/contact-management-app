import  { forwardRef, useImperativeHandle, useState } from "react";
import TextInputWithLabel from "../../CommonComponents/Input";

const AddressSheetForm = ({ onSubmit, showSubmit=true }, ref) => {
  const [address, setAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {}; 
    if (!address.addressLine.trim())
      newErrors.addressLine = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.pinCode.trim()) {
      newErrors.pinCode = "Pin Code is required";
    } else if (!/^\d{6}$/.test(address.pinCode)) {
      newErrors.pinCode = "Pin Code must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit && onSubmit(address);
    }
  };

  useImperativeHandle(ref, () => ({
    getAddress: () => address,
    validateAddress: () => validate(),
  }));

  return (
    <div onSubmit={handleSubmit}>
      <TextInputWithLabel
        label="Address"
        name="addressLine"
        value={address.addressLine}
        onChange={handleChange}
        required
        placeholder="Enter address"
        className={'form-label'}
      />
      {errors.addressLine && (
        <span style={{ color: "red" }}>{errors.addressLine}</span>
      )}
      <TextInputWithLabel
        label="City"
        name="city"
        value={address.city}
        onChange={handleChange}
        required
        placeholder="Enter city"
        className={'form-label'}
      />
      {errors.city && <span style={{ color: "red" }}>{errors.city}</span>}
      <TextInputWithLabel
        label="State"
        name="state"
        value={address.state}
        onChange={handleChange}
        required
        placeholder="Enter state"
        className={'form-label'}
      />
      {errors.state && <span style={{ color: "red" }}>{errors.state}</span>}
      <TextInputWithLabel
        label="Pin Code"
        name="pinCode"
        value={address.pinCode}
        onChange={handleChange}
        required
        placeholder="Enter pin code"
        type="number"
        className={'form-label'}
        inputMode="numeric"
        maxLength={6}
      />
      {errors.pinCode && <span style={{ color: "red" }}>{errors.pinCode}</span>}
      {showSubmit &&<button type="submit" style={{ marginTop: "1rem" }}>
        Submit
      </button>}
    </div>
  );
};

export default forwardRef(AddressSheetForm);
