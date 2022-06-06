import { Table } from 'antd';
import { useState, useEffect } from 'react';
import './ReserveTable.css';
import { SelectOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { Modal, List } from 'antd';
import ReserveRoom from './ReserveRoom'


function useWindowSize() {
    // Initialize state with undefined width so server and client renders match
    const [windowSize, setWindowSize] = useState({
        width: undefined,
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
            });
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

const MyReserves = (props) => {

    const Size = useWindowSize();
    const [loading, setLoading] = useState();
    const [userLogged, setUserLogged] = useState(true);
    const [data, setData] = useState({
        reserves: [],
        rooms: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    });
    let idUser, nameUser, currentID, IDROOM;



    useEffect(() => {

        fetchApi(data.pagination.pageSize, data.pagination.current);


        fetch('/auth/me', {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {


                if (response.auth == false) {
                    localStorage.removeItem('idUser');
                    console.log("nao pode aceder ao My Reserves");
                    setUserLogged(false);  
                } else {
                    localStorage.setItem('idUser', response.decoded[1]);

                    idUser = response.decoded[1];

                    nameUser = response.decoded[2];

                    if (response.decoded[2] == 'user') {

                        console.log("pode aceder ao My Reserves");
                        console.log(userLogged)
                        setUserLogged(true);
                        console.log(userLogged)
    
                    } else {
    
                        console.log("nao pode aceder ao My Reserves");
                        setUserLogged(false);
                    }
    
                }
                //console.log("idUser " + response.decoded[1]);
                //console.log("nameUser " + response.decoded[2]);
            })

            .catch(() => {
                setUserLogged(false);
            })

        return () => setData({
            reserves: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        });

    }, []);



    const columns = [
        {
            title: 'Date Check In',
            dataIndex: 'dateCheckIn',
        },
        {
            title: 'Date Check Out',
            dataIndex: 'dateCheckOut',
        },
        /* {
            title: 'ID Room',
            dataIndex: 'idRoom',
        }, */
        {
            title: 'Room',
            render: (record) => {
                return <>
                    <Link to={`/rooms/${record.idRoom}`}>
                        <SelectOutlined style={{ color: "blue", marginLeft: 12 }} />
                    </Link>

                </>
            }
        }
    ];


    const fetchApi = (pageSize, current) => {

        currentID = localStorage.getItem('idUser');

        //console.log("FETCHAPI idUser " + currentID);

        const url = '/reserve/user/reserves/' + currentID + '?' + new URLSearchParams({
            limit: pageSize,
            skip: current - 1
        })


        fetch(url, {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                const { auth, reserves = [], pagination } = response;

                console.log(response);
                    if (response.reserves[0] != null) {
                        IDROOM = response.reserves[0].idRoom;
                        console.log(IDROOM);
                    }
    
                    fetch('/hotel/rooms/' + IDROOM)
    
                    if (auth) {
                        setLoading(false);
                        setData({
                            reserves,
                            pagination: {
                                current: pagination.page + 1 || 1,
                                pageSize: pagination.pageSize || 10,
                                total: pagination.total || 5
                            }
                        })
                    }
            })
            .catch(() => {
                console.log("An Error Occurred!")
            })
    }

    if (!userLogged) {
        return <Navigate to={'/'}></Navigate>
    }

    var ncolumn = 5

    if (Size.width < 768) {
        ncolumn = 1
    } else if (Size.width >= 768 && Size.width < 992) {
        ncolumn = 2
    } else if (Size.width >= 992 && Size.width < 1200) {
        ncolumn = 3
    } else if (Size.width >= 1200 && Size.width <= 1920) {
        ncolumn = 4
    } else if (Size.width > 1920) {
        ncolumn = 5
    }


    const handleTableChange = (pagination) => {
        fetchApi(pagination.pageSize, pagination.current)
    };

    const { reserves, pagination } = data;

    console.log(reserves[0])

    return (
        <>
            <List
                grid={{ gutter: 16, column: ncolumn }} pagination={pagination} rowKey={record => record._id} loading={loading}
                dataSource={reserves}
                renderItem={item => (
                    <List.Item><ReserveRoom checkIn={item.dateCheckIn} checkOut={item.dateCheckOut} RoomId={item.idRoom} /></List.Item>
                )}
            />
            {/* <Table
            columns={columns}
            rowKey={record => record._id}
            dataSource={reserves}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
        /> */}
        </>
    )
}

export default MyReserves;