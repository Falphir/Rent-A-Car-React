import React, { useState, useEffect } from 'react';
import Config from '../../config';
import { List, Card, Col, Row, Button, DatePicker, Form, Image, Space, Rate, Tabs, Table, Layout, Divider, Tag, Tooltip, Comment, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { useParams, Link } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';
import { set, useForm } from "react-hook-form";
import Footer from '../Footer';
import TextArea from 'antd/lib/input/TextArea';
import Avatar from 'antd/lib/avatar/avatar';
import RoomComments from '../RoomComments';
import RoomRatings from '../RoomRatings';
import moment from 'moment'

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


const RoomDetails = (props) => {

    const Size = useWindowSize();
    const [state, setState] = useState();
    const [icon, setIcon] = useState(true)
    const [loading, setLoading] = useState(true);
    const [userLogged, setUserLogged] = useState();
    const [disabled, setDisabled] = useState();
    const [username, setUsername] = useState();
    const [reserve, setReserve] = useState();
    const { register, handleSubmit } = useForm();
    const onSubmit = e => postComment(onFinish(e));
    const [Commentform] = Form.useForm();
    var commentsss;
    let idUser;

    const childRef = useRef();

    idUser = localStorage.getItem('idUser');

    const [data, setData] = useState({
        rooms: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    });

    const { roomId } = useParams();

    // Renderizar Extras
    const RenderExtras = () => {
        console.log(rooms.extras)
        if (rooms.extras == undefined) {
            console.log("extras undefined")
        } else {
            console.log("extras ready")
            return rooms.extras.map((extra) => <Tag color="blue">{extra}</Tag>)
        }

    }



    const columns = [
        { title: 'Facilities', dataIndex: 'facilities' },
        { title: 'Quantity', dataIndex: 'quantity', width: '10%', align: 'center' },
    ];

    const Extracolumns = [
        { title: 'Extras', dataIndex: 'extras', render: RenderExtras },
    ];



    const fetchApi = (pageSize, current) => {
        const url = '/hotel/rooms/' + roomId + '?' + new URLSearchParams({
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


    const postComment = (data) => {
        //fetch('/comment/comments/' + roomId, {
        fetch('/comment/comments/:roomId', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data)
        })

            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('Comment Published');
                    return (
                        <>
                            {response.json()}
                            {Commentform.resetFields()}
                            {childRef.current.reloadList()}
                        </>
                    )
                } else {
                    console.log(response);
                    message.error('An Error Occurred while publishing the comment. Please Try Again Later!');
                }
            })

            .catch((err) => {
                console.error('error:', err);
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

                if (response.auth == false) {
                    localStorage.removeItem('idUser');
                    setDisabled(true);
                } else {
                    idUser = localStorage.getItem('idUser');
                    setUsername(response.decoded[3])
                    if (response.decoded[2] === "user") {
                        setDisabled(false);
                    } else {
                        setDisabled(true);
                    }
                }

                
                console.log(response);
                //localStorage.setItem('idUser', response.decoded[1]);
                //const userId = localStorage.getItem('idUser');


                console.log("stuff: " + response);
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


    function callback(key) {
        console.log(key);
    }

    const tableData = [
        {
            key: 1,
            facilities: 'Number of Double Bed',
            quantity: rooms.nDoubleBed,
        },
        {
            key: 2,
            facilities: 'Number of Single Bed',
            quantity: rooms.nSingleBed,
        },
        {
            key: 3,
            facilities: 'Number Rooms',
            quantity: rooms.nRoom,
        },
    ]

    const ExtrastableData = [
        {
            key: 1,
            extras: { RenderExtras },
        },
    ]

    const onChange = () => {
        setIcon(!icon)
    }

    /* function onChangeComment(date, comment) {
        console.log("comment: " + comment);
        commentsss = comment;
    } */

    const onFinish = (e) => {

        idUser = localStorage.getItem('idUser');

        console.log(e);
        console.log("userID: " + idUser);
        console.log("roomID: " + roomId);
        console.log("comment: " + commentsss);

        return {
            date: moment().format('YYYY/MM/DD'),
            comment: e.comment,
            rating: e.rating,
            idUser: idUser,
            nameUser: username,
            idRoom: roomId
        }
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
                                    <Image src={rooms.image}></Image>
                                </Row>
                            </List.Item>
                            <List.Item>
                                <Card bordered={false} title={<h3><Tag color={"geekblue"}>{rooms.typeRoom}</Tag><b>{rooms.description}</b></h3>}>
                                    <Row>
                                        <Col span={16}>
                                            <Row justify='start'>
                                                <p className='rooms-details-price-label'><b className='rooms-details-price'>{rooms.price}€ </b>per/Person</p>
                                            </Row>
                                        </Col>
                                        <Col span={8}>
                                            <Row justify='end'>
                                                <Rate disabled value={rooms.nStars}></Rate>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col span={24}>
                                            <Row>
                                                <h4><b> Capacity </b></h4>
                                            </Row>
                                            <Divider style={{ marginTop: 0 }}></Divider>
                                            <Row justify='start'>
                                                <Tooltip placement='top' title={"Adults"}>
                                                    <div className='rooms-details-icons' style={{ marginRight: 16 }}><i class="fas fa-user-alt"></i> {rooms.nAdult} </div>
                                                </Tooltip>
                                                <Tooltip placement='top' title={"Childrens"}>
                                                    <div className='rooms-details-icons'><i class="fas fa-child"></i> {rooms.nChild}  </div>
                                                </Tooltip>
                                            </Row>
                                            <Row justify='start' >

                                            </Row>
                                            <Row style={{ paddingTop: 20 }}>
                                                <Col>
                                                    {!userLogged &&
                                                        <Tooltip placement='top' title={"You need to have an Account in order to be able to reserve this room"}>
                                                            <Button disabled type='primary'>Reserve This Room</Button>
                                                        </Tooltip>
                                                    }
                                                    {userLogged &&
                                                        <>
                                                            {disabled &&
                                                                <Tooltip placement='top' title={"You need to be logged as User in order to be able to reserve this room"}>
                                                                    <Button disabled type='primary'>Reserve This Room</Button>
                                                                </Tooltip>
                                                            }
                                                            {!disabled &&
                                                                <Link to={`/reserves/${roomId}`}>
                                                                    <Button type='primary'>Reserve This Room</Button>
                                                                </Link>
                                                            }
                                                        </>
                                                    }
                                                </Col>
                                                <Col>
                                                    <div style={{ paddingLeft: 8 }}>
                                                        {/* favorites */}
                                                        {!userLogged &&
                                                            <Tooltip placement='top' title={"You need to have an Account in order to be able to Add this room to favorites"}>
                                                                <Button disabled><HeartOutlined />Add to Favorites</Button>
                                                            </Tooltip>
                                                        }
                                                        {userLogged &&
                                                            <>
                                                                {disabled &&
                                                                    <Tooltip placement='top' title={"You need to be logged as User in order to be able to Add this room to favorites"}>
                                                                        <Button disabled ><HeartFilled style={{ color: 'red' }} /> Add to Favorites</Button>
                                                                    </Tooltip>
                                                                }
                                                                {!disabled &&
                                                                    <Link to={`/favorites/${roomId}`}>
                                                                        <Button bordered={false}><HeartFilled style={{ color: 'red' }} /> Add to Favorites</Button>
                                                                    </Link>
                                                                }
                                                            </>
                                                        }
                                                    </div>

                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                            <Row>
                                <Col span={24}>
                                    <Tabs defaultActiveKey="1" onChange={callback}>
                                        <TabPane tab="Information" key="1">
                                            <Table columns={columns} dataSource={tableData} pagination={false} />
                                            <Table columns={Extracolumns} dataSource={ExtrastableData} pagination={false} />
                                        </TabPane>
                                        <TabPane tab="Comments" key="2">
                                            <RoomComments data={roomId} ref={childRef} />
                                            {!userLogged &&
                                                <Tooltip placement='top' title={"You need to have an Account in order to be able to Add this room to favorites"}>
                                                    <Comment
                                                        disabled
                                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                                        content={
                                                            <Form layout='vertical' onFinish={onSubmit}>
                                                                <Form.Item name="rating">
                                                                    <Rate disabled></Rate>
                                                                </Form.Item>
                                                                <Form.Item name="comment">
                                                                    <TextArea disabled rows={4} placeholder='Insert your comment!'></TextArea>
                                                                </Form.Item>
                                                                <Form.Item>
                                                                    <Button disabled type='primary' htmlType='submit'>Submit</Button>
                                                                </Form.Item>
                                                            </Form>
                                                        }
                                                    >
                                                    </Comment>
                                                </Tooltip>
                                            }
                                            {userLogged &&
                                                <>
                                                    {disabled &&
                                                        <Tooltip placement='top' title={"You need to be logged as User in order to be able to comment in this Room"}>
                                                            <Comment
                                                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                                                content={
                                                                    <Form layout='vertical' onFinish={onSubmit}>
                                                                        <Form.Item name="rating">
                                                                            <Rate disabled></Rate>
                                                                        </Form.Item>
                                                                        <Form.Item name="comment">
                                                                            <TextArea disabled rows={4} placeholder='Insert your comment!'></TextArea>
                                                                        </Form.Item>
                                                                        <Form.Item>
                                                                            <Button disabled type='primary' htmlType='submit'>Submit</Button>
                                                                        </Form.Item>
                                                                    </Form>
                                                                }
                                                            >
                                                            </Comment>
                                                        </Tooltip>
                                                    }
                                                    {!disabled &&
                                                        <Comment
                                                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                                            content={
                                                                <Form form={Commentform} layout='vertical' onFinish={onSubmit}>
                                                                    <Form.Item name="rating">
                                                                        <Rate></Rate>
                                                                    </Form.Item>
                                                                    <Form.Item name="comment">
                                                                        <TextArea rows={4} placeholder='Insert your comment!'></TextArea>
                                                                    </Form.Item>
                                                                    <Form.Item>
                                                                        <Button type='primary' htmlType='submit'>Submit</Button>
                                                                    </Form.Item>
                                                                </Form>
                                                            }
                                                        >
                                                        </Comment>
                                                    }
                                                </>
                                            }
                                        </TabPane>
                                        <TabPane tab="Ratings" key="3">
                                            <RoomRatings data={roomId} />
                                        </TabPane>
                                    </Tabs>
                                </Col>
                            </Row>
                        </List>
                    </Card>
                </Col>
                <Col span={2}></Col>
            </Row>
            <Footer />
        </>
    )
}

export default RoomDetails;