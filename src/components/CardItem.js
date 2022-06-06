import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CardItem(props) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        rooms: [],
        pagination: {
            current: 1,
            pageSize: 15,
            total: 0
        }
    });


    const renderTags = (tags) => {
        return tags.map((tag) => {
            return (
                <label key={tag._id}>
                    Type Room: {tag.typeRoom},
                    VIP: {tag.vip.toString()},
                    Nº Pool: {tag.nPool},
                    Car Park: {tag.carPark.toString()},
                    Breakfast: {tag.breakfast.toString()},
                    Lunch: {tag.lunch.toString()},
                    Spa: {tag.spa.toString()},
                    Nº Stars: {tag.nStars},
                    Nº Single Bed: {tag.nSingleBed},
                    Nº Double Bed: {tag.nDoubleBed}
                </label>
            )
        })
    }


    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
        },

        {
            title: 'Description',
            dataIndex: 'description',
        },

        {
            title: 'Nº Adults',
            dataIndex: 'nAdult',
        },

        {
            title: 'Nº Children',
            dataIndex: 'nChild',
        },

        {
            title: 'Nº Rooms',
            dataIndex: 'nRoom',
        },

        {
            title: 'Price (€)',
            dataIndex: 'price',
        },

        {
            title: 'Tags',
            dataIndex: 'tags',
            render: renderTags,
        },
    ];


    const fetchApi = (pageSize, current) => {
        const url = '/hotel/rooms?' + new URLSearchParams({
            limit: pageSize,
            skip: current - 1
        })


        fetch(url, {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                const { auth, rooms = [], pagination } = response;


                if (auth) {
                    setLoading(false);
                    setData({
                        rooms,
                        pagination: {
                            current: pagination.page + 1 || 1,
                            pageSize: pagination.pageSize || 10,
                            total: pagination.total || 5
                        }
                    })
                }
            });
    }


    useEffect(() => {
        fetchApi(data.pagination.pageSize, data.pagination.current);

        return () => setData({
            rooms: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        });
    }, []);


    const handleTableChange = (pagination) => {
        fetchApi(pagination.pageSize, pagination.current)
    };


    const { rooms, pagination } = data;

    return (

        <>
            <li className="cards__item">
                <Link to={props.path} className="cards__item__link" >
                    <figure className="cards__item__pic-wrap" data-category={props.price}>
                        <img src={props.src} alt="Image" className="cards__item__img" />
                    </figure>
                    <div className="cards__item__info">
                        <h5 className="cards__item__text">{props.text}</h5>
                    </div>
                </Link>
            </li>
        </>
    )
}

export default CardItem
