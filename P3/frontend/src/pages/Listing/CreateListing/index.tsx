import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import Navbar from '../../../components/Navbar';
import Alert from '../../../components/Alert';
import allAmenities from '../../../assets/resources/Amenities';
import allLocations from '../../../assets/resources/Locations';

interface Item {
    id: number;
    name: string;
    value: string;
}

function CreateListing() {
    const [data, setData] = useState<any>('');
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>({ access: '', refresh: '' });
    const [isLoading, setIsLoading] = useState(true);

    const [alertFlag, setAlertFlag] = useState<boolean>(false);
    const [resp, setResp] = useState<string>('');

    const noneItem = { 'id': 0, 'name': 'None', 'value': 'None' };

    const [listingTitle, setListingTitle] = useState<string>('');
    const [location, setLocation] = useState<string>(noneItem.value);
    const [description, setDescription] = useState<string>('');
    const [maxNumGuests, setMaxNumGuests] = useState<number>(1);
    const [price, setPrice] = useState<number>(0);
    const [amenities, setAmenities] = useState<Item[]>([noneItem]);
    const [propertyImages, setPropertyImages] = useState<File[] | null>(null);

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
        if (resp !== '') {
            setAlertFlag(true);
        }
    }, [resp])

    function CreateProperty(): void {
        const bodyToBeUsed: any = {};
        const secondBodyToBeUsed: FormData = new FormData();

        if (listingTitle === '') {
            setResp("E|Inputted listing title is empty.");
            return;
        } else {
            bodyToBeUsed.title = listingTitle;
        }
        
        if (location === '' || location === 'None') {
            setResp("E|Inputted location is empty or invalid.");
            return;
        } else {
            bodyToBeUsed.location = location;
        }

        if (description === '') {
            setResp("E|Inputted description is empty.");
            return;
        } else {
            bodyToBeUsed.description = description;
        }

        if (maxNumGuests < 1) {
            setResp("E|Inputted maximum number of guests must be greater than 0 and must be an integer.");
            return;
        } else {
            bodyToBeUsed.max_number_of_guests = maxNumGuests;
        }

        if (price <= 0) {
            setResp("E|Inputted price cannot be less than or equal to 0.");
            return;
        } else {
            bodyToBeUsed.price = Math.round(price * 100) / 100;
        }

        if (amenities.length > 0 && amenities[0].value !== "None") {
            bodyToBeUsed.amenities = amenities.map((x: { name: string; }) => x.name).join();
        } else {
            setResp("E|No amenities were specified.");
            return;
        }

        if (propertyImages !== null && propertyImages.length >= 1) {
            for (var image of propertyImages) {
                if (/^image\/*/.test(image.type) === false) {
                    setResp("E|Inputted avatar is not of image format.")
                    return;
                }
            }

            propertyImages.sort((x, y) => {
                if (x.name < y.name) {
                    return -1;
                }
                if (x.name > y.name) {
                    return 1;
                }
                return 0;
            });

            for (var image of propertyImages) {
                secondBodyToBeUsed.append('images', image);
            }
        }

        fetch(`/property/create/`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${tokens.access}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(bodyToBeUsed)
        }).then(response => response.json())
        .then(data => {
            return fetch(`/property/${data.data.id}/update/`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${tokens.access}`
                },
                body: secondBodyToBeUsed
            });
        }).then(response => response.json())
        .then(otherData => {
            setResp("S|Property was successfully created!");
        }).catch(() => {
            setResp("E|An error occurred with the fetch request!");
        });
    };

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        CreateProperty();
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
        <Navbar currentLocation='/listing/create' firstName={data.first_name} />
        <div className="mx-auto max-w-lg bg-white pt-4 rounded-lg">
            <h1 className="text-center text-2xl font-bold text-teal-700 sm:text-3xl">
                Creating A New Restify Listing
            </h1>

            <form
                className="mt-0 mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
                encType="multipart/form-data"
                onSubmit={(event) => handleSubmit(event)}
            >
                <div>
                    <label htmlFor="Title" className="sr-only">Title</label>

                    <div className="relative">
                        <p className="text-sm text-gray-500 pl-4">Listing Title:</p>
                        <input
                            type="text"
                            name="Title"
                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                            placeholder="Enter listing title"
                            onChange={(event) =>
                                setListingTitle(event.target.value)
                            }
                            value={listingTitle}
                        />
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-500 pl-4">Location:</p>
                    <Listbox value={location}>
                        {({ open }) => (
                            <>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm bg-white pl-4 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 sm:text-sm">
                                        <span className="block truncate">
                                            {location}
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options
                                            static
                                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                                        >
                                            {allLocations.map((loc: Item) => (
                                                <Listbox.Option
                                                    key={loc.id}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active
                                                                ? 'text-white bg-teal-600'
                                                                : 'text-gray-900',
                                                            'cursor-default select-none relative py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={loc.name}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span
                                                                className={classNames(
                                                                    selected ? 'font-semibold' : 'font-normal',
                                                                    'block truncate'
                                                                )}
                                                                onClick={() => {
                                                                    setLocation(loc.value)
                                                                }}
                                                            >
                                                                {loc.value}
                                                            </span>
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>

                <div>
                    <p className="text-sm text-gray-500 pl-4">Listing Description:</p>
                    <textarea
                        id="description"
                        rows={4}
                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                        placeholder="Enter the listing description here"
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        value={description}
                    />
                </div>

                <div>
                    <span className="text-sm text-gray-500 px-4 pb-2">Maximum Number of Guests:</span>
                    <span className="inline-flex gap-1">
                        {/* Before */}
                        <a
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 hover:cursor-pointer"
                            onClick={() => {
                                if (maxNumGuests > 1) {
                                    setMaxNumGuests(maxNumGuests - 1);
                                }

                                if (maxNumGuests < 1) {
                                    setMaxNumGuests(1);
                                }
                            }}
                        >
                            <span className="sr-only">Prev Page</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>

                        <div>
                            <input
                                type="number"
                                className="h-8 w-12 rounded border border-gray-100 p-0 text-center text-xs font-medium [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                min={0}
                                value={String(Math.round(maxNumGuests))}
                                onChange={(event) => {
                                    setMaxNumGuests(Math.round(Number(event.target.value)))
                                }}
                            />
                        </div>

                        {/* After */}
                        <a
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 hover:cursor-pointer"
                            onClick={() => {
                                if (maxNumGuests < 1) {
                                    setMaxNumGuests(1);
                                } else {
                                    setMaxNumGuests(maxNumGuests + 1);
                                }
                            }}
                        >
                            <span className="sr-only">Next Page</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>
                    </span>
                </div>

                <div>
                    <span className="text-sm text-gray-500 px-4 pb-2">Price:</span>
                    <span className="inline-flex gap-1">
                        {/* Before */}
                        <a
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 hover:cursor-pointer"
                            onClick={() => {
                                if (price >= 1) {
                                    setPrice(price - 1);
                                }

                                if (price < 0) {
                                    setPrice(0);
                                }
                            }}
                        >
                            <span className="sr-only">Prev Page</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>

                        <div>
                            <input
                                type="number"
                                className="h-8 w-12 rounded border border-gray-100 p-0 text-center text-xs font-medium [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                min={0}
                                step="0.01"
                                value={String(price)}
                                onChange={(event) => {
                                    setPrice(Number(event.target.value))
                                }}
                            />
                        </div>

                        {/* After */}
                        <a
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 hover:cursor-pointer"
                            onClick={() => {
                                if (price < 0) {
                                    setPrice(0);
                                } else {
                                    setPrice(price + 1);
                                }
                            }}
                        >
                            <span className="sr-only">Next Page</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>
                    </span>
                </div>

                <div>
                    <p className="text-sm text-gray-500 pl-4">Amenities:</p>
                    <Listbox value={amenities} multiple>
                        {({ open }) => (
                            <>
                                <div className="mt-1 relative">
                                    <Listbox.Button className="relative w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm bg-white pl-4 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 sm:text-sm">
                                        <span className="block truncate">
                                            {amenities.length > 0 && amenities[0].name !== noneItem.name ? `${amenities.length} options selected` : 'Select options'}
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options
                                            static
                                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                                        >
                                            {allAmenities.map((amenity: Item) => (
                                                <Listbox.Option
                                                    key={amenity.id}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active ? 'text-white bg-teal-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={amenity.name}
                                                >
                                                    {() => (
                                                        <>
                                                            <span
                                                                className={classNames(
                                                                    amenities.map((x) => x.name).includes(amenity.name) ? 'font-semibold' : 'font-normal', 'block truncate'
                                                                )}
                                                                onClick={() => {
                                                                    let newList = amenities.filter((v) => v.name !== amenity.name && v.name !== noneItem.name);

                                                                    if (amenities.includes(amenity)) {
                                                                        if (newList.length === 0) {
                                                                            setAmenities([noneItem]);
                                                                        } else {
                                                                            setAmenities(newList);
                                                                        }
                                                                    } else {
                                                                        setAmenities([...newList, amenity]);
                                                                    }
                                                                }}
                                                            >
                                                                {amenity.value}
                                                            </span>
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>

                <div>
                    <label htmlFor="propImages" className="sr-only">Property Images</label>
                    <div className="relative">
                        <p className="text-sm text-gray-500 pl-4">Property Images:</p>
                        <input
                            type="file"
                            accept="image/*"
                            name="propImages"
                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm block text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                            placeholder="Insert property images"
                            multiple
                            onChange={(event) =>
                                setPropertyImages(event.target.files && event.target.files.length > 0 ? Array.from(event.target.files) : null)
                            }
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="block w-full rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700"
                >
                    Create Listing
                </button>
            </form>
        </div>
    </>
}

export default CreateListing;
