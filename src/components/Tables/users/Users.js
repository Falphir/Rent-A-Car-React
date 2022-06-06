import './Users.css';
import Config from '../../../config';
import React from 'react';
import { Navigate } from 'react-router-dom';
import UserTable from './UserTable';



const Users = () => {

    //se n tiver configurado o token no config.js, irá diretamente redirecionar para a homepage
    if (!Config.token) {
        return <Navigate to={'/'}></Navigate>
    }


    return (
        <div className='user-container'>
            <UserTable></UserTable>
        </div>
    )
}

export default Users;