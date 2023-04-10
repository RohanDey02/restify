import React, {useState} from 'react';
import { Navigate } from 'react-router-dom';

function Card(props: {currentLocation: string, description: string, destination: string, image: string, title: string}) {
    const [navigate, setNavigate] = useState<boolean>(false);

    const HandleNavigate = () => {
        setNavigate(true);
    }

    if (navigate && props.currentLocation !== props.destination) {
        return <Navigate to={props.destination} />
    } else {
        return <a href="" className="block rounded-lg p-4 shadow-sm shadow-indigo-100 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)]" onClick={() => HandleNavigate()}>
            <img
                alt="Home"
                src={props.image}
                className="h-56 w-full rounded-md object-cover"
            />

            <div className="mt-2">
                <dl>
                    <div>
                        <dt className="sr-only">Title</dt>

                        <dd className="font-medium">{props.title}</dd>
                    </div>

                    <div>
                        <dt className="sr-only">Description</dt>

                        <dd className="text-sm text-gray-500">{props.description}</dd>
                    </div>
                </dl>
            </div>
        </a>
    }
};

export default Card;

