import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`/api/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchEvent();
    }, [id]);

    if (!event) {
        return <div>Cargando...</div>;
    }

    return (
        <div className='container mt-3'>
            <img src={event.image_url} alt={event.name} className='foto-evento'/>
            <h2 className='main-font h2Title'>{event.name}</h2>
            <p>Categoria: {event.category}</p>
            <p>Fecha: {event.date}</p>
            <p>Horario: {event.time}</p>
            <p>Precio: {event.price}</p>
        </div>
    );
};

export default EventDetails;