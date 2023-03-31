import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Property } from '../../assets/types/Property';
import PropertyCard from '../../components/PropertyCard';
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
                console.log(queryUrl)
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
            <Navbar currentLocation='/home' state={this.state.locationState} />

            <div className="flex justify-end gap-4 pr-4">
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

function HomepageWrapper(props: { pageSize: number; }) {
    const locationState = useLocation().state;

    return (
        <Homepage pageSize={props.pageSize} locationState={{data: locationState.data, tokens: locationState.tokens}} />
    );
  }

export default HomepageWrapper;
