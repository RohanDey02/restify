import { Fragment, useEffect, useState } from 'react';
import { Dialog, Listbox, RadioGroup, Transition } from '@headlessui/react';
import allAmenities from '../../assets/resources/Amenities';
import allLocations from '../../assets/resources/Locations';
import { Property } from '../../assets/types/Property';

interface Item {
    id: number;
    name: string;
    value: string;
}

// Headless UI: https://headlessui.com/
function EditListingModal(props: { show: boolean; handleClose: any; property: Property; accessToken: string; alertMessage: (data: string) => void; alertFlag: (data: boolean) => void }) {
    const noneItem: Item = { 'id': 0, 'name': 'None', 'value': 'None' };

    var { show, handleClose } = props;
    const [title, setTitle] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [maxNumGuests, setMaxNumGuests] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [amenities, setAmenities] = useState<Item[]>([noneItem]);
    const [propertyImages, setPropertyImages] = useState<File[] | null>(null);

    useEffect(() => {
        setTitle(props.property.title);
        setLocation(props.property.location);
        setDescription(props.property.description);
        setMaxNumGuests(props.property.max_number_of_guests);
        setPrice(props.property.price);

        const foundAmenities: Item[] = props.property.amenities.split(",")
            .map((amenity) => {
                return allAmenities.find(item => item.name === amenity)
            })
            .filter(amenity => amenity !== undefined) as Item[];

        setAmenities(foundAmenities);
    }, [])

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }

    async function UpdateProperty(): Promise<any> {
        const bodyToBeUsed: FormData = new FormData();

        if (title !== '' && title !== props.property.title) {
            bodyToBeUsed.append('title', title);
        }

        if (location !== '' && location !== 'None' && location !== props.property.location) {
            bodyToBeUsed.append('location', location);
        }

        if (description !== '' && description !== props.property.description) {
            bodyToBeUsed.append('description', description);
        }

        if (maxNumGuests >= 1 && maxNumGuests !== props.property.max_number_of_guests) {
            bodyToBeUsed.append('max_number_of_guests', maxNumGuests.toString());
        }

        if (price > 0 && price !== props.property.price) {
            bodyToBeUsed.append('price', (Math.round(price * 100) / 100).toString());
        }

        if (amenities.length > 0 && amenities[0].value !== "None" && new Set(amenities.map((x: { name: string; }) => x.name)) !== new Set(props.property.amenities.split(","))) {
            bodyToBeUsed.append('amenities', amenities.map((x: { name: string; }) => x.name).join());
        }

        if (propertyImages !== null && propertyImages.length >= 1) {
            var filteredImageFiles: File[] = []

            for (var image of propertyImages) {
                if (/^image\/*/.test(image.type) === true) {
                    filteredImageFiles.push(image);
                }
            }

            filteredImageFiles.sort((x, y) => {
                if (x.name < y.name) {
                    return -1;
                }
                if (x.name > y.name) {
                    return 1;
                }
                return 0;
            });

            for (var image of filteredImageFiles) {
                bodyToBeUsed.append('images', image);
            }
        }

        fetch(`/property/${props.property.id}/update/`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            },
            body: bodyToBeUsed
        }).then(response => response.json())
        .then(data => {
            props.alertMessage(`S|Property "${title !== '' ? title : props.property.title}" has been successfully updated!`)
        }).catch(() => {
            props.alertMessage(`E|Property "${title !== '' ? title : props.property.title}" was not able to be updated!`)
        });

        props.alertFlag(true);
    };

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        UpdateProperty();
        handleClose();
    };

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog className="w-96 h-72" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full transform overflow-y-auto h-60v lg:w-50v rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 py-4"
                                >
                                    Update Listing: {props.property.title}
                                </Dialog.Title>

                                <form
                                    className="mt-0 mb-0 space-y-4 rounded-lg"
                                    style={{ marginLeft: "-1rem" }}
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
                                                    setTitle(event.target.value)
                                                }
                                                value={title}
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
                                                        clipRule="evenodd"
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
                                                        clipRule="evenodd"
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
                                                        clipRule="evenodd"
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
                                                        if (Number(event.target.value) <= 0) {
                                                            setPrice(Math.abs(Math.round(Number(event.target.value) * 100) / 100));
                                                        } else {
                                                            setPrice(Math.round(Number(event.target.value) * 100) / 100);
                                                        }
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
                                                        clipRule="evenodd"
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
                                            <p className="text-sm text-red-500 pl-4">* Note: If you decide to update the property images, all current images will be removed *</p>
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
                                        className="block w-full rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700 ml-4"
                                        style={{ width: "calc(100% - 1rem)" }}
                                    >
                                        Create Listing
                                    </button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default EditListingModal;
