import {useState} from "react";
import {TaskOption} from "fp-ts/TaskOption";

export function useSpotify<T>(token: TaskOption<any>)   {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makeCall = async (url: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`,
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