// client/src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';

const Register = ({ setUsername, setIsLoggedIn }) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/register', { username: usernameInput, password });
            Swal.fire({
                title: "Registro exitoso",
                timer: 1500,
                imageUrl: "https://49.media.tumblr.com/307c6f268b6cf349ee1fd50a3cc408c5/tumblr_nye1a8BFCN1uk9x9no1_r1_500.gif",
                imageWidth: 500,
                imageHeight: 356,
                showConfirmButton: false,
            });
            setUsername(response.data.username);
            setIsLoggedIn(true);
            navigate('/');
        } catch (error) {
            Swal.fire({
                title: "Usuario ya registrado",
                timer: 1600,
                imageUrl: "https://gifdb.com/images/high/long-michael-scott-no-response-7y76hihwv7hzdtul.gif",
                imageWidth: 459,
                imageHeight: 375,
                showConfirmButton: false,
              });
            console.error('Error registering:', error);
        }
    };

    return (
        <div className='container mt-3'>
        <h2 className='main-font h2Title'>Registrarse</h2>
        <Form onSubmit={handleSubmit} className='mt-3'>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Usuario</Form.Label>
                    <Form.Control 
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                    <Form.Control 
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <button variant="primary" type="submit" className='link-evento'>
                Registrarse
            </button>
        </Form>
        </div>
    );
};

export default Register;

