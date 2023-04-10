import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Property } from '../../../assets/types/Property';
import NoImage from '../../../assets/images/no-image.png';

function PropertyCard(props: { property: Property, state: any }) {
    const [destination, setDestination] = useState<string>('/');
    const [navigate, setNavigate] = useState<boolean>(false);

    const HandleNavigate = (destination: string) => {
        setDestination(destination);
        setNavigate(true);
    }

    return navigate ? <Navigate to={destination} state={props.property.id} /> : <a href="" className="block rounded-lg p-4 shadow-sm shadow-indigo-100 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)]" onClick={() => HandleNavigate("/property")}>
        <img
            alt="Home"
            src={props.property.images.length !== 0 ? props.property.images[0] : NoImage}
            className="h-56 w-full rounded-md object-cover"
        />

        <div className="mt-2">
            <dl>
                <div>
                    <dt className="sr-only">Price</dt>

                    <dd className="text-sm text-gray-500">${props.property.price}/night</dd>
                </div>

                <div>
                    <dt className="sr-only">Address</dt>

                    <dd className="font-medium">{props.property.title}</dd>
                </div>
            </dl>

            <div className="mt-6 flex items-center gap-8 text-xs">
                <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                    <svg
                        className="h-4 w-4 text-indigo-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeWidth="2"
                            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                    </svg>

                    <div className="mt-1.5 sm:mt-0">
                        <p className="text-gray-500">Location</p>

                        <p className="font-medium">{props.property.location}</p>
                    </div>
                </div>

                <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                    <svg
                        className="h-4 w-4 text-indigo-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeWidth="2"
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                    </svg>

                    <div className="mt-1.5 sm:mt-0">
                        <p className="text-gray-500">Number Of Guests</p>

                        <p className="font-medium">{props.property.max_number_of_guests}</p>
                    </div>
                </div>
            </div>
        </div>
    </a>
};

export default PropertyCard;
