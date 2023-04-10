import React, { Fragment, useEffect, useState } from 'react';
import { Property } from '../../../assets/types/Property';
import NoImage from '../../../assets/images/no-image.png';
import { Menu, Transition } from '@headlessui/react';
import ConfirmationModal from '../../ConfirmationModal';
import EditListingModal from '../../EditListingModal';

// HeadlessUI
function ManagePropertyCard(props: { property: Property; alertMessage: (data: string) => void; alertFlag: (data: boolean) => void }) {
    const [deleteShow, setDeleteShow] = useState<boolean>(false);
    const [editShow, setEditShow] = useState<boolean>(false);
    const [editResp, setEditResp] = useState<string>('');
    const [deleteProperty, setDeleteProperty] = useState<boolean>(false);

    const [data, setData] = useState<any>('');
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>({ access: '', refresh: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
        if (deleteProperty) {
            fetch(`/property/${props.property.id}/delete/`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                    'Content-type': 'application/json'
                }
            }).then(response => response.json())
            .then(() => {
                props.alertMessage(`S|Property "${props.property.title}" has been successfully deleted!`);
            }).catch((error) => {
                console.log("An error occurred with the fetch request!", error);
                props.alertMessage(`E|Property ${props.property.title} was not able to be deleted!`);
            });

            props.alertFlag(true);
        }
    }, [deleteProperty]);

    useEffect(() => {
        if (editResp !== '') {
            props.alertMessage(editResp);
            props.alertFlag(true);
        }
    }, [editResp])

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
        <ConfirmationModal show={deleteShow} handleClose={() => setDeleteShow(false)} onModalSubmit={setDeleteProperty} title={`Deleting Property - ${props.property.title}`} message={`Are you sure about deleting "${props.property.title}"? If so, press "Confirm", otherwise press "Close" or anywhere else on the screen.`} />
        <EditListingModal show={editShow} handleClose={() => setEditShow(false)} property={props.property} accessToken={tokens.access} alertMessage={props.alertMessage} alertFlag={props.alertFlag} />

        <div className="block rounded-lg p-4 shadow-sm shadow-indigo-100 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)]">
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

                <Menu as="div" className="pt-4">
                    <div>
                        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            Manage Property
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="right-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1 ">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${active ? 'bg-teal-600 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            onClick={() => setEditShow(true)}
                                        >
                                            {active ? (
                                                <EditActiveIcon
                                                    className="mr-2 h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <EditInactiveIcon
                                                    className="mr-2 h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            )}
                                            Edit
                                        </button>
                                    )}
                                </Menu.Item>

                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${active ? 'bg-teal-600 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            onClick={() => setDeleteShow(true)}
                                        >
                                            {active ? (
                                                <DeleteActiveIcon
                                                    className="mr-2 h-5 w-5 text-teal-400"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <DeleteInactiveIcon
                                                    className="mr-2 h-5 w-5 text-teal-400"
                                                    aria-hidden="true"
                                                />
                                            )}
                                            Delete
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    </>
};

function EditInactiveIcon(props: any) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#319795"
                stroke="#319795"
                strokeWidth="2"
            />
        </svg>
    )
}

function EditActiveIcon(props: any) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#38B2AC"
                stroke="#FFFFFF"
                strokeWidth="2"
            />
        </svg>
    )
}

function DeleteInactiveIcon(props: any) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#319795"
                stroke="#319795"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#319795" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#319795" strokeWidth="2" />
        </svg>
    )
}

function DeleteActiveIcon(props: any) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#38B2AC"
                stroke="#FFFFFF"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
    )
}

export default ManagePropertyCard;
