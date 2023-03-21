import { Dialog, Listbox, RadioGroup, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import "./style.css";

interface Item {
    id: number;
    name: string;
    value: string;
}

const allAmenities: Item[] = [
    { 'id': 1, 'name': 'AirportShuttle', 'value': 'Airport Shuttle' },
    { 'id': 2, 'name': 'Bar', 'value': 'Bar' },
    { 'id': 3, 'name': 'BasketballCourt', 'value': 'Basketball Court' },
    { 'id': 4, 'name': 'BusinessCenter', 'value': 'Business Center' },
    { 'id': 5, 'name': 'FitnessCenter', 'value': 'Fitness Center' },
    { 'id': 6, 'name': 'FreeParking', 'value': 'Free Parking' },
    { 'id': 7, 'name': 'GameRoom', 'value': 'Game Room' },
    { 'id': 8, 'name': 'GolfCourse', 'value': 'Golf Course' },
    { 'id': 9, 'name': 'Gym', 'value': 'Gym' },
    { 'id': 10, 'name': 'LaundryService', 'value': 'Laundry Service' },
    { 'id': 11, 'name': 'Lounge', 'value': 'Lounge' },
    { 'id': 12, 'name': 'MeetingRooms', 'value': 'Meeting Rooms' },
    { 'id': 13, 'name': 'Pool', 'value': 'Pool' },
    { 'id': 14, 'name': 'Restaurant', 'value': 'Restaurant' },
    { 'id': 15, 'name': 'RoomService', 'value': 'Room Service' },
    { 'id': 16, 'name': 'Sauna', 'value': 'Sauna' },
    { 'id': 17, 'name': 'Spa', 'value': 'Spa' },
    { 'id': 18, 'name': 'TennisCourt', 'value': 'Tennis Court' },
    { 'id': 19, 'name': 'Theater', 'value': 'Theater' },
    { 'id': 20, 'name': 'WiFi', 'value': 'WiFi' }
]

const sortOptions: Item[] = [
    { 'id': 1, 'name': 'location', 'value': 'Location' },
    { 'id': 2, 'name': 'max_number_of_guests', 'value': 'Maximum Number Of Guests' },
    { 'id': 3, 'name': 'price', 'value': 'Price' },
    { 'id': 4, 'name': 'title', 'value': 'Title' }
]

const orderOptions: Item[] = [
    { 'id': 1, 'name': 'asc', 'value': 'Ascending' },
    { 'id': 2, 'name': 'desc', 'value': 'Descending' }
]

// Headless UI: https://headlessui.com/
function SearchModal(props: { show: boolean; handleClose: any; }) {
    const noneItem = { 'id': 0, 'name': 'None', 'value': 'None' };

    var { show, handleClose } = props;
    const [sortOption, setSortOption] = useState<Item>(noneItem);
    const [orderOption, setOrderOption] = useState<Item>(orderOptions[0]);
    const [amenities, setAmenities] = useState<Item[]>([noneItem]);
    // const [amenities, setAmenities] = useState<Amenity>(allAmenities[0]);
    // const [query, setQuery] = useState('')

    // const filteredPeople = query === '' ? allAmenities : allAmenities.filter((amenity) => amenity.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')))

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
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
                            <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" style={{ height: "50vh" }}>
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
                                                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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

                                <Listbox value={amenities} onChange={setAmenities}>
                                    {({ open }) => (
                                        <>
                                            <div className="mt-1 relative">
                                                <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                    <span className="block truncate">{amenities[0].name}</span>
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
                                                                        active
                                                                            ? 'text-white bg-teal-600'
                                                                            : 'text-gray-900',
                                                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                    )
                                                                }
                                                                value={amenity.name}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span
                                                                            className={classNames(
                                                                                selected ? 'font-semibold' : 'font-normal',
                                                                                'block truncate'
                                                                            )}
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

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={() => {
                                            console.log(orderOption);
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
