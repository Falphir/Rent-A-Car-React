import { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import Users from '../Tables/users/Users';
import Rooms from '../Tables/rooms/Rooms';
import Reserves from '../Tables/reserves/Reserves';
import { Link } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import Footer from '../Footer';


const { Content, Sider } = Layout;

function Dashboard() {

    const [menu, setMenu] = useState(1);
    const [userLogged, setUserLogged] = useState(true);

    useEffect(() => {
        fetch('/auth/me', {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                //se scope do utilizador for == ao scope q tem permissão pra aceder á dashboard, consegue aceder á dashboard

                console.log(response.decoded);

                if (response.auth == false) {
                    console.log("nao pode aceder ao dashboard");
                    setUserLogged(false);                
                }

                if (response.decoded[2] == 'admin') {

                    console.log("pode aceder ao dashboard");
                    setUserLogged(response.decoded);

                } else {

                    console.log("nao pode aceder ao dashboard");
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


    return (
        <>
            <Layout>
                <Layout>
                    <Content style={{ padding: '0 50px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to="/dashboard">Dashboard</Link></Breadcrumb.Item>
                        </Breadcrumb>
                        <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                            <Sider className="site-layout-background" width={200} style={{ marginRight: '10px' }}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    style={{ height: '100%' }}
                                >
                                    <Menu.Item key="1" onClick={() => setMenu(1)}>Users</Menu.Item>
                                    <Menu.Item key="2" onClick={() => setMenu(2)}>Rooms</Menu.Item>
                                    <Menu.Item key="3" onClick={() => setMenu(3)}>Reserves</Menu.Item>
                                </Menu>
                            </Sider>
                            <Content className='content' style={{ padding: '12px 24px', minHeight: 280, background: '#fff' }}>
                                {(() => {
                                    switch (menu) {
                                        case 1: return <Users />;
                                        case 2: return <Rooms />;
                                        case 3: return <Reserves />;
                                        default: return <Users />;
                                    }
                                })()}
                            </Content>
                        </Layout>
                    </Content>
                </Layout>
            </Layout>
            <Footer />
        </>
    )
}

export default Dashboard
