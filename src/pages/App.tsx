import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/App.css';
import Header from './Header';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Footer from "./Footer";
import BpmButton from "../elements/button";
import {useSpotify} from "../functionality/useSpotify";
import {createToken} from "../functionality/generateToken";
import * as TO from "fp-ts/TaskOption";
import {TaskOption} from "fp-ts/TaskOption";

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
    let token: TaskOption<any>
    const possibleToken: string = localStorage.getItem('access_token')?? '';

    if(localStorage.getItem('access_token') === null) {
        token = createToken()
    } else {
        token = TO.fromNullable(possibleToken)
    }

    const { data, loading, error, makeCall } = useSpotify<SpotifyAudioAnalysis>(token);

    return (
        <>
            <Header/>
            <main className={"app"}>
                <Routes>
                    <Route path="/" element={<Home name={ "Tings"}/>} />
                    <Route path="/about" element={<About name={"Wings"}/>} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
                <BpmButton name={"call spotify"} onClick={() => makeCall("")} />
            </main>
            <Footer />
        </>
    );
};

export default App;
