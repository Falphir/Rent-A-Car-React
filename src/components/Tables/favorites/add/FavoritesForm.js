import { useForm } from "react-hook-form";
import { useParams, Navigate } from 'react-router-dom';
import './FavoritesForm.css';
import React, { useState, useEffect } from 'react';
import Config from "../../../../config";
import { Form, Button, Row, Col, DatePicker, Card, message } from "antd";
import logo from '../../../../assets/logo/logo_simples.png'

const FavoritesForm = () => {

    const { roomId } = useParams();
    const { register, handleSubmit } = useForm();
    const onSubmit = e => postFavorite(onFinish(e));
    const [favoriteForm] = Form.useForm();
    const [userLogged, setUserLogged] = useState(true);
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(true);
    var userId, userName;


    const postFavorite = (data) => {

        fetch('/favorite/favorites/:roomId', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data)
        })

            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('Favorite Successfully created!');
                    return (
                        <>
                            {response.json()}
                            {window.location.href = '/dashboard'}
                        </>
                    )

                } else {
                    console.log(response);
                    message.error('An Error Ocurred while favoriting room! Try Again Later.');
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

    const onFinish = (e) => {

        userId = localStorage.getItem('idUser');

        console.log(e);
        console.log("userID: " + userId);
        console.log("roomID: " + roomId);

        return {
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
                                                <b>Favorite Room</b>
                                            </h2>
                                        </Row>
                                    </Col>
                                </Row>}
                                bordered={false} style={{ width: 350 }}>
                                <Form layout='vertical' onFinish={onSubmit}>
                                    <Form.Item label={<h4 className='reserves-form-label-h4'><b>Are you sure you want to favorite this room?</b></h4>}>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button block className='reserves-Button-Outlined' htmlType='submit'><b>Favorite</b></Button>
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

export default FavoritesForm;