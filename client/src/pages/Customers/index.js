import { useEffect, useState } from "react"
import { getAllCustomers } from "../../Api/Services/ApiServices"



const Customers = () => {
    const [customersList, setCustomersList] = useState([])
    useEffect(() => {
       getAllCustomers().then((res) => {
        console.log(res)
            setCustomersList(res)
        }).catch((err) => {
            console.log(err)
        })
    },[]) 
    return (<div>
        <h1>asdj;akljsd</h1>
    </div>)
}

export default Customers;