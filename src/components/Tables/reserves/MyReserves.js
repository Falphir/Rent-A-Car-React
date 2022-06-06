import { Table } from 'antd';
import { useState, useEffect } from 'react';
import './ReserveTable.css';
import { SelectOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { Modal, List } from 'antd';
import ReserveCar from './ReserveCar'


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
        cars: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    });
    let idUser, nameUser, currentID, IDCAR;



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
                    localStorage.setItem('idUser', response.decoded.id);

                    idUser = response.decoded.id;

                    nameUser = response.decoded.name;

                    if (response.decoded.role == 'user') {

                        console.log("pode aceder ao My Reserves");
                        console.log(userLogged)
                        setUserLogged(true);
                        console.log(userLogged)
    
                    } else {
    
                        console.log("nao pode aceder ao My Reserves");
                        setUserLogged(false);
                    }
    
                }
                //console.log("idUser " + response.decoded.id);
                //console.log("nameUser " + response.decoded.name);
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
            title: 'Date Pick Up',
            dataIndex: 'datePickUp',
        },
        {
            title: 'Date Return',
            dataIndex: 'dateReturn',
        },
        /* {
            title: 'ID Car',
            dataIndex: 'idCar',
        }, */
        {
            title: 'Car',
            render: (record) => {
                return <>
                    <Link to={`/cars/${record.idCar}`}>
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
                        IDCAR = response.reserves[0].idCar;
                        console.log(IDCAR);
                    }
    
                    fetch('/rent-a-car/cars/' + IDCAR)
    
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
    } else if (Size.width >= 1200) {
        ncolumn = 4
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
                    <List.Item><ReserveCar checkIn={item.datePickUp} checkOut={item.dateReturn} CarId={item.idCar} /></List.Item>
                )}
            />
        </>
    )
}

export default MyReserves;