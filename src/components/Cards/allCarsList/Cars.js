import './Cars.css';
import Config from '../../../config';
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import CarsCard from './CarsCard';
import LowPriceCarsCard from './LowPriceCarsCard';
import HighPriceCarsCard from './HighPriceCarsCard';
import MostRecentCarsCard from './MostRecentCarsCard';
import { Layout, Menu, Dropdown, Button, Checkbox, Breadcrumb } from 'antd';
import { DownOutlined, EuroOutlined, UserOutlined, CarOutlined, PaperClipOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Footer from '../../Footer';
import IconTransmission from '../../IconTransmission';

const { SubMenu } = Menu;

const { Content, Header, Sider } = Layout;


const Cars = () => {
    const [active, setActive] = useState(true);
    const SetView = (active) => {
        setActive(active);
    };
    const [state, setState] = useState({
        state: {
            collapsed: false
        }
    });


    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
    }



    const ActiveView = () => {
        switch (active) {
            case 1:
                return <HighPriceCarsCard />; //highest price

            case 2:
                return <LowPriceCarsCard />; //lowest price

            case 3:
                return <MostRecentCarsCard />; //most recent

            case 4:
                return <CarsCard />; //most old

            default:
                return <CarsCard />; //most old
        }
    };

    //se n tiver configurado o token no config.js, irá diretamente redirecionar para a homepage
    if (!Config.token) {
        return <Navigate to={'/'}></Navigate>
    }

    const toggle = () => {
        setState({
            collapsed: !state.collapsed,
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => SetView(1)}>
                <i class="fas fa-sort-amount-up"></i> Highest Price
            </Menu.Item>
            <Menu.Item key="2" onClick={() => SetView(2)}>
                <i class="fas fa-sort-amount-down-alt"></i> Lowest Price
            </Menu.Item>
            <Menu.Item key="3" onClick={() => SetView(3)}>
                <i class="fas fa-sort-amount-up"></i> Most Recent
            </Menu.Item>
            <Menu.Item key="4" onClick={() => SetView(4)}>
                <i class="fas fa-sort-amount-down-alt"></i> Most Old
            </Menu.Item>
        </Menu>
    );





    return (
        <div>
            <Layout>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/carsList">Cars</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </Content>
                <Layout >

                    <Sider
                        className="site-layout-background"
                        trigger={null}
                        collapsible
                        collapsed={state.collapsed}
                        width={200}
                        style={{
                            marginLeft: 16,
                            marginTop: 16,
                            marginBottom: 16,
                            overflow: "auto",
                            position: "sticky",
                            top: 0,
                            left: 0,
                        }}
                    >
                        <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} style={{ height: '100%' }} >

                            <SubMenu key="sub1" icon={<CarOutlined />} title="Car Category">
                                <Menu.Item key="1"><Checkbox onChange={onChange}>Small</Checkbox></Menu.Item>
                                <Menu.Item key="2"><Checkbox onChange={onChange}>Medium</Checkbox></Menu.Item>
                                <Menu.Item key="3"><Checkbox onChange={onChange}>Large</Checkbox></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<CarOutlined />} title="Transmission">
                                <Menu.Item key="4"><Checkbox onChange={onChange}>Manual</Checkbox></Menu.Item>
                                <Menu.Item key="5"><Checkbox onChange={onChange}>Automatic</Checkbox></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<EuroOutlined />} title="Price (per day)">
                                <Menu.Item key="6"><Checkbox onChange={onChange}>0€ - 50€</Checkbox></Menu.Item>
                                <Menu.Item key="7"><Checkbox onChange={onChange}>50€ - 100€</Checkbox></Menu.Item>
                                <Menu.Item key="8"><Checkbox onChange={onChange}>100€ - 150€</Checkbox></Menu.Item>
                                <Menu.Item key="9"><Checkbox onChange={onChange}>150€ - 200€</Checkbox></Menu.Item>
                                <Menu.Item key="10"><Checkbox onChange={onChange}>more than 200€</Checkbox></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub4" icon={<UserOutlined />} title="Seats">
                                <Menu.Item key="11"><Checkbox onChange={onChange}>2 seats</Checkbox></Menu.Item>
                                <Menu.Item key="12"><Checkbox onChange={onChange}>5 seats</Checkbox></Menu.Item>
                                <Menu.Item key="13"><Checkbox onChange={onChange}>7 seats</Checkbox></Menu.Item>
                                <Menu.Item key="14"><Checkbox onChange={onChange}>9 seats</Checkbox></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub5" icon={<PaperClipOutlined />} title="Extras">
                                <Menu.Item key="15"><Checkbox onChange={onChange}>GPS</Checkbox></Menu.Item>
                                <Menu.Item key="16"><Checkbox onChange={onChange}>Baby Seat</Checkbox></Menu.Item>
                                <Menu.Item key="17"><Checkbox onChange={onChange}>Aditional Driver</Checkbox></Menu.Item>
                                <Menu.Item key="18"><Checkbox onChange={onChange}>Booster Seat</Checkbox></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Layout>
                        <Header style={{ backgroundColor: "#f0f2f5", paddingLeft: 16, height: 52 }}>
                            <Button onClick={toggle}>
                                {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                            </Button>
                        </Header>
                        <div className='car-container'>
                            <Dropdown overlay={menu}>
                                <Button> Order by <DownOutlined /></Button>
                            </Dropdown>

                            <p></p>

                            {ActiveView()}
                        </div>
                    </Layout>
                </Layout>
            </Layout>
            <Footer />
        </div>
    )
}

export default Cars;