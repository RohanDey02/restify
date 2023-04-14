import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Datepicker from 'react-tailwindcss-datepicker';

// Headless UI: https://headlessui.com/
function BookingModal(props: { show: boolean; handleClose: any; onModalSubmit: (data: any) => void; id: number; title: string; price: number; accessToken: string }) {
    var { show, handleClose } = props;
    const serviceFeeRate: number = 1.07;
    const [numDays, setNumDays] = useState<number>(1);
    const [numWeekendDays, setNumWeekendDays] = useState<number>(1);
    const [basePrice, setBasePrice] = useState<number>(isNaN(props.price) ? 0 : props.price);
    const [totalPrice, setTotalPrice] = useState<number>(isNaN(props.price) ? 0 : basePrice * 1.13 * serviceFeeRate);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [discountType, setDiscountType] = useState<string>('');
    const [breakdown, setBreakdown] = useState<{ [key: string]: number }>({});
    const [numGuests, setNumGuests] = useState<number>(0);
    const [blockedDates, setBlockedDates] = useState<{ startDate: string, endDate: string }[]>([]);
    const [date, setDate] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const handleSetDate = (value: any) => {
        let tempStartDate: Date = new Date(value.startDate);
        tempStartDate.setDate(tempStartDate.getDate() + 1);
        let tempEndDate: Date = new Date(value.endDate);
        tempEndDate.setDate(tempEndDate.getDate() + 1);

        let dayBreakdown: { [key: string]: number } = {};
        let count: number = 0;

        while (tempStartDate <= tempEndDate) {
            if (tempStartDate.getDay() === 0 || tempStartDate.getDay() === 6) {
                dayBreakdown[tempStartDate.toDateString()] = Math.round(props.price * 1.1 * 100) / 100;
                count++;
            } else {
                dayBreakdown[tempStartDate.toDateString()] = Math.round(props.price * 100) / 100;
            }

            tempStartDate.setDate(tempStartDate.getDate() + 1);
        }

        setNumWeekendDays(count);
        setDate(value);
        setBreakdown(dayBreakdown);

        var days: number = Math.ceil((new Date(value.endDate).getTime() - new Date(value.startDate).getTime()) / (1000 * 3600 * 24)) + 1;
        var base: number = Object.values(dayBreakdown).reduce((acc: number, val: number) => acc + val, 0);
        var discountAmt: number = 0;
        var discount: string = '';
        
        if (days / 31 >= 1) {
            discount = 'Monthly';
            discountAmt = base * 0.10;
        } else if (days / 7 >= 1) {
            discount = 'Weekly';
            discountAmt = base * 0.05;
        }
        
        var total: number = (base - discountAmt) * 1.13 * serviceFeeRate;
        setNumDays(days);
        setBasePrice(base - discountAmt);
        setTotalPrice(total);
        setDiscountAmount(discountAmt);
        setDiscountType(discount);
    };

    const GetBlockedDates = async (): Promise<any> => {
        try {
            const response = await fetch(`/reservations/property/${props.id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${props.accessToken}`,
                    'Content-type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Network response was not ok');
            }

            const data = await response.json();
            var toBeSavedData: { startDate: string, endDate: string }[] = data.data.filter((x: { id: any; start_date: any; end_date: any; status: any; }) => x.status !== "Terminated" && x.status !== "Cancelled" ).map((x: { id: any; start_date: any; end_date: any; }) => {
                return {
                    startDate: x.start_date,
                    endDate: x.end_date
                }
            });

            if (JSON.stringify(blockedDates) !== JSON.stringify(toBeSavedData)) {
                setBlockedDates(toBeSavedData);
            }
        } catch (error) {
            console.log('There was a problem with the fetch request:');
        }
    }

    const CreateFormattedBreakdown = () => {
        var liBreakdown: any = [];

        for (const elem in breakdown) {
            liBreakdown.push(<li>{elem} - ${breakdown[elem]}</li>);
        }

        return liBreakdown;
    }

    useEffect(() => {
        GetBlockedDates();
    });

    return <Transition appear show={show} as={Fragment}>
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
                        <Dialog.Panel className="w-full myScreen:w-45v h-55v myScreen:h-50v transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                Book {props.title} at ${props.price}/night
                            </Dialog.Title>

                            <p className="text-sm text-gray-900 pt-4">
                                Number Of Guests:

                                <span className='pl-4 inline-flex gap-1'>
                                    <button
                                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                                        onClick={() => {
                                            if (numGuests <= 0) {
                                                setNumGuests(0);
                                            } else {
                                                setNumGuests(numGuests - 1);
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
                                            value={String(numGuests)}
                                            onChange={(event) => {
                                                if (Number.isInteger(Number(event.target.value))) {
                                                    setNumGuests(Number(event.target.value));
                                                }
                                            }}
                                        />
                                    </div>

                                    <button
                                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                                        onClick={() => {
                                            if (numGuests < 0) {
                                                setNumGuests(0);
                                            } else {
                                                setNumGuests(numGuests + 1);
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
                                </span>
                            </p>

                            <p className="text-sm text-gray-900">
                                Start and End Dates:

                                <span className='inline-flex mt-2 lg:w-1/3 w-full lgMax:rounded lgMax:border'>
                                    <Datepicker
                                        primaryColor='blue'
                                        value={date}
                                        onChange={handleSetDate}
                                        minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                        separator={"-"}
                                        disabledDates={blockedDates}
                                    />
                                </span>
                            </p>


                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900 py-4"
                            >
                                Price Breakdown
                            </Dialog.Title>

                            <h3 className='text-md font-semibold text-gray-900'>Rate:</h3>
                            <p className='pb-2'>${props.price}/night * {numDays - numWeekendDays} weekday night(s){numWeekendDays !== 0 ? ` and $${Math.round(props.price * 1.1 * 100) / 100}/night * ${numWeekendDays} weekend night(s)` : ""}</p>
                            <h3 className='text-md font-semibold text-gray-900'>Base Price:</h3>
                            <details className='pb-2'>
                                <summary>${Math.round(basePrice * 100) / 100}</summary>
                                <p className='text-xs md:text-sm leading-none text-gray-600 mt-2'>Cost Per Night:</p>
                                <ul className='text-xs md:text-sm leading-none text-gray-600 mt-2'>
                                    {CreateFormattedBreakdown()}
                                </ul>
                                {discountType !== '' ? <p className='text-xs md:text-sm leading-none text-gray-600 mt-2'>{discountType} Discount ({discountType === 'Monthly' ? '10%' : '5%'}): {Math.round(discountAmount * 100) / 100}</p> : <></>}
                                {/* TODO: Do it here */}
                            </details>
                            <h3 className='text-md font-semibold text-gray-900'>Total Price (Base Price x 13% HST x 7% Restify Service Rate):</h3>
                            <p className='pb-2'>${Math.round(totalPrice * 100) / 100}</p>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    onClick={() => {
                                        props.onModalSubmit({
                                            date: date,
                                            numGuests: numGuests,
                                            totalPrice: totalPrice
                                        });
                                        handleClose();
                                    }}
                                >
                                    Confirm Booking!
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>;
}

export default BookingModal;
