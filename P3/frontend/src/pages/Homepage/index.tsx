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
        locationState: this.props.locationState
    }

    async GetProperties(currentPage: number): Promise<any> {
        try {
            const response = await fetch(`/property/search/?page=${currentPage}&page_size=${this.state.pageSize}`, {
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

    HandleNavigate() {
        // TODO: Also set navigation path and then <Navigate to="PATH"> should change
        this.setState({ navigate: true });
    }

    CreateCards() {
        return this.state.data.map((val: Property) => {
            return (
                <PropertyCard id={val.id} title={val.title} location={val.location} description={val.description} max_number_of_guests={val.max_number_of_guests} price={val.price} amenities={val.amenities} host={val.host} images={val.images} />
            )
        })
    }

    render() {
        if (this.state.navigate) {
            this.setState({ navigate: false });
            return <Navigate to="/test" state={this.state} />
        }

        return <>
            <Navbar />

            <div className="flex justify-end gap-4 pr-4">
                <div className="sm:flex sm:gap-4">
                    <a
                        href="#"
                        className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                        onClick={() => this.setState({ show: true })}
                    >
                        Sort and Filter
                    </a>
                </div>
            </div>

            <SearchModal show={this.state.show} handleClose={() => this.setState({ show: false })} />

            <div className='cards-grid'>
                {this.CreateCards()}
            </div>
            <center style={{ paddingTop: "1rem" }}>
                <div className="inline-flex items-center justify-center gap-3">
                    <a
                        href="#"
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
                        onClick={() => {
                            if (this.state.currentPage > 1) {
                                this.setState({
                                    currentPage: this.state.currentPage - 1
                                });
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
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
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
                        onClick={() => {
                            if (this.state.currentPage < this.state.totalPages) {
                                this.setState({
                                    currentPage: this.state.currentPage + 1
                                });
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
                                clip-rule="evenodd" />
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
      <Homepage pageSize={props.pageSize} locationState={locationState} />
    );
  }

export default HomepageWrapper;
