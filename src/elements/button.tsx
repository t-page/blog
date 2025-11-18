import React from "react";

interface BpmButtonProps {
    name: string;
    onClick: (name: string) => Promise<void>
}

const BpmButton: React.FC<BpmButtonProps> = ( { name, onClick } ) => {
    return (
        <button onClick={() => onClick(name)}>
            {name}
        </button>
    )
}

export default BpmButton;