import React from 'react'
import ReservesForm from '../Tables/reserves/add/ReservesForm'
import '../../App.css'

function addReserve() {
    return (
        <>
            <div className='reserve-banner-container'>
                <div className='reserveForm'>
                    <ReservesForm />
                </div>
            </div>
        </>
    )
}

export default addReserve
