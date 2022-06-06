import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import './CarsForm.css';
import { Form, Button, Checkbox, Input, Select, Row, Col, Upload, message, Card, InputNumber, Tooltip, Rate } from "antd";
import { storage } from '../../../../firebase';
import logo from '../../../../assets/logo/logo_simples.png'


const { Dragger } = Upload;
const { TextArea } = Input;


const CarsForm = () => {

    const { register, handleSubmit } = useForm();
    const [checkboxList, setCheckboxList] = useState([{ value: "" }]);
    const { state, setState } = useState({
        selectedFile: null
    });
    const onSubmit = e => postCar(onFinish(e));
    const [carForm] = Form.useForm();


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

    const postCar = (data) => {
        fetch('/rent-a-car/cars', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            timout: 1000,
            body: JSON.stringify(data)
        })

            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('Car Successfully created!');
                    //alert("Car created");
                    return (
                        <>
                            {response.json()}
                            {window.location.href = '/dashboard'}
                        </>
                    )

                } else {

                    console.log(response);
                    message.error('Car Duplicated!');
                    //alert("Car duplicate");
                }
            })

            .catch((err) => {
                console.error('error:', err);
            });
    }

    useEffect(() => {
        handleUpload(image);
    }, [image]);

    const onFinish = (e) => {
        console.log(e);

        return {
            image: url,
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




    return (
        <div>
            <Row style={{ paddingTop: 120 }}>
                <Col span={8}></Col>
                <Col span={8}>
                    <Row justify="center">
                        <div >
                            <Card headStyle={{ backgroundColor: "#242424" }} bodyStyle={{ backgroundColor: "#242424" }} className="cars-card" title={
                                <Row justify='center'>
                                    <Col>
                                        <div className='card-logo'>
                                            <img className='cars-Logo' src={logo} />
                                        </div>
                                        <Row justify='center'>
                                            <h2 className='cars-card-title-h2'>
                                                <b>Add Car</b>
                                            </h2>
                                        </Row>
                                    </Col>
                                </Row>}
                                bordered={false} style={{ width: 600 }}>
                                <Form layout="vertical" onFinish={onSubmit}>
                                    <Form.Item name="title" label={<h4 className='cars-form-label-h4'><b>Title</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input a title!',
                                            },
                                        ]} >
                                        <Input placeholder="title of the car" required />
                                    </Form.Item>
                                    <Form.Item name="description" label={<h4 className='cars-form-label-h4'><b>Description</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input a description!',
                                            },
                                        ]} >
                                        <TextArea rows={4} placeholder="Description of the car" required />
                                    </Form.Item>
                                    <Form.Item name="seats" label={<h4 className='cars-form-label-h4'><b>Number of Seats</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input the number of seats!',
                                            },
                                        ]} >
                                        <InputNumber min={1} required />
                                    </Form.Item>
                                    <Form.Item name="kilometers" label={<h4 className='cars-form-label-h4'><b>Kilometers</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input the Kilometers!',
                                            },
                                        ]} >
                                        <InputNumber min={0} required />
                                    </Form.Item>
                                    <Form.Item name="price" label={<h4 className='cars-form-label-h4'><b>Price</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input a price!',
                                            },
                                        ]} >
                                        <InputNumber addonAfter="€" min={0} required />
                                    </Form.Item>
                                    <Form.Item name="typeTransmission" label={<h4 className='cars-form-label-h4'><b>Type of Transmission</b></h4>} style={{ width: 400 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please choose a Type of transmission!',
                                            },
                                        ]}>
                                        <Select placeholder="Type of Transmission" required>
                                            <Select.Option value="Manual" />
                                            <Select.Option value="Automatic" />
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="carCategory" label={<h4 className='cars-form-label-h4'><b>Car Category</b></h4>} style={{ width: 400 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please choose the car category!',
                                            },
                                        ]}>
                                        <Select placeholder="Car Category" required>
                                            <Select.Option value="Small" />
                                            <Select.Option value="Medium" />
                                            <Select.Option value="Large" />
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="location" label={<h4 className='cars-form-label-h4'><b>Location</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input the location!',
                                            },
                                        ]}>
                                        <Input placeholder="location" required />
                                    </Form.Item>
                                    <h3 className='cars-extra-h3'><b>Extras</b></h3>
                                    <Form.Item name="extras">
                                        <Checkbox.Group>
                                            <Row>
                                                <Col>
                                                    <Checkbox value="gps" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        GPS
                                                    </Checkbox>
                                                </Col>
                                                <Col>
                                                    <Checkbox value="babySeat" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        Baby Seat
                                                    </Checkbox>
                                                </Col>
                                                <Col>
                                                    <Checkbox value="aditionalDriver" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        Aditional Driver
                                                    </Checkbox>
                                                </Col>
                                                <Col>
                                                    <Checkbox value="boosterSeat" style={{ lineHeight: '32px', color: '#fff' }}>
                                                        Booster Seat
                                                    </Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <input style={{ color: '#fff' }} accept=".jpg , .jpeg, .jfif" type="file" onChange={handleChange} placeholder="1920x1080" />
                                    <Form.Item style={{ paddingTop: 20 }}>
                                        {submit &&
                                            <Button block size="large" className='cars-Button-Outlined' htmlType="submit">
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


export default CarsForm;