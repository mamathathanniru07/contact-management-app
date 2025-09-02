import React, { useRef, useState } from "react";
import TextInputWithLabel from "./../../CommonComponents/Input";
import AddressSheetForm from "./AddressDetailsForm";
import { saveCustomer } from "../../Api/Services/ApiServices";

const CreateCustomerForm = ({ onSucess, showAddress = false }) => {
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const addressRef = useRef();

  function mapApiErrors(errorsArray, generalError) {
    const apiErrors = {};
    if (generalError) apiErrors.general = generalError;
    const fieldMap = [
      { key: "First name", field: "firstName" },
      { key: "Last name", field: "lastName" },
      { key: "Phone number", field: "phoneNumber" },
      { key: "Address Line", field: "addressLine" },
      { key: "City", field: "city" },
      { key: "State", field: "state" },
      { key: "Pin code", field: "pinCode" },
    ];
    (errorsArray || []).forEach((error) => {
      const match = fieldMap.find(({ key }) => error.includes(key));
      if (match) apiErrors[match.field] = error;
    });
    return apiErrors;
  }

  const validate = () => {
    const newErrors = {};
    if (!customer.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!customer.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!customer.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10}$/.test(customer.phoneNumber)) {
      newErrors.phoneNumber = "PhoneNumber must be 10 digits";
    }
    if (showAddress && addressRef.current) {
      const isAddressValid = addressRef.current.validateAddress();
      if (!isAddressValid) {
        newErrors.address = "Please fill the address details correctly";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
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
      const address =
        showAddress && addressRef.current
          ? addressRef.current.getAddress()
          : {};
      const customerData = { ...customer, ...address };
      saveCustomer(customerData)
        .then((res) => {
          console.log(res, "Customer saved successfully");
          onSucess && onSucess(res);
        })
        .catch((err) => {
          console.error("Error saving customer:", err);
          if (
            err.response &&
            err.response.data &&
            (err.response.data.errors || err.response.data.error)
          ) {
            const apiErrors = mapApiErrors(
              err.response.data.errors,
              err.response.data.error
            );
            setErrors(apiErrors);
          } else {
            setErrors({ general: "An unexpected error occurred." });
          }
        });
    }
  };
console.log(errors, "errors");
  return (
    <form onSubmit={handleSubmit}>
      <TextInputWithLabel
        label="First Name"
        name="firstName"
        value={customer.firstName}
        onChange={handleChange}
        required
        placeholder="Enter first name"
        className={"form-label"}
      />
      {errors.name && <span style={{ color: "red" }}>{errors.firstName}</span>}
      <TextInputWithLabel
        label="Last Name"
        name="lastName"
        value={customer.lastName}
        onChange={handleChange}
        required
        placeholder="Enter last name"
        type="text"
        className={"form-label"}
      />
      {errors.email && <span style={{ color: "red" }}>{errors.lastName}</span>}
      <TextInputWithLabel
        label="Phone"
        name="phoneNumber"
        value={customer.phoneNumber}
        onChange={handleChange}
        required
        placeholder="Enter Phone Number"
        type="tel"
        className={"form-label"}
      />
      {errors?.phoneNumber && (
        <span style={{ color: "red" }}>{errors.phoneNumber}</span>
      )}
      <AddressSheetForm ref={addressRef} showSubmit={false} />
       {errors?.general && (
        <span style={{ color: "red" }}>{errors.general}</span>
      )}
      <button
        type="submit"
        style={{ marginTop: "1rem" }}
        className="create-button"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateCustomerForm;
