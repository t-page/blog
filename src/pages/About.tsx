import React from "react";

interface About {
    name: string;
}

const About: React.FC<About> = ({ name }) => {
    return (
        <div>
            <h2>About this ting right here { name }</h2>
            <p>This is something to about how { name } works</p>
        </div>
    );
};

export default About;