import { Table } from 'antd';
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SelectOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, List, Card, Col, Row, Popover, Image } from 'antd';
import NotFound from '../../../assets/images/Room-Unavailable1.jpg'

const { Meta } = Card;

const FavoritesRooms = (props) => {

    const [loading, setLoading] = useState(true);
    const [userLogged, setUserLogged] = useState();
    const [data, setData] = useState({
        rooms: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    });


    const fetchApi = (pageSize, current) => {
        const url = '/hotel/rooms/' + props.data + '?' + new URLSearchParams({
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
        fetch('/auth/me', {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                //se scope do utilizador for == ao scope q tem permissão pra ver button
                setUserLogged(response.auth);
                console.log("stuff: " + response.auth);
                console.log("scopes: " + response.decoded);
            })

        fetchApi(data.pagination.pageSize, data.pagination.current);

        return () => setData({
            rooms: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        });
    }, []);

    if (!userLogged) {
        localStorage.removeItem('idUser');
    }

    const { rooms, pagination } = data;

    if (rooms != null) {
        console.log(rooms.image)
    }

    // Renderizar Extras
    const RenderRoom = () => {
        console.log(rooms)
        if (rooms == null) {
            console.log("room Null")
            return (<>
                    <Image
                        preview={false}
                        src={NotFound}
                    />
            </>)

        } else {
            console.log("Rooms ready")
            return (<>
                    <Link to={`/rooms/${props.data}`}>
                        <Card className='card' cover={<img className='card-img' alt="example" src={rooms.image} />}>
                            <Meta
                                title={<span style={{ fontWeight: 'bold' }}>{rooms.description}</span>}>
                            </Meta>

                            <div className="additional" style={{ marginTop: 16 }}>
                                <Row justify='center'>
                                    <Col flex="auto">
                                        {rooms.nStars} <i class="fas fa-star"></i>
                                    </Col>

                                    <Col flex="auto">
                                        {rooms.nAdult} <i class="fas fa-user-alt"></i>
                                    </Col>

                                    <Col flex="auto">
                                        {rooms.nChild} <i class="fas fa-child"></i>
                                    </Col>

                                    <Col flex="auto">
                                        {rooms.price} <i class="fas fa-euro-sign"></i>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Link>
            </>)
        }

    }

    

    console.log(props.data)

    return (
        <>
            {RenderRoom()}
        </>
    )
}

export default FavoritesRooms;