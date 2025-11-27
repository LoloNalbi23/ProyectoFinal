import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import "../css/NavBar.css"

export default class NavBar extends Component {
    render() {
        return (
        <nav>
            <h2>Atlas bíblico</h2>

            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/votd">Versículo del día</Link></li>
                <li><Link to="/">Mapa</Link></li>
                <li><Link to="/">En proceso</Link></li>
            </ul>
        </nav>
        )
    }
}
