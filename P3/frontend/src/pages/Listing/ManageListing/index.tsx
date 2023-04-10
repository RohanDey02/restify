import React, { useEffect, useState } from 'react';
import { Property } from '../../../assets/types/Property';
import Navbar from '../../../components/Navbar';
import ManagePropertyCard from '../../../components/Card/ManagePropertyCard';
import Alert from '../../../components/Alert';

function ManageListing() {
    const [data, setData] = useState<any>('');
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>({ access: '', refresh: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const remPixels: number = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const gridWidth: number = window.innerWidth - remPixels;
    const pageSize: number = Math.floor((gridWidth - remPixels) / (300 + remPixels)) * 2;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [properties, setProperties] = useState<Property[]>([]);
    const [alertFlag, setAlertFlag] = useState<boolean>(false);
    const [resp, setResp] = useState<string>('');

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
        if (tokens.access !== '') {
            GetHostProperties();
            CreateCards();
        }
    }, [currentPage, data, tokens, resp])

    function GetHostProperties(): void {
        fetch(`/property/allHostProperty/?page=${currentPage}&page_size=${pageSize}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokens.access}`,
                'Content-type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            if (JSON.stringify(properties) != JSON.stringify(data.results)) {
                setProperties(data.results);
                setTotalPages(Math.ceil(data.count / pageSize));
            }
        }).catch((error) => {
            console.log("An error occurred with the fetch request!", error);
        });
    };

    function CreateCards() {
        return properties.map((val: Property) => {
            return (
                <ManagePropertyCard property={val} alertMessage={setResp} alertFlag={setAlertFlag} />
            )
        });
    }

    const BlockCrashingFromNoNavigation = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    }

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
        <Navbar currentLocation='/listing/manage' firstName={data.first_name} />

        <div className='cards-grid'>
            {CreateCards() !== undefined ? CreateCards() : <></>}
        </div>
        <center style={{ paddingTop: "1rem" }}>
            <div className="inline-flex items-center justify-center gap-3">
                <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                    onClick={(event) => {
                        if (currentPage > 1) {
                            setCurrentPage(currentPage - 1)
                        }
                        BlockCrashingFromNoNavigation(event);
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
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd" />
                    </svg>
                </a>

                <p className="text-xs">
                    {currentPage}
                    <span className="mx-0.25">/</span>
                    {totalPages}
                </p>

                <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                    onClick={(event) => {
                        if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                        }
                        BlockCrashingFromNoNavigation(event);
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
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd" />
                    </svg>
                </a>
            </div>
        </center>
    </>
}

export default ManageListing;