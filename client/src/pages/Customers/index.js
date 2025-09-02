import { useEffect, useState } from "react";
import { getAllCustomers } from "../../Api/Services/ApiServices";
import CustomerCreationForm from "./CreateCustomerForm";
import "./index.css";


const Customers = () => {
  const [customersList, setCustomersList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    getAllCustomers()
      .then((res) => {
        console.log(res, "inside hte customers");
        setCustomersList(res.customers || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleCustomerAdded = (newCustomer) => {
    setCustomersList((prev) => [...prev, newCustomer]);
    setOpenDialog(false);
  }



  return (
    <div className="customers-page">
      <h1>Customers Dashboard</h1>
      <div className="customers-table">
        {customersList.length > 0 ? (
          <table className="mui-table" >
            <thead>
              <tr >
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {customersList.map((customer) => (
                <tr key={customer.customerId} >
                  <td>{customer.customerId}</td>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>{customer.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers found.</p>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setOpenDialog(!openDialog);
          }}
          className="add-customer-button"
        >
          Add Customer
        </button>
      </div>
      <dialog open={openDialog} className="customer-dialog">
        <CustomerCreationForm showAddress={true} onSucess={handleCustomerAdded}/>
      </dialog>
    </div>
  );
};

export default Customers;
