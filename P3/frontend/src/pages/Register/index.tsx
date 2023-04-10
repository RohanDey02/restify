import React from 'react';
import { Navigate } from "react-router-dom";

// Made with assistance from HyperUI: https://www.hyperui.dev/
class Register extends React.Component<any> {
    state = {
        destination: "/register",
        navigate: false,
        username: '',
        email: '',
        password: '',
        password2: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        accType: '',
        response: '',
        responseCode: 0
    }

    async CreateAccount(): Promise<any> {
        try {
            await fetch(`/accounts/create`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    password2: this.state.password2,
                    email: this.state.email,
                    phone_number: this.state.phoneNumber,
                    account_type: this.state.accType,
                    first_name: this.state.firstName,
                    last_name: this.state.lastName
                })
            }).then((response) => {
                if (response.status !== 201) {
                    this.setState({ response: "An error has occurred! Ensure that the fields are correctly formatted. i.e. Phone Number is exactly 10 digits, Passwords must match and must be at least 8 characters", responseCode: response.status });
                } else {
                    this.setState({ response: "Success", responseCode: response.status, destination: "/", navigate: true });
                }
            });
        } catch (error) {
            this.setState({ response: "An error has occurred with the backend implementation" });
            throw error;
        }
    }

    handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        this.CreateAccount();
    };

    HandleNavigate(destination: string) {
        this.setState({ destination: destination, navigate: true });
    }

    render() {
        if (this.state.navigate) {
            this.setState({ navigate: false });
            return <Navigate to={this.state.destination} state={null} />
        }

        return <>
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
                            {this.state.response !== '' && this.state.response !== 'Success' ? this.state.response : 'Looking for a lodge to stay at? Introducing Restify! The objectively better version of Airbnb.'}
                        </p>

                        <form
                            className="mt-0 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                            onSubmit={(event) => this.handleSubmit(event)}
                        >
                            <div>
                                <label htmlFor="username" className="sr-only">Username</label>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter username"
                                        onChange={(event) =>
                                            this.setState({ username: event.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>

                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter email"
                                        onChange={(event) =>
                                            this.setState({ email: event.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className='inline-grid grid-cols-2 gap-4'>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>

                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                            placeholder="Enter password"
                                            onChange={(event) =>
                                                this.setState({ password: event.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password2" className="sr-only">Repeat Password</label>

                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password2"
                                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                            placeholder="Enter repeated password"
                                            onChange={(event) =>
                                                this.setState({ password2: event.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone_number" className="sr-only">Phone Number</label>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="phone_number"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter phone number"
                                        onChange={(event) =>
                                            this.setState({ phoneNumber: event.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className='inline-grid grid-cols-2 gap-4'>
                                <div>
                                    <label htmlFor="first_name" className="sr-only">First Name</label>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="first_name"
                                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                            placeholder="Enter first name"
                                            onChange={(event) =>
                                                this.setState({ firstName: event.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="sr-only">Last Name</label>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="last_name"
                                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                            placeholder="Enter last name"
                                            onChange={(event) =>
                                                this.setState({ lastName: event.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500">Account Type:</p>
                            <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
                                <div>
                                    <input className='peer sr-only' type="radio" id="user" name="acc_type" value="User" onChange={(event) => this.setState({ accType: event.target.value })} />
                                    <label className='block w-full rounded-lg border border-gray-200 p-2 hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white' htmlFor="user">User</label>
                                </div>
                                <div>
                                    <input className='peer sr-only' type="radio" id="host" name="acc_type" value="Host" onChange={(event) => this.setState({ accType: event.target.value })} />
                                    <label className='block w-full rounded-lg border border-gray-200 p-2 hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white' htmlFor="host">Host</label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                            >
                                Register
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Already have an account?
                                <a href="" className='font-medium hover:text-indigo-600' onClick={() => this.HandleNavigate("/")}> Sign-in</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    }
};

export default Register;
