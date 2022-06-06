import React from 'react'
import { Breadcrumb, Layout } from 'antd'
import { Link } from 'react-router-dom'
import Footer from '../Footer'
import MyReserves from '../Tables/reserves/MyReserves'

const { Content } = Layout

function MyReservesPage() {
    return (
        <div>
            <Layout >
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/myreserves">My Reserves</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </Content>
                <Layout>
                    <div className='room-container'>
                        <MyReserves />
                    </div>
                </Layout>
            </Layout>
            <Footer />
        </div>
    )
}

export default MyReservesPage
