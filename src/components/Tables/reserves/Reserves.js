import ReserveTable from "./ReserveTable";
import './Reserves.css';
import Config from '../../../config';
import { Navigate } from "react-router-dom";


const Reserves = () => {

    if (!Config.token) {
        return <Navigate to={'/'}></Navigate>
    }


    return (
        <ReserveTable></ReserveTable>
    )
}

export default Reserves;