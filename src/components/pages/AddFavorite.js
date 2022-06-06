import React from 'react'
import FavoritesForm from '../Tables/favorites/add/FavoritesForm'
import '../../App.css'

function addFavorite() {
    return (
        <>
            <div className='favorites-banner-container'>
                <div className='favoritesForm'>
                    <FavoritesForm />
                </div>
            </div>
        </>
    )
}

export default addFavorite