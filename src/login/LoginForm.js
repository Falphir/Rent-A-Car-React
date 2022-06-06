import './LoginForm.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { Col, Row, Card, Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import logo from '../assets/logo/logo_simples.png'

const LoginForm = () => {

    const { register, handleSubmit } = useForm();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const onSubmit = data => login(data);

    const login = (data) => {
        fetch('/auth/admin/login', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data)
        })

            .then(r => r.json())

            .then((response) => {
                console.log(response);

                if (response.auth) {
                    window.location.href = '/'
                    message.success('Loged In Sucessfuly');
                    setLoginSuccess(true);

                } else {
                    message.error('Name or password Incorrect');
                    //alert('login errado');
                }
            })

            .catch((err) => {
                console.error('error: ', err);
            });
    }




    // if (loginSuccess) { 
    //     return <Navigate to='/' />
    // }


    return (
        <div>
            <Row style={{ paddingTop: 120 }}>
                <Col span={8}></Col>
                <Col span={8}>
                    <Row justify="center">
                        <div >
                            <Card headStyle={{ backgroundColor: "#242424" }} bodyStyle={{ backgroundColor: "#242424" }} className="login-card" title={

                                <Row justify='center'>
                                    <Col>
                                        <div className='card-logo'>
                                            <img className='login-Logo' src={logo} />
                                        </div>
                                        <Row justify='center'>
                                            <h2 className='login-card-title-h2'>
                                                <b>SIGN IN</b>
                                            </h2>
                                        </Row>
                                    </Col>
                                </Row>}
                                bordered={false} style={{ width: 450 }}>

                                <Form layout='vertical' onFinish={onSubmit}>
                                    <Form.Item name="name" label={<h4 className='login-form-label-h4'><b>Username</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your username!',
                                            },
                                        ]} >
                                        <Input prefix={<UserOutlined />} placeholder='Username' required />
                                    </Form.Item>
                                    <Form.Item name="password" label={<h4 className='login-form-label-h4'><b>Password</b></h4>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                        ]}>
                                        <Input.Password prefix={<LockOutlined />} placeholder='Password' required />
                                    </Form.Item>
                                    <Form.Item>
                                        <Form.Item>
                                            <Row justify='start' style={{ marginTop: -20 }}>
                                                <Checkbox value="lsRememberMe" style={{ color: '#fff' }}> Remember Me</Checkbox>
                                            </Row>
                                            <Row justify='end' style={{ marginTop: -20 }}>
                                                <Link to='/' >Forgot your password?</Link>
                                            </Row>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item style={{ marginTop: -40 }} t>
                                        <Button className='login-Button-Outlined' size='large' block htmlType='submit'> <b>Login</b> </Button>
                                    </Form.Item>

                                    <Row justify='center' style={{ marginTop: -15, marginBottom: -30 }}>
                                        <Form.Item>
                                            <div style={{ color: '#fff' }}>Don't Have an Account?<Link to='/register' > Sign Up!</Link></div>
                                        </Form.Item>
                                    </Row>
                                </Form>
                            </Card>
                        </div>
                    </Row >
                </Col >
                <Col span={8}></Col>
            </Row >
        </div >
    )
}

export default LoginForm;