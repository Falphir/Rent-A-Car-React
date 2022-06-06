import { Table, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SelectOutlined, EllipsisOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
        const url = '/hotel/rooms/' + props.RoomId + '?' + new URLSearchParams({
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
                <Popover placement="topLeft" title="Settings" content={<DeleteOutlined style={{ color: 'red' }} />}>
                    <Image
                        preview={false}
                        src={NotFound}
                    />
                </Popover>
            </>)

        } else {
            console.log("extras ready")
            return (<>
                
                    <Link to={`/rooms/${props.RoomId}`}>
                        <Card className='card' cover={<img className='card-img' alt="example" src={rooms.image} />}>
                            <Meta
                                title={<span style={{ fontWeight: 'bold' }}>{rooms.description}</span>}>
                            </Meta>
                            <div className="additional" style={{ marginTop: 16 }}>
                                <Row justify='center'>
                                    <Col flex="auto">
                                        <Row justify='center'>
                                            <Tooltip title="Check In">
                                                <ClockCircleOutlined /> {props.checkIn}
                                            </Tooltip>
                                        </Row>
                                    </Col>
                                    <Col flex="auto">
                                        <Row justify='center'>
                                            <Tooltip title="Check Out">
                                                <ClockCircleOutlined /> {props.checkOut}
                                            </Tooltip>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Link>
            </>)
        }

    }

    console.log("teste: " + props.DateCheckOut)

    return (
        <>
            {RenderRoom()}
        </>
    )
}

export default FavoritesRooms;