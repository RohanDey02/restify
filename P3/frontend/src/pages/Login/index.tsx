import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";

// Made with assistance from HyperUI: https://www.hyperui.dev/
function Login() {
    const [data, setData] = useState<any>();
    const [tokens, setTokens] = useState<any>();
    const [destination, setDestination] = useState<string>('/');
    const [navigate, setNavigate] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [resp, setResp] = useState<string>('');

    async function Login(): Promise<any> {
        try {
            const response = await fetch(`/accounts/login`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            if (!response.ok) {
                setResp(`An error has occurred! Either the account with username ${username} does not exist, or the password is invalid.`);
            } else {
                const dataResp = await response.json();
                
                if (JSON.stringify(data) !== JSON.stringify(dataResp.data)) {
                    setData(dataResp.data);
                    setTokens(dataResp.tokens);
                    setDestination('/home');
                    setNavigate(true);
                    setResp('Success');
                }
            }
        } catch (error) {
            console.error('There was a problem with the fetch request:', error);
            throw error;
        }
    }

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
        localStorage.setItem('tokens', JSON.stringify(tokens));
    })

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        Login();
    };

    const HandleNavigate = (destination: string) => {
        setDestination(destination);
        setNavigate(true);
    }

    return navigate ? <Navigate to={destination} state={{data: data, tokens: tokens}} /> : <>
        <div style={{
            backgroundImage: `url('https://i.imgur.com/BwPWwbF.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh'
        }}>
            <div className="flex items-center justify-center h-screen mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg bg-white pt-4 rounded-lg">
                    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                        Welcome to Restify!
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                        {resp !== '' && resp !== 'Success' ? resp : 'Looking for a lodge to stay at? Introducing Restify! The objectively better version of Airbnb.'}
                    </p>

                    <form
                        action=""
                        className="mt-0 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                        onSubmit={(event) => handleSubmit(event)}
                    >
                        <p className="text-center text-lg font-medium">Sign in to your account</p>

                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>

                            <div className="relative">
                                <input
                                    type="text"
                                    name="username"
                                    className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                    placeholder="Enter username"
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>

                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                    placeholder="Enter password"
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                        >
                            Sign in
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            No account?
                            <a href="" className='font-medium hover:text-indigo-600' onClick={() => HandleNavigate("/register")}> Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </>
};

export default Login;
