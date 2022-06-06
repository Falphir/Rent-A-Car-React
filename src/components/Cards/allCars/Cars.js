import './Cars.css';
import React from 'react';
import CarsCard from './CarsCard';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom'


const Cars = () => {

    return (
        <div className='car-container'>
            <h1>Check out these Cars!</h1>
            <div className='cards__container'>
                
                <CarsCard></CarsCard>
            </div>
        </div>
    )
}

export default Cars;