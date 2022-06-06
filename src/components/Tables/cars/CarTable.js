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
                description: e.description,
                nAdult: e.nAdult,
                nChild: e.nChild,
                nCar: e.nCar,
                price: e.price,
                typeCar: e.typeCar,
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
                nCar: e.nCar,
                price: e.price,
                typeCar: e.typeCar,
                nSingleBed: e.nSingleBed,
                nDoubleBed: e.nDoubleBed,
                nStars: e.nStars,
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
                        <TextArea value={editingCar?.description} onChange={(e) => {
                            setEditingCar(pre => {
                                return { ...pre, description: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Adults</b></h4>}>
                        <InputNumber min={0} value={editingCar?.nAdult} onChange={(e) => {
                            console.log("n Adults: " + e)
                            setEditingCar(pre => {
                                return { ...pre, nAdult: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Childrens</b></h4>}>
                        <InputNumber min={0} value={editingCar?.nChild} onChange={(e) => {
                            setEditingCar(pre => {
                                console.log("n Childs: " + e)
                                return { ...pre, nChild: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Cars</b></h4>}>
                        <InputNumber min={0} value={editingCar?.nCar} onChange={(e) => {
                            console.log("n Cars: " + e)
                            setEditingCar(pre => {
                                return { ...pre, nCar: e }
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
                    <Form.Item name="typeCar" label={<h4><b>Type of Car</b></h4>} style={{ width: 400 }}>
                        <Select defaultValue={editingCar?.typeCar} onChange={e => {
                            setEditingCar(pre => {
                                return { ...pre, typeCar: e }
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
                        <InputNumber min={0} value={editingCar?.nDoubleBed} onChange={(e) => {
                            console.log("n DoubleBed: " + e)
                            setEditingCar(pre => {
                                return { ...pre, nDoubleBed: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Single Beds</b></h4>}>
                        <InputNumber min={0} value={editingCar?.nSingleBed} onChange={(e) => {
                            console.log("n SingleBed: " + e)
                            setEditingCar(pre => {
                                return { ...pre, nSingleBed: e }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label={<h4><b>Number of Stars</b></h4>}>
                        <Rate value={editingCar?.nStars} onChange={(e) => {
                            console.log("n Stars: " + e)
                            setEditingCar(pre => {
                                return { ...pre, nStars: e }
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

export default CarTable;