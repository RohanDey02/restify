import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Reservation } from "../../assets/types/Reservation";
import Navbar from "../../components/Navbar";
import { Navigate, useParams } from 'react-router-dom';

function InitialRating() {
    const [data, setData] = useState<any>('');
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>({access: '', refresh: ''});
    const [isLoading, setIsLoading] = useState(true);
    const [rating, setRating] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const { reservationId } = useParams();
    const [user, setUser] = useState<any>('');
    const [property, setProperty] = useState<any>('');
    const [reservation, setReservation] = useState<{id: number, start_date: Date, end_date: Date, feedback: number, user: number, property: number}>({
        id: 0,
        start_date: new Date(),
        end_date: new Date(),
        feedback: 0,
        user: 0,
        property: 0
    });
    const [navigate, setNavigate] = useState<boolean>(false);

    const HandleNavigate = () => {
        setNavigate(true);
    }

    async function GetProperty(property_id: number): Promise<any> {
        try {
            const response = await fetch(`/property/${property_id}`, {
                method: "GET",
                headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				}
			});

            if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				const data = await response.json();

				if (JSON.stringify(property) !== JSON.stringify(data.data)) {
					setProperty(data.data);
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

    async function GetUser(user_id: number): Promise<any> {
        try {
			const response = await fetch(`/accounts/id/${user_id}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				const data = await response.json();

				if (JSON.stringify(user) !== JSON.stringify(data.data)) {
					setUser(data.data);
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

    async function GetReservation(): Promise<any> {
        try {
			const response = await fetch(`/reservations/${reservationId}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				const data = await response.json();

				if (JSON.stringify(reservation) !== JSON.stringify(data.data)) {
					setReservation(data.data);
                    GetUser(data.data.user);
                    GetProperty(data.data.property);
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

    async function SubmitComment(): Promise<any> {
        var commentJson = data.account_type === 'Host' ? JSON.stringify({
            message: message,
            guest_id: reservation.user,
            user_rating: rating
        })
        :
        JSON.stringify({
            message: message,
            property_id: reservation.property,
            property_rating: rating
        })
        try {
			const response = await fetch(`/comments/create/`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				},
                body: commentJson
			});

			if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				HandleNavigate();
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

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
	}, [])

    useEffect(() => {
		if (data !== '' && JSON.stringify(tokens) !== JSON.stringify({access: '', refresh: ''})) {
			GetReservation();
		}		
	}, [data, tokens])

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

    if (navigate) {
        return <Navigate to='/myreservations' />
    }

    return <>
        <Navbar currentLocation='/myreservations' firstName={data.first_name} />
        <div style={{ display: 'flex', flexDirection: 'column', width: '50%', margin: 'auto' }}>
            {data.account_type === 'Host' ?
                <h1 className="text-center text-2xl font-bold text-teal-700 sm:text-3xl mb-1">Review {user.first_name}'s Stay at {property.title}</h1>
                :
                <h1 className="text-center text-2xl font-bold text-teal-700 sm:text-3xl mb-1">Review Your Stay At {property.title}</h1>}
            {data.account_type === 'Host' ?
                <p className="text-left text-base font-bold text-teal-700 sm:text-lg">Rate Guest's Stay: {rating}/5</p>
                :
                <p className="text-left text-base font-bold text-teal-700 sm:text-lg">Rate Your Stay: {rating}/5</p>
            }
            <input type="range" min="0" max="5" onChange={(event) => setRating(parseFloat(event.target.value))} value={rating.toString()} width="1px"></input>
            <p className="text-left text-base font-bold text-teal-700 sm:text-lg mt-1">Comments:</p>
            <TextField
                multiline
                rows={4}
                variant="outlined"
                onChange={(event) => setMessage(event.target.value)}
                value={message}
                style={{ marginBottom: '1rem' }}
            />
            <button
                className="hidden rounded-md transition sm:block bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                onClick={() => SubmitComment()}
            >
                Submit
            </button>
        </div>
    </>
}

export default InitialRating;
