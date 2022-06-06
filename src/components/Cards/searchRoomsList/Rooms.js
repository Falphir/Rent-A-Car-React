import './Rooms.css';
import Config from '../../../config';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SearchRoomCard from './SearchRoomsCard';
import { Menu, Dropdown, Button,Layout, Checkbox } from 'antd';
import { DownOutlined, EuroOutlined, UserOutlined, StarOutlined, FilterOutlined, HomeOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Footer from '../../Footer';
import MostRecentSearchRoomsCard from './MostRecentSearchRoomsCard';
import LessStarsSearchRoomsCard from './LessStarsSearchRoomsCard';
import MoreStarsSearchRoomsCard from './MoreStarsSearchRoomsCard';
import LowPriceSearchRoomsCard from './LowPriceSearchRoomsCard';
import HighPriceSearchRoomsCard from './HighPriceSearchRoomsCard';


const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const Rooms = () => {
    const [active, setActive] = useState(true);
    const SetView = (active) => {
        setActive(active);
    };

    const [state, setState] = useState({
        state: {
            collapsed: false
        }
    });


    const toggle = () => {
        setState({
            collapsed: !state.collapsed,
        });
    };
    
    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
    }


    //se n tiver configurado o token no config.js, irá diretamente redirecionar para a homepage
    if (!Config.token) {
        return <Navigate to={'/'}></Navigate>
    }



    const ActiveView = () => {
        switch (active) {
            case 1:
                return <HighPriceSearchRoomsCard />; //highest price

            case 2:
                return <LowPriceSearchRoomsCard />; //lowest price

            case 3:
                return <MoreStarsSearchRoomsCard />; //more stars first

            case 4:
                return <LessStarsSearchRoomsCard />; //less stars first

            case 5:
                return <MostRecentSearchRoomsCard />; //most recent

            case 6:
                return <SearchRoomCard />; //most old

            default:
                return <SearchRoomCard />; //most old
        }
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
                <i class="fas fa-star"></i> Stars (more stars first)
            </Menu.Item>
            <Menu.Item key="4" onClick={() => SetView(4)}>
                <i class="fas fa-star"></i> Stars (less stars first)
            </Menu.Item>
            <Menu.Item key="5" onClick={() => SetView(5)}>
                <i class="fas fa-sort-amount-up"></i> Most Recent
            </Menu.Item>
            <Menu.Item key="6" onClick={() => SetView(6)}>
                <i class="fas fa-sort-amount-down-alt"></i> Most Old
            </Menu.Item>
        </Menu>
    );



    return (

        <div>
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

                        <SubMenu key="sub1" icon={<HomeOutlined />} title="Type Room">
                            <Menu.Item key="1"><Checkbox onChange={onChange}>Apartamento</Checkbox></Menu.Item>
                            <Menu.Item key="2"><Checkbox onChange={onChange}>Quarto</Checkbox></Menu.Item>
                            <Menu.Item key="3"><Checkbox onChange={onChange}>Casa de Férias</Checkbox></Menu.Item>
                            <Menu.Item key="4"><Checkbox onChange={onChange}>Hostel</Checkbox></Menu.Item>
                            <Menu.Item key="5"><Checkbox onChange={onChange}>Casa de Campo</Checkbox></Menu.Item>
                            <Menu.Item key="6"><Checkbox onChange={onChange}>Outro</Checkbox></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<EuroOutlined />} title="Price (per night)">
                            <Menu.Item key="7"><Checkbox onChange={onChange}>0€ - 50€</Checkbox></Menu.Item>
                            <Menu.Item key="8"><Checkbox onChange={onChange}>50€ - 100€</Checkbox></Menu.Item>
                            <Menu.Item key="9"><Checkbox onChange={onChange}>100€ - 150€</Checkbox></Menu.Item>
                            <Menu.Item key="10"><Checkbox onChange={onChange}>150€ - 200€</Checkbox></Menu.Item>
                            <Menu.Item key="11"><Checkbox onChange={onChange}>more than 200€</Checkbox></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<FilterOutlined />} title="Popular filters">
                            <Menu.Item key="12"><Checkbox onChange={onChange}>Car Park</Checkbox></Menu.Item>
                            <Menu.Item key="13"><Checkbox onChange={onChange}>BreakFast</Checkbox></Menu.Item>
                            <Menu.Item key="14"><Checkbox onChange={onChange}>Lunch</Checkbox></Menu.Item>
                            <Menu.Item key="15"><Checkbox onChange={onChange}>Spa</Checkbox></Menu.Item>
                            <Menu.Item key="16"><Checkbox onChange={onChange}>Pool</Checkbox></Menu.Item>
                            <Menu.Item key="17"><Checkbox onChange={onChange}>Vip</Checkbox></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" icon={<StarOutlined />} title="Stars">
                            <Menu.Item key="18"><Checkbox onChange={onChange}>0 stars</Checkbox></Menu.Item>
                            <Menu.Item key="19"><Checkbox onChange={onChange}>1 star</Checkbox></Menu.Item>
                            <Menu.Item key="20"><Checkbox onChange={onChange}>2 stars</Checkbox></Menu.Item>
                            <Menu.Item key="21"><Checkbox onChange={onChange}>3 stars</Checkbox></Menu.Item>
                            <Menu.Item key="22"><Checkbox onChange={onChange}>4 stars</Checkbox></Menu.Item>
                            <Menu.Item key="23"><Checkbox onChange={onChange}>5 stars</Checkbox></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub5" icon={<HomeOutlined />} title="Bed preference">
                            <Menu.Item key="24"><Checkbox onChange={onChange}>Single Bed</Checkbox></Menu.Item>
                            <Menu.Item key="25"><Checkbox onChange={onChange}>Double Bed</Checkbox></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub6" icon={<UserOutlined />} title="Person">
                            <Menu.Item key="26"><Checkbox onChange={onChange}>1 adult</Checkbox></Menu.Item>
                            <Menu.Item key="27"><Checkbox onChange={onChange}>2 adults</Checkbox></Menu.Item>
                            <Menu.Item key="28"><Checkbox onChange={onChange}>1 child</Checkbox></Menu.Item>
                            <Menu.Item key="29"><Checkbox onChange={onChange}>2 children</Checkbox></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>

                <Layout>
                    <Header style={{ backgroundColor: "#f0f2f5", paddingLeft: 16, height: 52 }}>
                        <Button onClick={toggle}>
                            {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                        </Button>
                    </Header>
                    <div className='room-container'>
                        <Dropdown overlay={menu}>
                            <Button> Order by <DownOutlined /></Button>
                        </Dropdown>

                        <p></p>

                        {ActiveView()}
                    </div>
                </Layout>
            </Layout>
            <Footer />
        </div>
        // <div className='room-container'>
        //     <Dropdown overlay={menu}>
        //         <Button> Order by <DownOutlined /></Button>
        //     </Dropdown>

        //     <p></p>

        //     {ActiveView()}
        // </div>
    )
}

export default Rooms;

