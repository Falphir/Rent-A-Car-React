import './Rooms.css';
import React from 'react';
import RoomsCard from './RoomsCard';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom'


const Rooms = () => {

    return (
        <div className='room-container'>
            <h1>Check out these Rooms!</h1>
            <div className='cards__container'>
                
                <RoomsCard></RoomsCard>
            </div>
        </div>
    )
}

export default Rooms;