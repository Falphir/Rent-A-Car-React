import './RegisterForm.css';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { Col, Row, Card, Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import logo from '../assets/logo/logo_simples.png'

const RegisterForm = () => {

    const { register, handleSubmit } = useForm();
    const onSubmit = e => postUser(onFinish(e));

    const postUser = (data) => {
        fetch('/auth/user/register', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data)
        })

            .then((response) => {
                if (response.ok) {

                    console.log(response);
                    message.success('User Registered');
                    return (
                        <>
                            {response.json()}
                            {window.location.href = '/login'}
                        </>
                    )
                } else {
                    console.log(response);
                    message.error('User duplicated');
                }
            })

            .catch((err) => {
                console.error('error:', err);
            });
    }

    const onFinish = (e) => {
        console.log(e);
        return {
            name: e.name,
            email: e.email,
            password: e.password,
            role: {
                nameRole: "user",
                scopes: ["read-own-reserves", "create-reserve", "detail-reserve", "create-favorite", "read-own-favorites", "delete-favorite", "create-comment"]
            }
        }
    }


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
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Username' />
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
                                    <Form.Item style={{ marginTop: 10 }}>
                                        <Button className='register-Button-Outlined' size='large' block type='primary' htmlType='submit'> <b>Register</b> </Button>
                                    </Form.Item>
                                    <Row justify='center' style={{ marginTop: -15, marginBottom: -25 }}>
                                        <Form.Item>
                                            <div style={{ color: '#fff' }}>Already have an Account?<Link to='/login'> Sign in!</Link></div>
                                        </Form.Item>
                                    </Row>
                                </Form>
                            </Card>
                        </div>
                    </Row>
                </Col>
                <Col span={8}></Col>
            </Row >
        </div>
    )
}

export default RegisterForm;