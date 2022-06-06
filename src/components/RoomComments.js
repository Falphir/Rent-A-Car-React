import React, { useState, useEffect } from 'react';
import { List, Row, Col, Card, Comment, Avatar } from 'antd'
import { useParams, Link } from 'react-router-dom';
const { forwardRef, useRef, useImperativeHandle } = React;
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

const RoomComments = forwardRef((props, ref) => {

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

    

    const columns = [
        { title: 'Description', value: 'description', },
        { title: 'Nº Adults', value: 'nAdult', },
        { title: 'Nº Children', value: 'nChild', },
        { title: 'Nº Rooms', value: 'nRoom', },
        { title: 'Price (€)', value: 'price', },
        { title: 'Nº Stars', value: 'nStars', },
        //{ title: 'Tags', value: 'tags', render: renderTags }
    ];

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

    const handleListChange = (pagination) => {
        fetchApi(pagination.pageSize, pagination.current)
    };

    

    useImperativeHandle(ref, () => ({

        reloadList() {
            handleListChange(pagination)
        }
    
      }));

    const RenderComments = () => {
        console.log(comments)
        if (comments == null) {
            console.log("Comments Null")

        } else {
            console.log("Comments ready")
            return (<>
                <List pagination={pagination} rowKey={record => record._id} loading={loading}
                    dataSource={comments} onChange={handleListChange}
                    renderItem={item => (
                        <li>
                            <Comment
                                author={item.nameUser}
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                content={item.comment}
                                datetime={item.date}
                            />
                        </li>
                    )}
                />
            </>)
        }

    }

    

    console.log("Room ID: " + props.data)
    console.log(comments)

    return (
        <>
            {RenderComments()}
        </>
    )
});

export default RoomComments
