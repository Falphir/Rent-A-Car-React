import React, { useState, useEffect } from 'react';
import Config from '../../config';
import { List, Card, Col, Row, Button, Form, Image, Space, Rate, Tabs, Table, Layout, Divider, Tag, Tooltip, Comment, message } from 'antd';
import { UserOutlined, GlobalOutlined } from '@ant-design/icons'
import { useParams, Link } from 'react-router-dom';
import { set, useForm } from "react-hook-form";
import Footer from '../Footer';
import TextArea from 'antd/lib/input/TextArea';
import Avatar from 'antd/lib/avatar/avatar';
import CarComments from '../CarComments';
import CarRatings from '../CarRatings';
import moment from 'moment'
import IconTransmission from '../IconTransmission';
import IconKilometers from '../IconKilometers';

const { forwardRef, useRef, useImperativeHandle } = React;

const { TabPane } = Tabs;
const { Meta } = Card;


function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
            });
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}


const CarDetails = (props) => {

    const Size = useWindowSize();
    const [state, setState] = useState();
    const [icon, setIcon] = useState(true)
    const [loading, setLoading] = useState(true);
    const [userLogged, setUserLogged] = useState();
    const [disabled, setDisabled] = useState();
    const [username, setUsername] = useState();
    const [reserve, setReserve] = useState();
    const { register, handleSubmit } = useForm();
    var commentsss;
    let idUser;

    const childRef = useRef();

    idUser = localStorage.getItem('idUser');

    const [data, setData] = useState({
        cars: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    });

    const { carId } = useParams();

    
    // Renderizar Extras
    const RenderExtras = () => {
        console.log(cars.extras)
        if (cars.extras == undefined) {
            console.log("extras undefined")
        } else {
            console.log("extras ready")
            return cars.extras.map((extra) => <Tag color="blue">{extra}</Tag>)
        }

    }



    const fetchApi = (pageSize, current) => {
        const url = '/rent-a-car/cars/' + carId + '?' + new URLSearchParams({
            limit: pageSize,
            skip: current - 1
        })


        fetch(url, {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                const { auth, cars = [], pagination } = response;


                if (auth) {
                    setLoading(false);
                    setData({
                        cars,
                        pagination: {
                            current: pagination.page + 1 || 1,
                            pageSize: pagination.pageSize || 10,
                            total: pagination.total || 5
                        }
                    })
                }
            });
    }

    const { cars, pagination } = data;

    const tableData = [
        {
            key: 1,
            facilities: 'Seats',
            info: cars.seats,
        },
        {
            key: 2,
            facilities: 'Kilometers',
            info: cars.kilometers,
        },
        {
            key: 3,
            facilities: 'Transmission',
            info: cars.typeTransmission,
        },
        {
            key: 4,
            facilities: 'Category',
            info: cars.carCategory,
        },
    ]

    const Extracolumns = [
        { title: 'Extras', dataIndex: 'extras', render: RenderExtras },
    ];
    
    const ExtrastableData = [
        {
            key: 1,
            extras: { RenderExtras },
        },
    ]

    const columns = [
        { title: 'Facilities', dataIndex: 'facilities' },
        { title: '', dataIndex: 'info', width: '20%', align: 'center' },
    ];

    useEffect(() => {
        fetch('/auth/me', {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                //se scope do utilizador for == ao scope q tem permissão pra ver button
                setUserLogged(response.auth);

                if (response.auth == false) {
                    localStorage.removeItem('idUser');
                    setDisabled(true);
                } else {
                    idUser = localStorage.getItem('idUser');
                    setUsername(response.decoded.name)
                    if (response.decoded.role === "user") {
                        setDisabled(false);
                    } else {
                        setDisabled(true);
                    }
                }

                
                console.log(response);
                //localStorage.setItem('idUser', response.decoded.id);
                //const userId = localStorage.getItem('idUser');


                console.log("stuff: " + response);
                //console.log("scopes: " + response.decoded.scopes);
                
            })

        fetchApi(data.pagination.pageSize, data.pagination.current);

        return () => setData({
            cars: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        });
    }, []);

    if (!userLogged) {
        localStorage.removeItem('idUser');
    }


    return (
        <>

            <Row style={{ padding: 30 }}>
                <Col span={2}></Col>
                <Col span={20}>
                    <Card bordered={true}>
                        <List grid={{
                            gutter: 8,
                            itemLayout: 'horizontal',
                            column: 2,
                        }}>
                            <List.Item>
                                <Row justify='center'>
                                    <Image src={cars.image}></Image>
                                </Row>
                            </List.Item>
                            <List.Item>
                                <Card bordered={false} title={<h3><Tag color={"geekblue"}>{cars.carCategory}</Tag><b>{cars.description}</b></h3>}>
                                    <Row>
                                        <Col span={16}>
                                            <Row justify='start'>
                                                <p className='cars-details-price-label'><b className='cars-details-price'>{cars.price}€ </b>per/Day</p>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col span={24}>
                                            <Row>
                                                <Col>
                                                    {!userLogged &&
                                                        <Tooltip placement='top' title={"You need to have an Account in order to be able to reserve this car"}>
                                                            <Button disabled type='primary'>Reserve This Car</Button>
                                                        </Tooltip>
                                                    }
                                                    {userLogged &&
                                                        <>
                                                            {disabled &&
                                                                <Tooltip placement='top' title={"You need to be logged as User in order to be able to reserve this car"}>
                                                                    <Button disabled type='primary'>Reserve This Car</Button>
                                                                </Tooltip>
                                                            }
                                                            {!disabled &&
                                                                <Link to={`/reserves/${carId}`}>
                                                                    <Button type='primary'>Reserve This Car</Button>
                                                                </Link>
                                                            }
                                                        </>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: "32px"}}>
                                                <h4><b> Specifications </b></h4>
                                            </Row>
                                            <Divider style={{ marginTop: 0 }}></Divider>
                                            <Row >
                                                <Col span={24}>
                                                    <Table columns={columns} dataSource={tableData} pagination={false} />
                                                    <Table columns={Extracolumns} dataSource={ExtrastableData} pagination={false} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        </List>
                    </Card>
                </Col>
                <Col span={2}></Col>
            </Row>
            <Footer />
        </>
    )
}

export default CarDetails;