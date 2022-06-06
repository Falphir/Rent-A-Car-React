import './Rooms.css';
import Config from '../../../config';
import React from 'react';
import { Navigate } from 'react-router-dom';
import RoomTable from './RoomTable';



const Rooms = () => {


    //se n tiver configurado o token no config.js, irá diretamente redirecionar para a homepage
    if (!Config.token) {
        return <Navigate to={'/'}></Navigate>
    }


    return (

        <RoomTable></RoomTable>

    )
}

export default Rooms;