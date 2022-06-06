import { useForm } from "react-hook-form";
import { useParams, Navigate } from 'react-router-dom';
import './ReservesForm.css';
import React, { useState, useEffect } from 'react';
import Config from "../../../../config";
import { Form, Button, Row, Col, DatePicker, Card, message, Input, Checkbox } from "antd";
import logo from '../../../../assets/logo/logo_simples.png'


const ReservesForm = () => {
    const { carId } = useParams();
    const { register, handleSubmit } = useForm();
    const onSubmit = e => postReserve(onFinish(e));
    const [reserveForm] = Form.useForm();
    const [userLogged, setUserLogged] = useState(true);
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(true);
    const [Handler, setHandler] = useState(false);
    var DPU, DR, userId, userName;

    

    const postReserve = (data) => {

        fetch('/reserve/reserves/:carId', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data)
        })

            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('Reserve Successfully created!');
                    return (
                        <>
                            {response.json()}
                            {window.location.href = '/'}
                        </>
                    )

                } else {
                    {window.location.href = '/'}
                }
            })

            .catch((err) => {
                console.error('Error: ', err);
            });
    }


    useEffect(() => {

        fetch('/auth/me', {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {

                setUserLogged(response.auth);

                if (response.auth == false) {
                    localStorage.removeItem('idUser');
                    console.log("nao pode aceder a esta pagina");
                    setUserLogged(false);  
                } else {
                    localStorage.setItem('idUser', response.decoded.id);
                    userId = localStorage.getItem('idUser');
                    userName = response.decoded.name;

                    userName = response.decoded.name;
                    console.log("userId " + response.decoded.id);
                    console.log("userName " + response.decoded.name);

                    if (response.decoded.role == 'user') {

                        console.log("pode aceder a esta pagina");
                        console.log(userLogged)
                        setUserLogged(true);
                        console.log(userLogged)

                    } else {

                        console.log("nao pode aceder a esta pagina");
                        setUserLogged(false);
                    }
                }
            })

            .catch(() => {
                setUserLogged(false);
            })
    }, [])

    if (!userLogged) {
        return <Navigate to={'/'}></Navigate>
    }

    function onChangeDatePickUp(date, DatePickUp) {
        console.log("date pick up: " + DatePickUp);
        DPU = DatePickUp;
    }

    function onChangeDateReturn(date, DateReturn) {
        console.log("date return: " + DateReturn);
        DR = DateReturn;
    }

    function onChangeDifferentReturnLocation(e) {

        console.log("checked: " + e.target.checked);
        setHandler(e.target.checked)
    }


    const onFinish = (e) => {

        userId = localStorage.getItem('idUser');

        console.log(e);
        console.log("userID: " + userId);
        console.log("userName: " + userName);
        console.log("DPU: " + DPU);
        console.log("DR: " + DR);
        console.log("carID: " + carId);

        console.log("return: " + e.returnlocation)

        if(e.returnlocation == undefined){
            e.returnlocation = e.pickuplocation
            console.log("return: " + e.returnlocation)
        }

        return {
            datePickUp: DPU,
            dateReturn: DR,
            PickUpLocation: e.pickuplocation,
            ReturnLocation: e.returnlocation,
            idUser: userId,
            nameUser: userName,
            idCar: carId
        }
    }


    return (
        <div >
            <Row style={{ paddingTop: 120 }}>
                <Col span={8}></Col>
                <Col span={8}>
                    <Row justify="center">
                        <div >
                            <Card headStyle={{ backgroundColor: "#242424" }} bodyStyle={{ backgroundColor: "#242424" }} className="login-card" title={

                                <Row justify='center'>
                                    <Col>
                                        <div className='card-logo'>
                                            <img className='reserves-Logo' src={logo} />
                                        </div>
                                        <Row justify='center'>
                                            <h2 className='reserves-card-title-h2'>
                                                <b>Reserve Car</b>
                                            </h2>
                                        </Row>
                                    </Col>
                                </Row>}
                                bordered={false} style={{ width: 350 }}>
                                <Form layout='vertical' onFinish={onSubmit}>
                                    <Form.Item label={<h4 className='reserves-form-label-h4'><b>Date Pick Up</b></h4>} name="datePickUp">
                                        <Row justify="center">
                                            <DatePicker format={"DD/MM/YYYY"} onChange={onChangeDatePickUp} style={{ width: 300 }} required />
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label={<h4 className='reserves-form-label-h4'><b>Date Return</b></h4>} name="dateReturn">
                                        <Row justify="center">
                                            <DatePicker format={"DD/MM/YYYY"} onChange={onChangeDateReturn} style={{ width: 300 }} required />
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label={<h4 className='reserves-form-label-h4'><b>Pick-Up Location</b></h4>} name="pickuplocation">
                                        <Row justify="center">
                                            <Input></Input>
                                        </Row>
                                    </Form.Item>
                                    {Handler &&
                                        <Form.Item label={<h4 className='reserves-form-label-h4'><b>Return Location</b></h4>} name="returnlocation">
                                            <Row justify="center">
                                                <Input></Input>
                                            </Row>
                                        </Form.Item>
                                    }

                                    <Form.Item name="differentreturnlocation">
                                        <Row justify="left">
                                            <Checkbox value="" onChange={onChangeDifferentReturnLocation} style={{color: "#fff"}}>
                                                Different Return Location
                                            </Checkbox>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button block className='reserves-Button-Outlined' htmlType='submit'><b>Reserve</b></Button>
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

export default ReservesForm;