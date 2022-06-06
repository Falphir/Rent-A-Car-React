import './AdminRegisterForm.css';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { Col, Row, Card, Form, Input, Button, Checkbox, Radio, message, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import logo from '../../assets/logo/logo_simples.png'

const RegisterForm = () => {

    const { register, handleSubmit } = useForm();
    const onSubmit = e => postUser(onFinish(e));
    const [radio, setRadio] = useState({
        value: undefined
    });
    const [scopes, setScopes] = useState()
    const [userLogged, setUserLogged] = useState(true);

    const postUser = (data) => {
        fetch('/auth/user/register', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data),
            timeout: 5000
        })

            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('User Registered');
                    //alert("User created");
                    return <>
                        {response.json()}
                        {window.location.href = '/dashboard'}
                        {/* {setScopes([])} */}
                    </>

                } else {

                    console.log(response);
                    message.error('User duplicated');
                    //alert("User duplicate");
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
                //se scope do utilizador for == ao scope q tem permissão pra aceder á dashboard, consegue aceder á dashboard

                console.log(response.decoded);

                if (response.decoded[2] == 'admin') {

                    console.log("pode aceder a este register");
                    setUserLogged(response.decoded);
                } else {

                    console.log("nao pode aceder a este register");
                    setUserLogged(false);
                }

            })

            .catch(() => {
                setUserLogged(false);
            })
    }, [])

    if (!userLogged) {
        return <Navigate to={'/'}></Navigate>
    }

    // const buildUsers = (data) => {
    //     console.log(data);
    //     return {
    //         ...data, role: {
    //             nameRole: data.nameRole,
    //             scopes: ["read-own-reserves", "create-reserve", "detail-reserve"]
    //         }
    //     }
    // };

    const onFinish = (e) => {
        console.log(e);

        if (radio.value == 'user') {
            return {
                name: e.name,
                email: e.email,
                password: e.password,
                role: {
                    nameRole: radio.value,
                    scopes: ["read-own-reserves", "create-reserve", "detail-reserve", "create-favorite", "read-own-favorites", "delete-favorite", "create-comment"]
                }
            }
        } else if (radio.value == 'editor') {
            return {
                name: e.name,
                email: e.email,
                password: e.password,
                role: {
                    nameRole: radio.value,
                    scopes: ["create-reserve", "detail-reserve", "update-reserve", "read-reserves", "delete-reserve", "create-room", "update-room", "read-reserve-client", "delete-room"]
                }
            }
        } else if (radio.value == 'admin') {
            return {
                name: e.name,
                email: e.email,
                password: e.password,
                role: {
                    nameRole: radio.value,
                    scopes: ["create-reserve", "detail-reserve", "update-reserve", "read-reserves", "delete-reserve", "create-room", "update-room", "read-reserve-client", "delete-room", "read-users", "delete-user"]
                }
            }
        }
    }

    const onChange = e => {
        console.log('radio checked', e.target.value);
        setRadio({
            value: e.target.value,
        });
    };


    return (
        <div>
            <Row style={{ paddingTop: 120 }}>
                <Col span={8}></Col>
                <Col span={8}>
                    <Row justify="center">
                        <div className="site-card-border-less-wrapper">
                            <Card headStyle={{ backgroundColor: "#242424" }} bodyStyle={{ backgroundColor: "#242424" }} className="login-card" title={
                                <Row justify='center'>
                                    <Col>
                                        <div className='card-logo'>
                                            <img className='register-Logo' src={logo} />
                                        </div>
                                        <Row justify='center'>
                                            <h2 className='register-card-title-h2'>
                                                <b>SIGN UP</b>
                                            </h2>
                                        </Row>
                                    </Col>
                                </Row>} bordered={false} style={{ width: 450 }}>
                                <Form layout='vertical' onFinish={onSubmit}>
                                    <Form.Item name="name" rules={[
                                        {
                                            required: true,
                                            message: 'Please input your username!',
                                        },
                                    ]} label={<h4 className='register-form-label-h4'><b>Username</b></h4>} >
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Username' required/>
                                    </Form.Item>
                                    <Form.Item name="email" rules={[
                                        {
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        },
                                        {
                                            required: true,
                                            message: 'Please input your E-mail!',
                                        },
                                    ]}
                                        label={<h4 className='register-form-label-h4'><b>Email</b></h4>}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder='Email' required />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label={<h4 className='register-form-label-h4'><b>Password</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder='Password' required />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirm"
                                        label={<h4 className='register-form-label-h4'><b>Confirm Password</b></h4>}
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your password!',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder='Confirm Password' required />
                                    </Form.Item>
                                    <Form.Item>
                                        <Row justify='center'>
                                            <Radio.Group onChange={onChange} value={radio.value}>
                                                <Radio value='user' style={{ color: '#fff' }}>User</Radio>
                                                <Radio value='editor' style={{ color: '#fff' }}>Editor</Radio>
                                                <Radio value='admin' style={{ color: '#fff' }}>Admin</Radio>
                                            </Radio.Group>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item style={{ marginTop: 10 }}>
                                        <Button className='register-Button-Outlined' size='large' block type='primary' htmlType='submit'> <b>Register</b> </Button>
                                    </Form.Item>
                                    <Row justify='center' style={{ marginTop: -15, marginBottom: -25 }}>
                                        <Form.Item>
                                            <div style={{ color: '#fff' }}>Already have an Account?<Link to='/login'> Sign in!</Link></div>
                                        </Form.Item>
                                    </Row>
                                </Form>

                                {/* <form className='form-login' onSubmit={handleSubmit(onSubmit)}>
                                    <div className='field'>
                                        <label>Name: </label>
                                        <input {...register('name')}></input>
                                    </div>

                                    <div className='field'>
                                        <label>Password: </label>
                                        <input {...register('password')} type='password'></input>
                                    </div>

                                    <input className='submit' type='submit'></input>
                                </form> */}
                            </Card>
                        </div>
                    </Row>
                </Col>
                <Col span={8}></Col>
            </Row >

            {/* <h2>Register Form</h2>

            <form className='form-register' onSubmit={handleSubmit(onSubmit)}>
                <div className='field'>
                    <label>Name: </label>
                    <input {...register('name')}></input>
                </div>

                <div className='field'>
                    <label>Email: </label>
                    <input {...register('email')}></input>
                </div>

                <div className='field'>
                    <label>Password: </label>
                    <input {...register('password')} type='password'></input>
                </div>

                <div className='field'>
                    <label>Role: </label>
                    <select {...register('nameRole')}>
                        <option value="user">User</option>
                    </select>
                </div>

                <div className='field'>
                    <label>Permission: </label>
                    <select {...register('scopes')}>
                        <option>User</option>
                    </select>
                </div>


                <input className='submit' type='submit'></input>
            </form> */}
        </div>
    )
}

export default RegisterForm;