import './Cars.css';
import Config from '../../../config';
import React from 'react';
import { Navigate } from 'react-router-dom';
import CarTable from './CarTable';



const Cars = () => {


    //se n tiver configurado o token no config.js, irá diretamente redirecionar para a homepage
    if (!Config.token) {
        return <Navigate to={'/'}></Navigate>
    }


    return (

        <CarTable></CarTable>

    )
}

export default Cars;