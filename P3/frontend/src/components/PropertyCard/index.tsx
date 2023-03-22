import React from 'react';
import { Property } from '../../assets/types/Property';

function PropertyCard(props: Property) {
    return <a href="#" className="block rounded-lg p-4 shadow-sm shadow-indigo-100">
        <img
            alt="Home"
            src={props.images.length !== 0 ? props.images[0] : "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
            className="h-56 w-full rounded-md object-cover"
        />

        <div className="mt-2">
            <dl>
                <div>
                    <dt className="sr-only">Price</dt>

                    <dd className="text-sm text-gray-500">${props.price}/night</dd>
                </div>

                <div>
                    <dt className="sr-only">Address</dt>

                    <dd className="font-medium">{props.title}</dd>
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
                            stroke-width="2"
                            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                    </svg>

                    <div className="mt-1.5 sm:mt-0">
                        <p className="text-gray-500">Location</p>

                        <p className="font-medium">{props.location}</p>
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
                            stroke-width="2"
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                    </svg>

                    <div className="mt-1.5 sm:mt-0">
                        <p className="text-gray-500">Number Of Guests</p>

                        <p className="font-medium">{props.max_number_of_guests}</p>
                    </div>
                </div>
            </div>
        </div>
    </a>
};

export default PropertyCard;
