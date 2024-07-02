import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

const Welcome = ({ isLoggedIn, username }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <div className='container mt-3'>
            <h2 className='main-font h2Title'>Eventos</h2>
            <Row className='pt-3'>
            {products.map(product => (
                <Col sm={3} key={product.id}>
                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={product.image_url} alt={product.name} />
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <button variant="primary" className='link-evento'><Link to={`/events/${product.id}`} className='link'>Ver evento</Link></button>
                </Card.Body>
                </Card>
                </Col>
            ))}
            </Row>
            </div>
        </div>
    );
};

export default Welcome;
