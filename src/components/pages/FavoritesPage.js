import React from 'react'
import MyFavorites from '../Tables/favorites/MyFavorites'
import { Breadcrumb, Layout } from 'antd'
import { Link } from 'react-router-dom'
import Footer from '../Footer'

const { Content } = Layout

function FavoritesPage() {
    return (
        <div>
            <Layout >
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/myfavorites">My Favorites</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </Content>
                <Layout>
                    <div className='room-container'>
                        <MyFavorites />
                    </div>
                </Layout>
            </Layout>
            <Footer />
        </div>
    )
}

export default FavoritesPage
