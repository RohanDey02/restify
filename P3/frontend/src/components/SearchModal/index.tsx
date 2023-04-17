import { Fragment, useState } from 'react';
import { Dialog, Listbox, RadioGroup, Transition } from '@headlessui/react';
import Datepicker from 'react-tailwindcss-datepicker';
import allAmenities from '../../assets/resources/Amenities';
import allLocations from '../../assets/resources/Locations';

interface Item {
    id: number;
    name: string;
    value: string;
}

const sortOptions: Item[] = [
    { 'id': 1, 'name': 'location', 'value': 'Location' },
    { 'id': 2, 'name': 'max_number_of_guests', 'value': 'Minimum Number Of Guests' },
    { 'id': 3, 'name': 'price', 'value': 'Price' },
    { 'id': 4, 'name': 'title', 'value': 'Title' }
]

const orderOptions: Item[] = [
    { 'id': 1, 'name': 'asc', 'value': 'Ascending' },
    { 'id': 2, 'name': 'desc', 'value': 'Descending' }
]

// Headless UI: https://headlessui.com/
function SearchModal(props: { show: boolean; handleClose: any; onModalSubmit: (data: any) => void }) {
    const noneItem = { 'id': 0, 'name': 'None', 'value': 'None' };

    var { show, handleClose } = props;
    const [sortOption, setSortOption] = useState<Item>(noneItem);
    const [orderOption, setOrderOption] = useState<Item>(orderOptions[0]);
    const [amenities, setAmenities] = useState<Item[]>([noneItem]);
    const [location, setLocation] = useState<String>(noneItem.value);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [maxNumGuests, setMaxNumGuests] = useState<number>(0);
    const [title, setTitle] = useState<string>('');
    const [date, setDate] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }

    const handleSetDate = (value: any) => {
        setDate(value);
    }

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
                            <Dialog.Panel className="w-full transform overflow-y-auto h-60v rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className='grid grid-cols-2 w-full gap-4'>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 pb-4"
                                    >
                                        Sort
                                    </Dialog.Title>

                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 pb-4"
                                    >
                                        Order
                                    </Dialog.Title>
                                </div>

                                {/* Body */}
                                <div className='cards-grid'>
                                    <Listbox value={sortOption} onChange={setSortOption}>
                                        {({ open }) => (
                                            <>
                                                <div className="mt-1 relative">
                                                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                                                        <span className="block truncate">
                                                            {sortOption.value}
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
                                                            {sortOptions.map((option: Item) => (
                                                                <Listbox.Option
                                                                    key={option.id}
                                                                    className={({ active }) =>
                                                                        classNames(
                                                                            active ? 'text-white bg-teal-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                        )
                                                                    }
                                                                    value={option}
                                                                >
                                                                    {({ selected, active }) => (
                                                                        <>
                                                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                                {option.value}
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

                                    <RadioGroup value={orderOption} onChange={setOrderOption}>
                                        <RadioGroup.Label className="sr-only">order</RadioGroup.Label>
                                        <div className='inline-grid grid-cols-2 gap-4 w-full mt-1.5'>
                                            {orderOptions.map((option) => (
                                                <RadioGroup.Option
                                                    key={option.name}
                                                    value={option}
                                                    className={({ active, checked }) =>
                                                        `${active ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300' : ''};
                                                        ${checked ? 'bg-teal-600 text-white' : 'bg-white'} relative flex cursor-pointer rounded-lg pl-4 pr-10 py-2 shadow-md focus:outline-none`
                                                    }
                                                >
                                                    {({ active, checked }) => (
                                                        <>
                                                            <div className="text-sm">
                                                                <RadioGroup.Label
                                                                    as="p"
                                                                    className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
                                                                        }`}
                                                                >
                                                                    {option.value}
                                                                </RadioGroup.Label>
                                                            </div>
                                                        </>
                                                    )}
                                                </RadioGroup.Option>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>

                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 py-4"
                                >
                                    Filter
                                </Dialog.Title>

                                <div className='inline-grid grid-cols-2 gap-x-4 gap-y-2 w-full'>
                                    <p className="text-sm text-gray-500">Amenities:</p>
                                    <p className="text-sm text-gray-500">Location:</p>

                                    <Listbox value={amenities} multiple>
                                        {({ open }) => (
                                            <>
                                                <div className="mt-1 relative">
                                                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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

                                    <Listbox value={location} onChange={setLocation}>
                                        {({ open }) => (
                                            <>
                                                <div className="mt-1 relative">
                                                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                        <span className="block truncate">{location}</span>
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

                                    {/* Next Row */}
                                    <p className="text-sm text-gray-500">Title:</p>
                                    <p className="text-sm text-gray-500">Minimum Number Of Guests:</p>

                                    <div className="inline-flex gap-1">
                                        <input
                                            type="text"
                                            name="username"
                                            className="w-full rounded-lg border-gray-200 p-2 text-sm shadow-sm"
                                            placeholder="Enter title (optional)"
                                            onChange={(event) =>
                                                setTitle(event.target.value)
                                            }
                                            value={title}
                                        />
                                    </div>

                                    <div className="inline-flex gap-1">
                                        <button
                                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                                            onClick={() => {
                                                if (maxNumGuests <= 0) {
                                                    setMaxNumGuests(0);
                                                } else {
                                                    setMaxNumGuests(maxNumGuests - 1);
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
                                        </button>

                                        <div>
                                            <input
                                                type="number"
                                                className="h-8 w-12 rounded border border-gray-100 p-0 text-center text-xs font-medium [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                                min={0}
                                                value={String(maxNumGuests)}
                                                onChange={(event) => {
                                                    if (Number.isInteger(Number(event.target.value))) {
                                                        setMaxNumGuests(Number(event.target.value));
                                                    }
                                                }}
                                            />
                                        </div>

                                        <button
                                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                                            onClick={() => {
                                                if (maxNumGuests < 0) {
                                                    setMaxNumGuests(0);
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
                                        </button>
                                    </div>

                                    <p className="text-sm text-gray-500">Start and End Availability:</p>

                                    <div className='inline-grid grid-cols-2 gap-x-4 gap-y-2 w-full'>
                                        <p className="text-sm text-gray-500">Minimum Price:</p>
                                        <p className="text-sm text-gray-500">Maximum Price:</p>
                                    </div>

                                    <div className='inline-flex gap-1'>
                                        <Datepicker
                                            primaryColor='blue'
                                            value={date}
                                            onChange={handleSetDate}
                                            minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                            separator={"-"}
                                        />
                                    </div>

                                    <div className='inline-grid grid-cols-2 gap-x-4 gap-y-2 w-full'>
                                        <div className="inline-flex gap-1">
                                            {/* Before */}
                                            <button
                                                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                                                onClick={() => {
                                                    if (minPrice >= 1) {
                                                        setMinPrice(minPrice - 1);
                                                    }

                                                    if (minPrice < 0) {
                                                        setMinPrice(0);
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
                                            </button>

                                            <div>
                                                <input
                                                    type="number"
                                                    className="h-8 w-12 rounded border border-gray-100 p-0 text-center text-xs font-medium [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                                    min={0}
                                                    value={String(minPrice)}
                                                    onChange={(event) => {
                                                        if (Number(event.target.value) <= maxPrice) {
                                                            setMinPrice(Number(event.target.value));
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {/* After */}
                                            <button
                                                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                                                onClick={() => {
                                                    if (minPrice < 0) {
                                                        setMinPrice(0);
                                                    } else if (minPrice >= maxPrice) {
                                                        setMinPrice(maxPrice);
                                                    } else {
                                                        setMinPrice(minPrice + 1);
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
                                            </button>
                                        </div>

                                        <div className="inline-flex gap-1">
                                            <button
                                                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                                                onClick={() => {
                                                    if (maxPrice < 0) {
                                                        setMaxPrice(0);
                                                    } else if (maxPrice <= minPrice) {
                                                        setMaxPrice(minPrice);
                                                    } else {
                                                        setMaxPrice(maxPrice - 1);
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
                                            </button>

                                            <div>
                                                <input
                                                    type="number"
                                                    className="h-8 w-12 rounded border border-gray-100 p-0 text-center text-xs font-medium [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                                    min={0}
                                                    value={String(maxPrice)}
                                                    onChange={(event) => {
                                                        if (Number(event.target.value) >= minPrice) {
                                                            setMaxPrice(Number(event.target.value));
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <button
                                                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                                                onClick={() => {
                                                    if (maxPrice < 0) {
                                                        setMaxPrice(0);
                                                    } else {
                                                        setMaxPrice(maxPrice + 1);
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
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={() => {
                                            props.onModalSubmit({
                                                sortOption: sortOption,
                                                orderOption: orderOption,
                                                amenities: amenities,
                                                location: location,
                                                minPrice: minPrice,
                                                maxPrice: maxPrice,
                                                maxNumGuests: maxNumGuests,
                                                title: title,
                                                availability: date
                                            });
                                            handleClose();
                                        }}
                                    >
                                        Apply Sort and Filter!
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default SearchModal;
