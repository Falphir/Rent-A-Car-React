import { useForm } from "react-hook-form";
import { useParams, Navigate } from 'react-router-dom';
import './ReservesForm.css';
import React, { useState, useEffect } from 'react';
import Config from "../../../../config";
import { Form, Button, Row, Col, DatePicker, Card, message } from "antd";
import logo from '../../../../assets/logo/logo_simples.png'


const ReservesForm = () => {
    const { roomId } = useParams();
    const { register, handleSubmit } = useForm();
    const onSubmit = e => postReserve(onFinish(e));
    const [reserveForm] = Form.useForm();
    const [userLogged, setUserLogged] = useState(true);
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(true);
    var DCI, DCO, userId, userName;


    const postReserve = (data) => {

        fetch('/reserve/reserves/:roomId', {
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
                            {window.location.href = '/dashboard'}
                        </>
                    )

                } else {
                    console.log(response);
                    message.error('An Error Ocurred while reserving room! Try Again Later.');
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
                    localStorage.setItem('idUser', response.decoded[1]);
                    userId = localStorage.getItem('idUser');

                    userName = response.decoded[2];
                    console.log("userId " + response.decoded[1]);
                    console.log("userName " + response.decoded[2]);

                    if (response.decoded[2] == 'user') {

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

    function onChangeDateCheckIn(date, DateCheckIn) {
        console.log("date check in: " + DateCheckIn);
        DCI = DateCheckIn;
    }

    function onChangeDateCheckOut(date, DateCheckOut) {
        console.log("date check out: " + DateCheckOut);
        DCO = DateCheckOut;
    }


    const onFinish = (e) => {

        userId = localStorage.getItem('idUser');

        console.log(e);
        console.log("userID: " + userId);
        console.log("DCI: " + DCI);
        console.log("DCO: " + DCO);
        console.log("roomID: " + roomId);

        return {
            dateCheckIn: DCI,
            dateCheckOut: DCO,
            idUser: userId,
            idRoom: roomId
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
                                                <b>Reserve Room</b>
                                            </h2>
                                        </Row>
                                    </Col>
                                </Row>}
                                bordered={false} style={{ width: 350 }}>
                                <Form layout='vertical' onFinish={onSubmit}>
                                    <Form.Item label={<h4 className='reserves-form-label-h4'><b>Date Check In</b></h4>} name="dateCheckIn">
                                        <Row justify="center">
                                            <DatePicker onChange={onChangeDateCheckIn} style={{ width: 300 }} required />
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label={<h4 className='reserves-form-label-h4'><b>Date Check In</b></h4>} name="dateCheckOut">
                                        <Row justify="center">
                                            <DatePicker onChange={onChangeDateCheckOut} style={{ width: 300 }} required />
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