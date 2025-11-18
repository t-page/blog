import React from "react";
import '../styles/Home.css';

interface Home {
    name: string;
}

const Home: React.FC<Home> = ({ name }) => {
    return (
        <div className="home">
            <h2>Welcome to the most excellent blog called { name }</h2>
            <p>Description of this most incredible blog</p>
        </div>
    );
};

export default Home;