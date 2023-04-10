import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import DefaultAvatar from '../../assets/images/default-avatar.png';
import Alert from '../../components/Alert';

function UpdateAccount() {
    const [data, setData] = useState<any>('');
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>({ access: '', refresh: '' });
    const [isLoading, setIsLoading] = useState(true);

    const [alertFlag, setAlertFlag] = useState<boolean>(false);
    const [resp, setResp] = useState<string>('');
    const [respData, setRespData] = useState<any>('');

    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [avatar, setAvatar] = useState<File | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('data');
        const storedTokens = localStorage.getItem('tokens');

        if (storedData) {
            setData(JSON.parse(storedData));
        }

        if (storedTokens) {
            setTokens(JSON.parse(storedTokens));
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        setEmail(data.email);
        setPhoneNumber(data.phone_number);
    }, [data, tokens]);

    useEffect(() => {
        if (resp !== '') {
            setAlertFlag(true);
        }
    }, [resp]);

    async function UpdateUser(): Promise<any> {
        const bodyToBeUsed: FormData = new FormData();
        
        if (email !== '' && email !== data.email) {
            if (!email.match(/^(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.]+[.][A-Za-z0-9]{2,3}$/)) {
                setResp("E|Inputted email is not formatted correctly.")
                return;
            }

            bodyToBeUsed.append('email', email);
        }

        if (phoneNumber !== '' && phoneNumber !== data.phone_number) {
            if (phoneNumber.length !== 10) {
                setResp("E|Inputted phone number is not 10 digits long.")
                return;
            }

            bodyToBeUsed.append('phone_number', phoneNumber);
        }

        if (password !== '') {
            if (password !== password2) {
                setResp("E|Inputted passwords don't match.")
                return;
            }

            if (password.length < 8) {
                setResp("E|Inputted password is not at least 8 characters long.")
                return;
            }

            bodyToBeUsed.append('password', password);
            bodyToBeUsed.append('password2', password2);
        }

        if (avatar !== null) {
            if (/^image\/*/.test(avatar.type) === false) {
                setResp("E|Inputted avatar is not of image format.")
                return;
            }

            bodyToBeUsed.append('avatar', avatar);
        }

        if (Array.from(bodyToBeUsed.entries()).length !== 0) { 
            try {
                const response = await fetch(`/accounts/${data.username}/update/`, {
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${tokens.access}`,
                    },
                    body: bodyToBeUsed
                });
                
                if (!response.ok) {
                    setResp(`E|An error has occurred! If you intend to update passwords, validate that they match. Likewise, ensure that the email and phone numbers are correctly formatted and the avatar is an image file.`);
                } else {
                    const dataResp = await response.json();
                    
                    if (JSON.stringify(respData) !== JSON.stringify(dataResp.data)) {
                        setRespData(dataResp.data);
                        setResp('S|Your account has been successfully updated!');
                        
                        // Update localStorage
                        if (bodyToBeUsed.has('email')) {
                            data.email = dataResp.data.email;
                        }

                        if (bodyToBeUsed.has('password')) {
                            data.password = bodyToBeUsed.get('password');
                        }

                        if (bodyToBeUsed.has('phone_number')) {
                            data.phone_number = dataResp.data.phone_number;
                        }

                        if (bodyToBeUsed.has('avatar')) {
                            data.avatar = dataResp.data.avatar;
                        }

                        localStorage.setItem('data', JSON.stringify(data));
                    }
                }
            } catch (error) {
                console.error('There was a problem with the fetch request:', error);
                throw error;
            }
        } else {
            setResp('S|Nothing was updated.')
        }
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        UpdateUser();

        if (resp !== '') {
            setAlertFlag(true);
        }
    };

    if (isLoading) {
        return <>
            <div role="status" className='flex items-center justify-center h-screen'>
                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
            </div>
        </>
    }

    return <>
        <Alert flag={alertFlag} message={resp} handleClose={() => setAlertFlag(false)} />
        <Navbar currentLocation='/account/update' firstName={data.first_name} />
        <div className="mx-auto max-w-lg bg-white pt-4 rounded-lg">
            <h1 className="text-center text-2xl font-bold text-teal-700 sm:text-3xl">
                Editing {data.first_name} {data.last_name}'s Profile...
            </h1>

            <div className='flex justify-center pt-4'>
                <img className='rounded-full w-32 h-32' src={data.avatar ? data.avatar : DefaultAvatar} alt="portrait" />
            </div>
            
            <form
                className="mt-0 mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                encType="multipart/form-data"
                onSubmit={(event) => handleSubmit(event)}
            >
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>

                    <div className="relative">
                        <p className="text-sm text-gray-500 pl-4">Email:</p>
                        <input
                            type="email"
                            name="email"
                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                            placeholder="Enter email"
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            value={email}
                        />
                    </div>
                </div>


                <div>
                    <label htmlFor="password" className="sr-only">Password</label>

                    <div className="relative">
                        <p className="text-sm text-gray-500 pl-4">Password:</p>
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

                <div>
                    <label htmlFor="password2" className="sr-only">Repeat Password</label>

                    <div className="relative">
                        <p className="text-sm text-gray-500 pl-4">Repeat Password:</p>
                        <input
                            type="password"
                            name="password2"
                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                            placeholder="Enter repeated password"
                            onChange={(event) =>
                                setPassword2(event.target.value)
                            }
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phone_number" className="sr-only">Phone Number</label>

                    <div className="relative">
                        <p className="text-sm text-gray-500 pl-4">Phone Number:</p>
                        <input
                            type="text"
                            name="phone_number"
                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                            placeholder="Enter phone number"
                            onChange={(event) =>
                                setPhoneNumber(event.target.value)
                            }
                            value={phoneNumber}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="avatar" className="sr-only">Avatar</label>
                    <div className="relative">
                        <p className="text-sm text-gray-500 pl-4">Avatar:</p>
                        <input
                            type="file"
                            accept="image/*"
                            name="avatar"
                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm block text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                            placeholder="Insert avatar"
                            onChange={(event) =>
                                setAvatar(event.target.files && event.target.files.length > 0 ? event.target.files[0] : null)
                            }
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="block w-full rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700"
                >
                    Update Profile
                </button>
            </form>
        </div>
    </>
}

export default UpdateAccount;
