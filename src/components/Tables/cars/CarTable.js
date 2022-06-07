import './CarTable.css';
import React, { useState, useEffect } from 'react';
import Config from '../../../config';
import { Table, Modal, Tag, Button, Row, Col, Input, InputNumber, message, Form, Select, Rate, Checkbox } from 'antd';
import { SelectOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import CarsForm from './add/CarsForm';
import { storage } from '../../../firebase';
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'react-use-storage';
import { getPreferencesUrlStorage, preferencesToStorage } from '../../../utils/localStorage'

const { TextArea } = Input;

const CarTable = (props) => {

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCar, setEditingCar] = useState(null)
    const [unlockSubmit, setUnlockSubmit] = useState()
    const onSubmit = e => FetchEditCar(updateCar(e));
    const [image, setImage] = useState(null);
    const [ImageUrl, setImageUrl] = useState("");
    const [ImageChange, setImageChange] = useState();
    const [submit, setSubmit] = useState(true);
    const preferences = getPreferencesUrlStorage("CarTable");
    const [preferencesStorage, setPreferencesToStorage] = useLocalStorage(preferences, {
        current: preferences[preferencesToStorage.PAGE_TABLE] || 1
    })


    const [data, setData] = useState({
        cars: [],
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
            <Link to={`/cars/${record._id}`}>
                <img src={record.image} alt="Car Image" style={{ width: 150, height: 75 }} />
            </Link>
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
        // <img src="images/car2.jpg" style={{width: 100}, {height: 50}}/>
        {
            title: 'Title',
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },

        {
            title: 'Nº Seats',
            dataIndex: 'seats',
            sorter: (a, b) => a.seats - b.seats,
        },

        {
            title: 'Kilometers',
            dataIndex: 'kilometers',
            sorter: (a, b) => a.kilometers - b.kilometers,
        },
        {
            title: 'Price (€)',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Transmission',
            dataIndex: 'typeTransmission',
            sorter: (a, b) => a.typeTransmission - b.typeTransmission,
        },
        {
            title: 'Category',
            dataIndex: 'carCategory',
            sorter: (a, b) => a.carCategory - b.carCategory,
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
                        <Link to={`/cars/${record._id}`}><SelectOutlined style={{ color: "blue" }} /></Link>
                        <EditOutlined onClick={() => { onEditCar(record) }} style={{ marginLeft: 12 }} />
                        <DeleteOutlined onClick={() => { onDeleteCar(record) }} style={{ color: "red", marginLeft: 12 }} />
                    </Row>
                </>
            }
        }

    ];

    const onDeleteCar = (record) => {
        Modal.confirm({
            title: 'Are you sure, you want to delete this car?',
            onOk: () => {
                fetch(`/rent-a-car/cars/${record._id}`, {
                    method: 'DELETE',
                })
                reloadTable()
            },
        });
    };

    const onEditCar = (e) => {
        setIsEditing(true)
        setEditingCar({ ...e })
    };


    const fetchApi = (pageSize, current) => {
        const url = '/rent-a-car/cars?' + new URLSearchParams({
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

                    const currentPage = pagination.page + 1 || 1;

                    setData({
                        cars,
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
            cars: [],
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

    const { cars, pagination } = data;

    const FetchEditCar = (DATA) => {
        console.log("ID CAR FETCH : " + editingCar._id);
        fetch('/rent-a-car/cars/' + editingCar._id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(DATA)
        })
            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('Car Successfully Edited!');
                    //alert("Car created");
                    return (
                        <>
                            {response.json()}
                            {reloadTable()}
                        </>
                    )

                } else {

                    console.log(response);
                    message.error('An ERROR Occurred While Editing the Car!');
                    //alert("Car duplicate");
                }
            })

            .catch((err) => {
                console.error('error:', err);
            });
    }

    const updateCar = (e) => {
        console.log("description: " + e.description)
        if (ImageChange) {
            setImageChange(false)
            return {
                image: ImageUrl,
                title: e.title,
                description: e.description,
                seats: e.seats,
                kilometers: e.kilometers,
                price: e.price,
                typeTransmission: e.typeTransmission,
                carCategory: e.carCategory,
                location: e.location,
                extras: e.extras
            }

        } else {
            return {
                image: e.image,
                title: e.title,
                description: e.description,
                seats: e.seats,
                kilometers: e.kilometers,
                price: e.price,
                typeTransmission: e.typeTransmission,
                carCategory: e.carCategory,
                location: e.location,
                extras: e.extras
            }
        }

    }

    const resetEditing = () => {
        setIsEditing(false)
        setEditingCar(null)
    }

    const reloadTable = () => {
        handleTableChange(pagination)
    }


    console.log(cars._id)
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
                            <Link to='/carsForm'>
                                <Button style={{ marginBottom: 8 }}>
                                    <PlusOutlined style={{ marginRight: 8 }} /> Add Car
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Table
                columns={columns}
                rowKey={record => record._id}
                dataSource={cars}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 1500 }}
                sticky

            >
            </Table>

            <Modal
                title="Edit Car"
                visible={isEditing}
                okText="Save"
                onCancel={() => {
                    resetEditing()
                }}
                onOk={() => {
                    console.log("idCar : " + editingCar._id)
                    //idCar = editingCar.id
                    setIsEditing(false);
                    resetEditing()
                    onSubmit(editingCar)

                }}
                okButtonProps={!submit && { disabled: true }}
            >
                <h2></h2>
                <Form layout='vertical'>
                    <Form.Item label={<h4><b>Description</b></h4>}>
                        <Input value={editingCar?.title} onChange={(e) => {
                            setEditingCar(pre => {
                                return { ...pre, title: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Description</b></h4>}>
                        <TextArea value={editingCar?.description} onChange={(e) => {
                            setEditingCar(pre => {
                                return { ...pre, description: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Seats</b></h4>}>
                        <InputNumber min={0} value={editingCar?.seats} onChange={(e) => {
                            console.log("n Seats: " + e)
                            setEditingCar(pre => {
                                return { ...pre, seats: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Kilometers</b></h4>}>
                        <Input value={editingCar?.kilometers} onChange={(e) => {
                            setEditingCar(pre => {
                                console.log("kilometers: " + e)
                                return { ...pre, kilometers: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Price</b></h4>}>
                        <InputNumber min={0} addonAfter="€" value={editingCar?.price} onChange={(e) => {
                            setEditingCar(pre => {
                                return { ...pre, price: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item name="typeTransmission" label={<h4><b>Type of Transmission</b></h4>} style={{ width: 400 }}>
                        <Select defaultValue={editingCar?.typeTransmission} onChange={e => {
                            setEditingCar(pre => {
                                return { ...pre, typeTransmission: e }
                            })
                        }}>
                            <Select.Option value="Manual" />
                            <Select.Option value="Automatic" />
                        </Select>
                    </Form.Item>
                    <Form.Item name="carCategory" label={<h4><b>Car Category</b></h4>} style={{ width: 400 }}>
                        <Select defaultValue={editingCar?.carCategory} onChange={e => {
                            setEditingCar(pre => {
                                return { ...pre, carCategory: e }
                            })
                        }}>
                            <Select.Option value="Small" />
                            <Select.Option value="Medium" />
                            <Select.Option value="Large" />
                        </Select>
                    </Form.Item>
                    <Form.Item label={<h4><b>Location</b></h4>}>
                        <Input value={editingCar?.location} onChange={(e) => {
                            setEditingCar(pre => {
                                return { ...pre, location: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <h3><b>Extras</b></h3>
                    <Form.Item >
                        <Checkbox.Group value={editingCar?.extras} onChange={(e) => {
                            console.log("n extras: " + e)
                            setEditingCar(pre => {
                                return { ...pre, extras: e }
                            })
                        }} >
                            <Row>
                                <Col>
                                    <Checkbox value="gps" style={{ lineHeight: '32px'}}>
                                        GPS
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="babySeat" style={{ lineHeight: '32px'}}>
                                        Baby Seat
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="aditionalDriver" style={{ lineHeight: '32px'}}>
                                        Aditional Driver
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="boosterSeat" style={{ lineHeight: '32px'}}>
                                        Booster Seat
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

export default CarTable;