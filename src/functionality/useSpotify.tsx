import {useState} from "react";

export function useSpotify<T>(token: string)   {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makeCall = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("https://api.spotify.com/v1/audio-features/2takcwOaAZWiXQijPHIx7B",
                {
                    method: "GET",
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": "Bearer BQBOCNT2-nXqXKUwMqR0Lsoftj4gP8MSdXKUuCt35FyDsS7DJnbaWIGGeCoWBvgq9DUQXllazI2qa541f9zwsRzyKewWvyqfP26EnQVaXfM8o0Hlxp2f0EwN0GeWJ2RbV7GNNZgH4N_RclIb6OVcQky6emNEV2Hh9ugmgtPsMlcAKvOpfca8qNG5zYsaCB7LCJOqCsTTF1_eVuUSwbW2eJhjANjVRCOKQYyGwOA",
                },
            });

            if (!res.ok) throw new Error(`Error ${res.status}`);
            const result: T = await res.json();
            setData(result);

        } catch(err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, makeCall };
}