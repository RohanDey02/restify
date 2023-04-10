import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Property } from '../../assets/types/Property';
import PropertyCard from '../../components/Card/PropertyCard';
import SearchModal from '../../components/SearchModal';
import Navbar from '../../components/Navbar';

// Made with assistance from HyperUI: https://www.hyperui.dev/
class Homepage extends React.Component<any> {
    state = {
        currentPage: 1,
        data: [],
        pageSize: this.props.pageSize,
        show: false,
        totalPages: 1,
        navigate: false,
        locationState: this.props.locationState,
        searchModalState: ''
    }

    async GetProperties(currentPage: number): Promise<any> {
        try {
            // Process Search Data
            var modalState: any = this.state.searchModalState;
            var queryUrl: string = `/property/search/?page=${currentPage}&page_size=${this.state.pageSize}`;

            if (modalState !== '') {
                var amenities: string = modalState.amenities.map((x: { name: string; }) => x.name).join();
                var location: string = modalState.location;
                var max_number_of_guests: number = modalState.maxNumGuests;
                var min_price: number = modalState.minPrice;
                var max_price: number = modalState.maxPrice;
                var title: string = modalState.title;
                var start_availability: Date | string = modalState.availability.startDate;
                var end_availability: Date | string = modalState.availability.endDate;
                if (typeof start_availability !== 'string' && typeof end_availability !== 'string') {
                    start_availability.setHours(0, 0, 0, 0);
                    start_availability = start_availability.toISOString().split('T')[0]
                    end_availability.setHours(0, 0, 0, 0);
                    end_availability = end_availability.toISOString().split('T')[0]
                }
                var sort: string = modalState.sortOption.name;
                var order_by: string = modalState.orderOption.name;

                var searchParams: any = {
                    max_number_of_guests: max_number_of_guests,
                    min_price: min_price,
                    max_price: max_price,
                    start_availability: start_availability,
                    end_availability: end_availability
                };

                if (amenities !== 'None') {
                    searchParams.amenities = amenities;
                }

                if (location !== 'None') {
                    searchParams.location = location;
                }

                if (title !== '') {
                    searchParams.title = title;
                }

                if (sort !== 'None') {
                    searchParams.sort = sort;
                    searchParams.order_by = order_by;
                }

                queryUrl += "&" + new URLSearchParams(searchParams);
            }

            const response = await fetch(queryUrl, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.state.locationState.tokens.access}`,
                    'Content-type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (JSON.stringify(this.state.data) !== JSON.stringify(data.results)) {
                this.setState({
                    data: data.results,
                    totalPages: Math.ceil(data.count / this.state.pageSize)
                });
            }
        } catch (error) {
            console.error('There was a problem with the fetch request:', error);
            throw error;
        }
    }

    componentDidMount() {
        this.GetProperties(this.state.currentPage);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.props.currentPage !== prevProps.currentPage) {
            this.setState({
                currentPage: this.props.currentPage
            });
        }

        this.componentDidMount();
    }

    BlockCrashingFromNoNavigation(event: { preventDefault: () => void; }) {
        event.preventDefault();
    }

    HandleProcessModal = (data: any) => {
        this.setState({ searchModalState: data })
    }

    HandleNavigate() {
        // TODO: Also set navigation path and then <Navigate to="PATH"> should change
        this.setState({ navigate: true });
    }

    CreateCards() {
        return this.state.data.map((val: Property) => {
            return (
                <PropertyCard property={val} state={this.state.locationState} />
            )
        })
    }

    render() {
        if (this.state.navigate) {
            this.setState({ navigate: false });
            return <Navigate to="/test" state={this.state} />
        }

        return <>
            <Navbar currentLocation='/home' firstName={this.state.locationState.data.first_name} />

            <div className="flex justify-end gap-4 pr-4 pb-4">
                <div className="sm:flex sm:gap-4">
                    <a
                        href="#"
                        className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                        onClick={(event) => {
                            this.setState({ show: true });
                            this.BlockCrashingFromNoNavigation(event);
                        }}
                    >
                        Sort and Filter
                    </a>
                </div>
            </div>

            <SearchModal show={this.state.show} handleClose={() => this.setState({ show: false })} onModalSubmit={this.HandleProcessModal} />

            <div className='cards-grid'>
                {this.CreateCards()}
            </div>
            <center style={{ paddingTop: "1rem" }}>
                <div className="inline-flex items-center justify-center gap-3">
                    <a
                        href="#"
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                        onClick={(event) => {
                            if (this.state.currentPage > 1) {
                                this.setState({
                                    currentPage: this.state.currentPage - 1
                                });
                            }
                            this.BlockCrashingFromNoNavigation(event);
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
                        {this.state.currentPage}
                        <span className="mx-0.25">/</span>
                        {this.state.totalPages}
                    </p>

                    <a
                        href="#"
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                        onClick={(event) => {
                            if (this.state.currentPage < this.state.totalPages) {
                                this.setState({
                                    currentPage: this.state.currentPage + 1
                                });
                            }
                            this.BlockCrashingFromNoNavigation(event);
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
};

const HomepageWrapper = () => {
    const [data, setData] = useState<any>();
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>();
    const [isLoading, setIsLoading] = useState(true);

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
    
    var remPixels: number = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var gridWidth: number = window.innerWidth - remPixels;
    var numCards: number = Math.floor((gridWidth - remPixels) / (300 + remPixels));

    return (
        <Homepage pageSize={numCards * 2} locationState={{ data: data, tokens: tokens }} />
    );
}

export default HomepageWrapper;
