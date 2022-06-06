import React from 'react'
import '../../App.css'
import RegisterForm from '../../register/RegisterForm'
import { Row, Col } from 'antd'

function Register() {
    return (
        <>
        <div className='register-banner-container'>
            <div className=''>
                <Row justify='center' align='middle'>
                    <Col span={24}>
                    <RegisterForm />
                    </Col>
                </Row>
                
            </div>
            
        </div>
    </>
    )
}

export default Register
