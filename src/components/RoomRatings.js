import React, { useState, useEffect } from 'react';
import { List, Row, Col, Card, Comment, Avatar, Rate } from 'antd'
import { useParams, Link } from 'react-router-dom';

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

const RoomRatings = (props) => {

    //const { roomId } = props.data;
    const Size = useWindowSize();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        comments: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    });



    const fetchApi = (pageSize, current) => {
        const url = '/comment/comments/' + props.data + '?' + new URLSearchParams({
            limit: pageSize,
            skip: current - 1
        })

        fetch(url, {
            headers: { 'Accept': 'application/json' }
        })

            .then((response) => response.json())

            .then((response) => {
                const { auth, comments = [], pagination } = response;

                if (auth) {
                    setLoading(false);
                    setData({
                        comments,
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
            comments: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        });
    }, []);

    const onChange = (pagination) => {
        fetchApi(pagination.pageSize, pagination.current);
        console.log(pagination.page)
    };



    const { comments, pagination } = data;


    const RenderRatings = () => {
        console.log(comments)
        if (comments == null) {
            console.log("Comments Null")
        } else {
            console.log("Comments ready")
            console.log("length: " + comments.length)
            const rating = Object.keys(comments).map((key) => comments[key].rating);
            const avg = rating.reduce((sum, curr) => sum + Number(curr), 0) / comments.length;
            const RoundedAvg = Math.round(avg * 10) / 10

            console.log("avg: " + RoundedAvg)
            return (
                <>
                    <Row>
                        <Col span={24}>
                            <Row justify='center' align='middle'>
                                <Col>
                                    <Row justify='center'>
                                        <h1 style={{ fontSize: 56 }}><b>{RoundedAvg}</b></h1>
                                    </Row>
                                    <Row justify='center' style={{ marginTop: -40 }}>
                                        <h3>{comments.length} Total</h3>
                                    </Row>
                                    <Row justify='center'>
                                        <Rate disabled allowHalf={true} value={RoundedAvg}></Rate>
                                    </Row>
                                </Col>
                            </Row>

                        </Col>
                    </Row>

                </>
            )
        }

    }


    console.log("Room ID: " + props.data)
    console.log(comments)
    return (
        <>
            {RenderRatings()}
        </>
    )
}

export default RoomRatings