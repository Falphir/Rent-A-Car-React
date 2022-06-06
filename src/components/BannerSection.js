import React, { useState, useEffect } from 'react';
import '../App.css';
import './BannerSection.css';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';


function BannerSection() {
    const [descricao, setDescricao] = useState("");


    const handleChange = e => {
        setDescricao(e.target.value);
    };


    return (

        <div className='banner-container'>
            <h1>FIND BOOK ENJOY</h1>
            <p>What are you waiting for?</p>
            <div className="banner-search">
                <Input className='input' placeholder="Search here..." name="search" onChange={handleChange} />
                <Link to={`/rooms/search/${descricao}`}>
                    <Button className='btn-search'>
                        <i class="fas fa-search" aria-hidden="true"></i>
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default BannerSection;
