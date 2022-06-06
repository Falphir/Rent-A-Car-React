import './RoomTable.css';
import React, { useState, useEffect } from 'react';
import Config from '../../../config';
import { Table, Modal, Tag, Button, Row, Col, Input, InputNumber, message, Form, Select, Rate, Checkbox } from 'antd';
import { SelectOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import RoomsForm from './add/RoomsForm';
import { storage } from '../../../firebase';
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'react-use-storage';
import { getPreferencesUrlStorage, preferencesToStorage } from '../../../utils/localStorage'

const { TextArea } = Input;

const RoomTable = (props) => {

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null)
    const [unlockSubmit, setUnlockSubmit] = useState()
    const onSubmit = e => FetchEditRoom(updateRoom(e));
    const [image, setImage] = useState(null);
    const [ImageUrl, setImageUrl] = useState("");
    const [ImageChange, setImageChange] = useState();
    const [submit, setSubmit] = useState(true);
    const preferences = getPreferencesUrlStorage("RoomTable");
    const [preferencesStorage, setPreferencesToStorage] = useLocalStorage(preferences, {
        current: preferences[preferencesToStorage.PAGE_TABLE] || 1
    })


    const [data, setData] = useState({
        rooms: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
            ...preferencesStorage
        }
    });

    const handleChange = e => {
        console.log(e)
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
        setSubmit(false);
        setImageChange(true);
    }


    const handleUpload = (file) => {
        if (file != null) {
            const uploadTask = storage.ref(`images/${file.name}`).put(file);
            uploadTask.on(
                "state_changed",
                snapshot => { },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                        .ref("images")
                        .child(file.name)
                        .getDownloadURL()
                        .then(ImageUrl => {
                            console.log(ImageUrl);
                            setImageUrl(ImageUrl);
                            if (ImageUrl = null) {
                                setSubmit(false);
                            } else {
                                setSubmit(true);
                            }

                        });
                }
            )

        }

    }

    console.log("image: ", image);

    //Renderizar Imagem
    const renderImage = (text, record) => {
        return (
            <Link to={`/rooms/${record._id}`}>
                <img src={record.image} alt="Room Image" style={{ width: 150, height: 75 }} />
            </Link>
        );
    }

    //Renderizar Imagem
    const renderFacilities = (text, record) => {
        console.log("facilities: " + record)
        return (
            <label key={record._id}>
                <Tag color="blue">Type Room: {record.typeRoom} </Tag>
                <Tag color="blue">Nº Stars: {record.nStars}</Tag>
                <Tag color="blue">Nº Single Bed: {record.nSingleBed}</Tag>
                <Tag color="blue">Nº Double Bed: {record.nDoubleBed}</Tag>
            </label>
        );
    }


    //Renderizar Extras
    const renderExtras = (extras) => {
        console.log(extras)
        return extras.map((extra) => {
            return (
                <label key={extra._id} >
                    <Tag color="blue">{extra}</Tag>
                </label >
            )
        })
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: renderImage
        },
        // render: () => <img src={`image`} style={{width: 100}, {height: 50}}/>
        // <img src="images/room2.jpg" style={{width: 100}, {height: 50}}/>
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
            defaultSortOrder: 'ascend',
        },

        {
            title: 'Nº Adults',
            dataIndex: 'nAdult',
            sorter: (a, b) => a.nAdult - b.nAdult,
        },

        {
            title: 'Nº Children',
            dataIndex: 'nChild',
            sorter: (a, b) => a.nChild - b.nChild,
        },

        {
            title: 'Nº Rooms',
            dataIndex: 'nRoom',
            sorter: (a, b) => a.nRoom - b.nRoom,
        },

        {
            title: 'Price (€)',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
        },

        {
            title: 'Facilities',
            dataIndex: 'facilities',
            render: renderFacilities,

        },
        {
            title: 'Extras',
            dataIndex: 'extras',
            render: renderExtras,
        },
        {
            title: 'Actions',
            fixed: 'right',
            render: (record) => {
                return <>
                    <Row justify='center'>
                        <Link to={`/rooms/${record._id}`}><SelectOutlined style={{ color: "blue" }} /></Link>
                        <EditOutlined onClick={() => { onEditRoom(record) }} style={{ marginLeft: 12 }} />
                        <DeleteOutlined onClick={() => { onDeleteRoom(record) }} style={{ color: "red", marginLeft: 12 }} />
                    </Row>
                </>
            }
        }

    ];

    const onDeleteRoom = (record) => {
        Modal.confirm({
            title: 'Are you sure, you want to delete this room?',
            onOk: () => {
                fetch(`/hotel/rooms/${record._id}`, {
                    method: 'DELETE',
                })
                reloadTable()
            },
        });
    };

    const onEditRoom = (e) => {
        setIsEditing(true)
        setEditingRoom({ ...e })
    };


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

                    const currentPage = pagination.page + 1 || 1;

                    setData({
                        rooms,
                        pagination: {
                            current: currentPage,
                            pageSize: pagination.pageSize || 10,
                            total: pagination.total || 5
                        }
                    })

                    setPreferencesToStorage({
                        current: currentPage
                    })
                }
            });
    }

    useEffect(() => {
        fetchApi(data.pagination.pageSize, data.pagination.current);
        setData({
            rooms: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        });
    }, []);

    useEffect(() => {
        handleUpload(image);
    }, [image]);



    const handleTableChange = (pagination) => {
        fetchApi(pagination.pageSize, pagination.current)
    };

    const { rooms, pagination } = data;

    const FetchEditRoom = (DATA) => {
        console.log("ID ROOM FETCH : " + editingRoom._id);
        fetch('/hotel/rooms/' + editingRoom._id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(DATA)
        })
            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('Room Successfully Edited!');
                    //alert("Room created");
                    return (
                        <>
                            {response.json()}
                            {reloadTable()}
                        </>
                    )

                } else {

                    console.log(response);
                    message.error('An ERROR Occurred While Editing the Room!');
                    //alert("Room duplicate");
                }
            })

            .catch((err) => {
                console.error('error:', err);
            });
    }

    const updateRoom = (e) => {
        console.log("description: " + e.description)
        if (ImageChange) {
            setImageChange(false)
            return {
                image: ImageUrl,
                description: e.description,
                nAdult: e.nAdult,
                nChild: e.nChild,
                nRoom: e.nRoom,
                price: e.price,
                typeRoom: e.typeRoom,
                nSingleBed: e.nSingleBed,
                nDoubleBed: e.nDoubleBed,
                nStars: e.nStars,
                extras: e.extras
            }

        } else {
            return {
                image: e.image,
                description: e.description,
                nAdult: e.nAdult,
                nChild: e.nChild,
                nRoom: e.nRoom,
                price: e.price,
                typeRoom: e.typeRoom,
                nSingleBed: e.nSingleBed,
                nDoubleBed: e.nDoubleBed,
                nStars: e.nStars,
                extras: e.extras
            }
        }

    }

    const resetEditing = () => {
        setIsEditing(false)
        setEditingRoom(null)
    }

    const reloadTable = () => {
        handleTableChange(pagination)
    }


    console.log(rooms._id)
    console.log("total: " + pagination.total)

    return (
        <div>
            <Row>
                <Col span={12}>
                    <Row justify="start">
                        <Col>
                            <Button onClick={reloadTable} style={{ marginBottom: 8 }}>
                                <ReloadOutlined />
                            </Button>
                        </Col>
                    </Row>

                </Col>
                <Col span={12}>
                    <Row justify="end">
                        <Col>
                            <Link to='/roomsForm'>
                                <Button style={{ marginBottom: 8 }}>
                                    <PlusOutlined style={{ marginRight: 8 }} /> Add Room
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Table
                columns={columns}
                rowKey={record => record._id}
                dataSource={rooms}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 1500 }}
                sticky

            >
            </Table>

            <Modal
                title="Edit Room"
                visible={isEditing}
                okText="Save"
                onCancel={() => {
                    resetEditing()
                }}
                onOk={() => {
                    console.log("idRoom : " + editingRoom._id)
                    //idRoom = editingRoom.id
                    setIsEditing(false);
                    resetEditing()
                    onSubmit(editingRoom)

                }}
                okButtonProps={!submit && { disabled: true }}
            >
                <h2></h2>
                <Form layout='vertical'>
                    <Form.Item label={<h4><b>Description</b></h4>}>
                        <TextArea value={editingRoom?.description} onChange={(e) => {
                            setEditingRoom(pre => {
                                return { ...pre, description: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Adults</b></h4>}>
                        <InputNumber min={0} value={editingRoom?.nAdult} onChange={(e) => {
                            console.log("n Adults: " + e)
                            setEditingRoom(pre => {
                                return { ...pre, nAdult: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Childrens</b></h4>}>
                        <InputNumber min={0} value={editingRoom?.nChild} onChange={(e) => {
                            setEditingRoom(pre => {
                                console.log("n Childs: " + e)
                                return { ...pre, nChild: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Rooms</b></h4>}>
                        <InputNumber min={0} value={editingRoom?.nRoom} onChange={(e) => {
                            console.log("n Rooms: " + e)
                            setEditingRoom(pre => {
                                return { ...pre, nRoom: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Price</b></h4>}>
                        <InputNumber min={0} addonAfter="€" value={editingRoom?.price} onChange={(e) => {
                            setEditingRoom(pre => {
                                return { ...pre, price: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item name="typeRoom" label={<h4><b>Type of Room</b></h4>} style={{ width: 400 }}>
                        <Select defaultValue={editingRoom?.typeRoom} onChange={e => {
                            setEditingRoom(pre => {
                                return { ...pre, typeRoom: e }
                            })
                        }}>
                            <Select.Option value="Apartamento" />
                            <Select.Option value="Quarto" />
                            <Select.Option value="Casa de Férias" />
                            <Select.Option value="Hostel" />
                            <Select.Option value="Casa de Campo" />
                            <Select.Option value="Outro" />
                        </Select>
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Double Beds</b></h4>}>
                        <InputNumber min={0} value={editingRoom?.nDoubleBed} onChange={(e) => {
                            console.log("n DoubleBed: " + e)
                            setEditingRoom(pre => {
                                return { ...pre, nDoubleBed: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Single Beds</b></h4>}>
                        <InputNumber min={0} value={editingRoom?.nSingleBed} onChange={(e) => {
                            console.log("n SingleBed: " + e)
                            setEditingRoom(pre => {
                                return { ...pre, nSingleBed: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Stars</b></h4>}>
                        <Rate value={editingRoom?.nStars} onChange={(e) => {
                            console.log("n Stars: " + e)
                            setEditingRoom(pre => {
                                return { ...pre, nStars: e }
                            })
                        }} />
                    </Form.Item>
                    <h3><b>Extras</b></h3>
                    <Form.Item >
                        <Checkbox.Group value={editingRoom?.extras} onChange={(e) => {
                            console.log("n extras: " + e)
                            setEditingRoom(pre => {
                                return { ...pre, extras: e }
                            })
                        }} >
                            <Row>
                                <Col>
                                    <Checkbox value="vip" style={{ lineHeight: '32px' }}>
                                        VIP
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="carPark" style={{ lineHeight: '32px' }}>
                                        Car Park
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="breakfast" style={{ lineHeight: '32px' }}>
                                        Breakfast
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="lunch" style={{ lineHeight: '32px' }}>
                                        Lunch
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="spa" style={{ lineHeight: '32px' }}>
                                        Spa
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="pool" style={{ lineHeight: '32px' }}>
                                        Pool
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <input type="file" onChange={handleChange} />
                </Form>

            </Modal>
        </div >
    )
}

export default RoomTable;