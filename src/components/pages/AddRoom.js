import React from 'react'
import RoomsForm from '../Tables/rooms/add/RoomsForm'
import '../../App.css'

function AddRoom() {
    return (
        <>
        <div className='rooms-banner-container'>
            <div className='roomsForm'>
                <RoomsForm />
            </div>
            
        </div>
    </>
    )
}

export default AddRoom
