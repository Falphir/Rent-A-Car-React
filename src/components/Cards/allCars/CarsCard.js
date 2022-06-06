import './CarsCard.css';
import React, { useState, useEffect } from 'react';
import { List, Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom'
import noImage from '../../../assets/images/Car-Unavailable1.jpg';
import transmission from '../../../assets/transmission.svg';
import { UserOutlined } from '@ant-design/icons';


const { Meta } = Card;


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

const CarsCard = (props) => {

    const Size = useWindowSize();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        cars: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    });



    const fetchApi = (pageSize, current) => {
        const url = '/rent-a-car/cars?' + new URLSearchParams({
            limit: pageSize,
            skip: current - 1
        })


        fetch(url, {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                const { auth, cars = [], pagination } = response;


                if (auth) {
                    setLoading(false);
                    setData({
                        cars,
                        pagination: {
                            current: pagination.page + 1 || 1,
                            pageSize: pagination.pageSize || 10,
                            total: pagination.total || 5
                        }
                    })
                }
            });
    }


    useEffect(() => {
        fetchApi(data.pagination.pageSize, data.pagination.current);

        return () => setData({
            cars: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        });
    }, []);


    const { cars } = data;

    var ncolumn = 5

    if (Size.width < 576) {
        ncolumn = 1
    } else if (Size.width >= 576 && Size.width < 768) {
        ncolumn = 2
    } else if (Size.width >= 768 && Size.width < 992) {
        ncolumn = 3
    } else if (Size.width >= 992 ) {
        ncolumn = 4
    }

    console.log(data)

    return (
        <List grid={{ gutter: 16, column: ncolumn }} dataSource={cars} rowKey={record => record._id} loading={loading}
            renderItem={item => (
                <List.Item>
                    <Link to={`/cars/${item._id}`}>
                        <Card className='card' key={item._id} cover={<img className='card-img' alt="example" src={item.image} />}>
                            <Meta
                                title={<span style={{ fontWeight: 'bold' }}>{item.title}</span>}>
                            </Meta>
                            
                            <p></p>

                            <div className="additional">
                                <Row justify='center'>
                                    <Col flex="auto">
                                        {item.seats} <UserOutlined />
                                    </Col>

                                    <Col flex="auto">
                                        {item.nAdult} <i src=""></i>
                                    </Col>

                                    <Col flex="auto">
                                        {item.nChild} <i class="fas fa-child"></i>
                                    </Col>

                                    <Col flex="auto">
                                        {item.price} <i class="fas fa-euro-sign"></i>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Link>
                </List.Item>
            )}>
            <p></p>
        </List>
    )
}

export default CarsCard;