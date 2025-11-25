import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import '../styles/App.css';
import Header from './Header';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Footer from "./Footer";
import BpmButton from "../elements/button";
import {useSpotify} from "../functionality/useSpotify";
import {getToken, redirectToSpotify} from "../functionality/generateToken";

interface SpotifyAudioAnalysis {
    "danceability": number,
    "energy": number,
    "key": number,
    "loudness": number,
    "mode": number,
    "speechiness": number,
    "acousticness": number,
    "instrumentalness": number,
    "liveness": number,
    "valence": number,
    "tempo": number,  // ← This is the BPM
    "type": string,
    "id": string,
    "uri": string,
    "track_href": string,
    "analysis_url": string,
    "duration_ms": number,
    "time_signature": number
}

const App: React.FC = () => {
    useEffect(() => {
        const init = async () => {
            const params = new URLSearchParams(window.location.search)
            const code = params.get("code")
            const token = localStorage.getItem("access_token")
            console.log("Hi, how's it going?")

            if(!token && !code) {
                redirectToSpotify();
                return;
            }

            if(!token && code) {
                getToken(code)
            }
        }

        init();
    }, [])

    const storedToken = localStorage.getItem("access_token") ?? ""
    const { makeCall } = useSpotify<SpotifyAudioAnalysis>(storedToken);

    return (
        <>
            <Header/>
            <main className={"app"}>
                <Routes>
                    <Route path="/" element={<Home name={ "Tings"}/>} />
                    <Route path="/about" element={<About name={"Wings"}/>} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
                <BpmButton name={"call spotify"} onClick={() => makeCall()} />
            </main>
            <Footer />
        </>
    );
};

export default App;
