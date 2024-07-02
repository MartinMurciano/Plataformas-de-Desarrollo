import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../Styles/Styles.css";

const Header = ({ username, handleLogout }) => {
    return (
        <Navbar className="main-color">
            <Container>
                <Navbar.Brand href="/Welcome" className='main-font'>Inicio</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {username ? (
                            <div>
                                <p>Logueado como: {username} <button className='boton-registro' onClick={handleLogout}>Cerrar Sesion</button></p>
                            </div>
                        ) : (
                            <div>
                                <Link to="/login" className='linkH'>Login</Link> | <Link to="/register" className='linkH'>Registrarse</Link>
                            </div>
                        )}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
