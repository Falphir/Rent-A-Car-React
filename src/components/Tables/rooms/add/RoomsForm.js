import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import './RoomsForm.css';
import { Form, Button, Checkbox, Input, Select, Row, Col, Upload, message, Card, InputNumber, Tooltip, Rate } from "antd";
import { storage } from '../../../../firebase';
import logo from '../../../../assets/logo/logo_simples.png'


const { Dragger } = Upload;
const { TextArea } = Input;


const RoomsForm = () => {

    const { register, handleSubmit } = useForm();
    const [checkboxList, setCheckboxList] = useState([{ value: "" }]);
    const { state, setState } = useState({
        selectedFile: null
    });
    const onSubmit = e => postRoom(onFinish(e));
    const [roomForm] = Form.useForm();


    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [submit, setSubmit] = useState();

    const handleChange = e => {
        console.log(e)
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
        
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
                        .then(url => {
                            console.log(url);
                            setUrl(url);
                            if (url = null) {
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

    const postRoom = (data) => {
        fetch('/hotel/rooms', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            timout: 1000,
            body: JSON.stringify(data)
        })

            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('Room Successfully created!');
                    //alert("Room created");
                    return (
                        <>
                            {response.json()}
                            {window.location.href = '/dashboard'}
                        </>
                    )

                } else {

                    console.log(response);
                    message.error('Room Duplicated!');
                    //alert("Room duplicate");
                }
            })

            .catch((err) => {
                console.error('error:', err);
            });
    }


    const buildRooms = (data) => {
        return {
            ...data,
            image: url,
            tags: [
                {
                    typeRoom: data.typeRoom,
                    vip: data.vip,
                    nPool: data.nPool,
                    carPark: data.carPark,
                    breakfast: data.breakfast,
                    lunch: data.lunch,
                    spa: data.spa,
                    nStars: data.nStars,
                    nSingleBed: data.nSingleBed,
                    nDoubleBed: data.nDoubleBed
                }
            ]
        }
    };

    useEffect(() => {
        handleUpload(image);
    }, [image]);

    const onFinish = (e) => {
        console.log(e);

        return {
            image: url,
            description: e.description,
            nAdult: e.nAdults,
            nChild: e.nChildren,
            nRoom: e.nRooms,
            price: e.price,
            typeRoom: e.typeRoom,
            nSingleBed: e.nSingleBed,
            nDoubleBed: e.nDoubleBed,
            nStars: e.nStars,
            extras: e.extras
        }
    }




    return (
        <div >
            <Row style={{ paddingTop: 120 }}>
                <Col span={8}></Col>
                <Col span={8}>
                    <Row justify="center">
                        <div >
                            <Card headStyle={{ backgroundColor: "#242424" }} bodyStyle={{ backgroundColor: "#242424" }} className="rooms-card" title={

                                <Row justify='center'>
                                    <Col>
                                        <div className='card-logo'>
                                            <img className='rooms-Logo' src={logo} />
                                        </div>
                                        <Row justify='center'>
                                            <h2 className='rooms-card-title-h2'>
                                                <b>Add Room</b>
                                            </h2>
                                        </Row>
                                    </Col>
                                </Row>}
                                bordered={false} style={{ width: 600 }}>
                                <Form layout="vertical" onFinish={onSubmit}>
                                    <Form.Item name="description" label={<h4 className='rooms-form-label-h4'><b>Description</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input a description!',
                                            },
                                        ]} >
                                        <TextArea rows={4} placeholder="Description of the room" required />
                                    </Form.Item>
                                    <Form.Item name="nAdults" label={<h4 className='rooms-form-label-h4'><b>Number of Adults</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input the number of adults!',
                                            },
                                        ]} >
                                        <InputNumber min={0} required />
                                    </Form.Item>
                                    <Form.Item name="nChildren" label={<h4 className='rooms-form-label-h4'><b>Number of Childrens</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input the number of childrens!',
                                            },
                                        ]} >
                                        <InputNumber min={0} required />
                                    </Form.Item>
                                    <Form.Item name="nRooms" label={<h4 className='rooms-form-label-h4'><b>Number of Rooms</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input the number of rooms!',
                                            },
                                        ]} >
                                        <InputNumber min={0} required />
                                    </Form.Item>
                                    <Form.Item name="price" label={<h4 className='rooms-form-label-h4'><b>Price</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input a price!',
                                            },
                                        ]} >
                                        <InputNumber addonAfter="€" min={0} required />
                                    </Form.Item>
                                    <Form.Item name="typeRoom" label={<h4 className='rooms-form-label-h4'><b>Type of Room</b></h4>} style={{ width: 400 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please choose a Type of room!',
                                            },
                                        ]}>
                                        <Select placeholder="Type of Room" required>
                                            <Select.Option value="Apartamento" />
                                            <Select.Option value="Quarto" />
                                            <Select.Option value="Casa de Férias" />
                                            <Select.Option value="Hostel" />
                                            <Select.Option value="Casa de Campo" />
                                            <Select.Option value="Outro" />
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="nSingleBed" label={<h4 className='rooms-form-label-h4'><b>Number of Single Beds</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input the number of single Beds!',
                                            },
                                        ]}>
                                        <InputNumber min={0} required />
                                    </Form.Item>
                                    <Form.Item name="nDoubleBed" label={<h4 className='rooms-form-label-h4'><b>Number of Double Beds</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input the number of double beds!',
                                            },
                                        ]}>
                                        <InputNumber min={0} required />
                                    </Form.Item>
                                    <Form.Item name="nStars" label={<h4 className='rooms-form-label-h4'><b>Number of Stars</b></h4>} style={{ width: 175 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please choose the number of stars',
                                            },
                                        ]}>
                                        <Select required>
                                            <Select.Option value={"0"} />
                                            <Select.Option value={"1"} />
                                            <Select.Option value={"2"} />
                                            <Select.Option value={"3"} />
                                            <Select.Option value={"4"} />
                                            <Select.Option value={"5"} />
                                        </Select>
                                    </Form.Item>
                                    <h3 className='rooms-extra-h3'><b>Extras</b></h3>
                                    <Form.Item name="extras">
                                        <Checkbox.Group>
                                            <Row>
                                                <Col>
                                                    <Checkbox value="vip" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        VIP
                                                    </Checkbox>
                                                </Col>
                                                <Col>
                                                    <Checkbox value="carPark" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        Car Park
                                                    </Checkbox>
                                                </Col>
                                                <Col>
                                                    <Checkbox value="breakfast" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        Breakfast
                                                    </Checkbox>
                                                </Col>
                                                <Col>
                                                    <Checkbox value="lunch" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        Lunch
                                                    </Checkbox>
                                                </Col>
                                                <Col>
                                                    <Checkbox value="spa" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        Spa
                                                    </Checkbox>
                                                </Col>
                                                <Col>
                                                    <Checkbox value="pool" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        Pool
                                                    </Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <input style={{ color: '#fff' }} accept=".jpg , .jpeg, .jfif" type="file" onChange={handleChange} />
                                    <Form.Item style={{ paddingTop: 20 }}>
                                        {submit &&
                                            <Button block size="large" className='rooms-Button-Outlined' htmlType="submit">
                                                <b>Submit</b>
                                            </Button>}
                                        {!submit &&
                                            <Tooltip placement="top" title={<span>Image not uploaded</span>}>
                                                <Button disabled block size="large" htmlType="submit">
                                                    <b>Submit</b>
                                                </Button>
                                            </Tooltip>}
                                    </Form.Item>
                                </Form>
                            </Card>
                        </div>
                    </Row>
                </Col>
                <Col span={8}></Col>
            </Row >
        </div >
    );
}


export default RoomsForm;