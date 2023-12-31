import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useNavigate, useLocation} from "react-router-dom";
import "./Header.css"

function Header() {
    const [daten, setDaten] = useState([]);
    const [aktivesMenue, setAktivesMenue] = useState("home");
    const navigate = useNavigate();
    const location = useLocation();

    const [kitaName, setKitaName] = useState()
    const [kitaGruppenName, setKitaGruppenName] = useState()

    useEffect(() => {
        const datenAbrufen = async () => {
            try {
                const response = await axios.get("http://localhost:8080/index", {withCredentials : true});
                setDaten(response.data);
                console.log(response.data)
                setKitaName(response.data.kitaName);
                setKitaGruppenName(response.data.kitaGruppeName);
            } catch (error) {
                console.error("Fehler beim Laden der Daten:", error);
            }
        };

        datenAbrufen();

        const pfad = location.pathname;
        const aktuellesMenue = pfad.includes("/Admin") ? "admin" :
            pfad.includes("/Notfallbetreuung") ? "notbetreuung" :
            pfad.includes("/ProfilBearbeiten") ? "ProfilBearbeiten" : "home";
        setAktivesMenue(aktuellesMenue);
    }, [location.pathname]);

    const abmelden = async () => {
        try {
            await axios.post("http://localhost:8080/logout", {}, {withCredentials: true});
            navigate("/login");
        } catch (error) {
            console.error("Fehler beim Abmelden:", error);
            // Optional: Benutzerfeedback hinzufügen
        }
    };

    return (
        <div className="header-container">
            <header>
                <h2>{kitaName}: {kitaGruppenName}</h2>
                <div className="navCenter">
                    <div className="navButtons">
                        <Link to="/">
                            <button className={`navItem ${aktivesMenue === "home" ? "active" : ""}`}
                                    onClick={() => setAktivesMenue("home")} data-label="Home">
                                <i className="fas fa-home"></i>
                            </button>
                        </Link>
                        <Link to="/Notfallbetreuung">
                            <button className={`navItem ${aktivesMenue === "notbetreuung" ? "active" : ""}`}
                                    onClick={() => setAktivesMenue("notbetreuung")} data-label="Notbetreuung">
                                <i className="fas fa-briefcase-medical"></i>
                            </button>
                        </Link>
                        <Link to="/ProfilBearbeiten">
                            <button className={`navItem ${aktivesMenue === "ProfilBearbeiten" ? "active" : ""}`}
                                    onClick={() => setAktivesMenue("ProfilBearbeiten")} data-label="Profil verwalten">
                                <i className="fas fa-solid fa-user"></i>
                            </button>
                        </Link>
                        {daten.admin && (
                            <Link to="/Admin">
                                <button className={`navItem ${aktivesMenue === "admin" ? "active" : ""}`}
                                        onClick={() => setAktivesMenue("admin")} data-label="Admin-Panel">
                                    <i className="fas fa-user-cog"></i>
                                </button>
                            </Link>
                        )}
                        <button className="logoutButton" onClick={abmelden}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;
