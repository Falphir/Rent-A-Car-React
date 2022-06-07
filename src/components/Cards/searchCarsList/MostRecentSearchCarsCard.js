import './SearchCarsCard.css';
import React, { useState, useEffect } from 'react';
import { List, Card, Col, Row } from 'antd';
import { Link, useParams } from 'react-router-dom'
import { UserOutlined, CarOutlined } from '@ant-design/icons';
import IconTransmission from '../../IconTransmission';
const { Meta } = Card;

function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
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

const MostRecentSearchCarsCard = (props) => {

    const Size = useWindowSize();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        cars: [],
        pagination: {
            current: 1,
            pageSize: 20,
            total: 0
        }
    });

    const { description } = useParams();



    const fetchApi = (pageSize, current) => {
        const url = '/rent-a-car/cars/' + description + '/mostrecent?' + new URLSearchParams({
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


    const { cars, pagination } = data;

    var ncolumn = 5
    
    if (Size.width < 650) {
        ncolumn = 1
    } else if (Size.width >= 650 && Size.width < 860) {
        ncolumn = 2
    } else if (Size.width >= 860 && Size.width < 1200) {
        ncolumn = 3
    } else if (Size.width >= 1200 && Size.width < 1920) {
        ncolumn = 4
    } else if (Size.width >= 1920) {
        ncolumn = 5
    }

    return (
        <List grid={{ gutter: 16, column: ncolumn }} dataSource={cars} pagination={pagination} rowKey={record => record._id} loading={loading}
            renderItem={item => (
                <List.Item>
                    <Link to={`/cars/${item._id}`}>
                        <Card className='card' key={item._id} cover={<img alt="example" src={item.image} />}>
                            <Meta
                                title={<span style={{ fontWeight: 'bold' }}>{item.description}</span>}>
                            </Meta>

                            <p></p>

                            <div className="additional">
                                <Row justify='center'>
                                    <Col flex="auto">
                                        <UserOutlined /> <span> {item.seats}</span>
                                    </Col>

                                    <Col flex="auto">
                                        <IconTransmission/> <span> {item.typeTransmission}</span>
                                    </Col>

                                    <Col flex="auto">
                                        <CarOutlined /> {item.carCategory}
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
        </List>
    )
}

export default MostRecentSearchCarsCard;