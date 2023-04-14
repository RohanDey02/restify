import { useEffect, useState } from "react";

const useToken = () => {
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>({ access: '', refresh: '' });
    const [data, setData] = useState<any>('');
    useEffect(() => {
        const storedData = localStorage.getItem('data');
        const storedTokens = localStorage.getItem('tokens');

        if (storedData) {
            setData(JSON.parse(storedData));
        }

        if (storedTokens) {
            setTokens(JSON.parse(storedTokens));
        }
    }, []);
    return { tokens, data }
}

export default useToken;