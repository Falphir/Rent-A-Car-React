import './RoomsCard.css';
import React, { useState, useEffect } from 'react';
import { List, Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom'


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

const RoomsCard = (props) => {

    const Size = useWindowSize();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        rooms: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    });



    const columns = [
        { title: 'Description', value: 'description', },
        { title: 'Nº Adults', value: 'nAdult', },
        { title: 'Nº Children', value: 'nChild', },
        { title: 'Nº Rooms', value: 'nRoom', },
        { title: 'Price (€)', value: 'price', },
        { title: 'Nº Stars', value: 'nStars', }
    ];


    const fetchApi = (pageSize, current) => {
        const url = '/hotel/rooms?' + new URLSearchParams({
            limit: pageSize,
            skip: current - 1
        })


        fetch(url, {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                const { auth, rooms = [], pagination } = response;


                if (auth) {
                    setLoading(false);
                    setData({
                        rooms,
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
            rooms: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        });
    }, []);


    const { rooms } = data;

    var ncolumn = 5

    if (Size.width < 576) {
        ncolumn = 1
    } else if (Size.width >= 576 && Size.width < 768) {
        ncolumn = 2
    } else if (Size.width >= 768 && Size.width < 992) {
        ncolumn = 3
    } else if (Size.width >= 992 && Size.width < 1200) {
        ncolumn = 4
    } else if (Size.width >= 1200) {
        ncolumn = 5
    }

    return (
        <List grid={{ gutter: 16, column: ncolumn }} dataSource={rooms} rowKey={record => record._id} loading={loading}
            renderItem={item => (
                <List.Item>
                    <Link to={`/rooms/${item._id}`}>
                        <Card className='card' key={item._id} cover={<img className='card-img' alt="example" src={item.image} />}>
                            <Meta
                                title={<span style={{ fontWeight: 'bold' }}>{item.description}</span>}>
                            </Meta>

                            <p></p>

                            <div className="additional">
                                <Row justify='center'>
                                    <Col flex="auto">
                                        {item.nStars} <i class="fas fa-star"></i>
                                    </Col>

                                    <Col flex="auto">
                                        {item.nAdult} <i class="fas fa-user-alt"></i>
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

export default RoomsCard;