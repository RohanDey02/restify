import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BookingModal from '../../components/BookingModal';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import DefaultAvatar from '../../assets/images/default-avatar.png';
import NoImage from '../../assets/images/no-image.png';
import allAmenities from '../../assets/resources/Amenities';
import './style.css';

interface Item {
	id: number;
	name: string;
	value: string;
}

function Property() {
	const locationState: any = useLocation().state.locationState;
	const id: number = useLocation().state.id;
	const [host, setHost] = useState<string>('');
	const [property, setProperty] = useState<any>('');
	const [totalRating, setTotalRating] = useState<number>(5);
	const [images, setImages] = useState<any[]>([]);
	const [comments, setComments] = useState<any[]>([]);
	const [show, setShow] = useState<boolean>(false);
	const [searchModalState, setSearchModalState] = useState<any>('');
	const [bookingAlert, setBookingAlert] = useState<string>('');
	const [bookingAlertFlag, setBookingAlertFlag] = useState<boolean>(false);

	async function GetProperty(id: number): Promise<any> {
		try {
			const response = await fetch(`/property/${id}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${locationState.tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				setProperty('An error has occurred!');
			} else {
				const data = await response.json();

				if (JSON.stringify(property) !== JSON.stringify(data.data)) {
					setProperty(data.data);

					var dataImages: string[] = data.data.images;
					if (dataImages.length < 5) {
						const remainingImages = new Array(5 - dataImages.length).fill(NoImage);
						setImages([...dataImages, ...remainingImages]);
					} else {
						setImages(dataImages);
					}
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:', error);
			throw error;
		}
	};

	async function GetUser(username: string): Promise<any> {
		try {
			const response = await fetch(`/accounts/${username}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${locationState.tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				setHost('An error has occurred!');
			} else {
				const data = await response.json();

				if (host !== `${data.data.first_name} ${data.data.last_name}`) {
					setHost(`${data.data.first_name} ${data.data.last_name}`);
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:', error);
			throw error;
		}
	};

	async function GetRatings(id: number): Promise<any> {
		try {
			const response = await fetch(`/comments/${id}/allPropertyFeedbackComments`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${locationState.tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				setHost('An error has occurred!');
			} else {
				const data = await response.json();

				if (data.data.length !== 0) {
					var rating: number = data.data.map((x: { property_rating: any; }) => x.property_rating).reduce((partialSum: number, a: number) => partialSum + a, 0) / data.data.length;

					if (totalRating !== Math.round((rating + Number.EPSILON) * 100) / 100) {
						setTotalRating(Math.round((rating + Number.EPSILON) * 100) / 100);
					}
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:', error);
			throw error;
		}
	};

	async function GetComments(id: number): Promise<any> {
		try {
			const response = await fetch(`/comments/${id}/allPropertyFeedbackComments`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${locationState.tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				console.error('There was a problem with the fetch request:', response.status);
			} else {
				const data = await response.json();

				if (data.data.length !== 0) {
					var dataComments = data.data.map((x: { message: string; guest_info: { avatar: any; first_name: string, last_name: string } ; last_modified: any }) => {
						return {
							avatar: x.guest_info.avatar,
							message: x.message,
							first_name: x.guest_info.first_name,
							last_name: x.guest_info.last_name,
							last_modified: x.last_modified
						}
					})

					if (JSON.stringify(comments) !== JSON.stringify(dataComments)) {
						setComments(dataComments);
					}
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:', error);
			throw error;
		}
	};

	async function CreateReservation(id: number): Promise<any> {
		try {
			const response = await fetch(`/reservations/${id}/create/`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${locationState.tokens.access}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
                    start_date: searchModalState.date.startDate,
                    end_date: searchModalState.date.endDate
                })
			});

			if (!response.ok) {
				if (response.status == 400) {
					if (locationState.data.account_type == "Host") {
						setBookingAlert('E|A host cannot create reservations!');
					} else {
						setBookingAlert('E|The chosen dates are no longer available!');
					}
				} else {
					setBookingAlert('E|An unexpected error has occurred!');
				}
				setBookingAlertFlag(true);
			} else {
				const data = await response.json();
				var msg: string = `S|A booking has been made for ${property.title} from ${data.data.start_date} to ${data.data.end_date} for ${searchModalState.numGuests} guests for $${Math.round(searchModalState.totalPrice * 100) / 100}!`;

				if (data.data.length !== 0 && bookingAlert !== msg) {
					setBookingAlert(msg);
					setBookingAlertFlag(true);
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:', error);
			throw error;
		}
	};

	useEffect(() => {
		GetProperty(id);
		GetUser(property.owner);
		GetRatings(id);
		GetComments(id);
	})

	useEffect(() => {
		if (searchModalState !== '') {
			CreateReservation(id);
		}
	}, [searchModalState])

	function ProcessImages() {
		var flag: boolean = false;
		var tempImages = images;
		tempImages = tempImages.map((x: string) => {
			if (!flag) {
				flag = true;
				return <img className='listing-main-img' src={x} />
			} else {
				return <img src={x} />
			}
		});

		return tempImages.slice(0, 5);
	}

	function GenerateAmenities() {
		if (property.amenities !== undefined) {
			return property.amenities.split(",").map((amenity: string) => {
				var amenityObj: Item = allAmenities.filter((x) => x.name === amenity)[0];

				if (amenityObj !== undefined) {
					return <tr>
						<td className="pt-6">
							<div className="flex items-center text-sm smMax:text-md leading-none">
								<p className="font-semibold text-gray-800">{amenityObj.value}</p>
							</div>
						</td>
					</tr>
				} else {
					return <tr>
						<td className="pt-6">
							<div className="flex items-center text-sm smMax:text-md leading-none">
								<p className="font-semibold text-gray-800">{amenity}</p>
							</div>
						</td>
					</tr>
				}
			});
		}
	}

	function GenerateComments() {
		if (comments.length !== 0) {
			return comments.map((comment: { message: string; avatar: string; first_name: string; last_modified: string; last_name: string }) => {
				return <tr>
					<td className='pt-3'>
						<div className="flex items-center">
							<div className="rounded-sm p-2.5">
								<img className='comment-img' src={comment.avatar !== undefined ? comment.avatar : DefaultAvatar} />
							</div>
							<div className="pl-3">
								<div className="flex items-center text-sm leading-none">
									<p className="font-semibold text-gray-800">{comment.first_name} {comment.last_name}</p>
									<p className="text-blue-500 ml-3">{new Date(comment.last_modified).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
								</div>
								<p className="text-xs md:text-sm leading-none text-gray-600 mt-2">{comment.message}</p>
							</div>
						</div>
					</td>
				</tr>
			});
		}
	}

	const HandleProcessModal = (data: any) => {
		setSearchModalState(data);
	}

	function BlockCrashingFromNoNavigation(event: { preventDefault: () => void; }) {
		event.preventDefault();
	}

	return <>
		<Alert flag={bookingAlertFlag} message={bookingAlert} handleClose={() => setBookingAlertFlag(false)} />
		<Navbar currentLocation='/property' state={locationState} />
		<BookingModal show={show} handleClose={() => setShow(false)} onModalSubmit={HandleProcessModal} id={property.id} title={property.title} price={property.price} accessToken={locationState.tokens.access} />

		<div className='mx-4'>
			<div className="listing-image-grid">
				{ProcessImages()}
			</div>

			<div className="py-4 flex justify-between smMax:block">
				<div>
					<h1 className="text-3xl font-bold leading-tight text-gray-900">{property.title}</h1>
					<h2 className="mt-2 text-lg font-medium text-gray-500">
						${property.price}/night ~ Hosted By: {host}
						<span className="mt-2 text-lg font-medium text-gray-500"> ~ Located At: {property.location}</span>
						<span className="mt-2 text-lg font-medium text-gray-500"> ~ Rating: {totalRating}/5</span>
					</h2>
				</div>

				<div className='smMax:pt-4 smMax:pb-2'>
					<div className="flex justify-end gap-4 pr-4">
						<div className="sm:flex sm:gap-4">
							<a
								href="#"
								className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
								onClick={(event) => {
									setShow(true);
									BlockCrashingFromNoNavigation(event);
								}}
							>
								Book Now
							</a>
						</div>
					</div>
				</div>
			</div>

			<p className="text-md leading-tight text-gray-800 pb-2">{property.description}</p>

			<div className="pb-4">
				<div className="flex items-center border-b border-gray-200 justify-between py-2">
					<p className="text-lg smMax:text-lg lg:text-xl font-semibold leading-tight text-gray-800">Amenities</p>
				</div>
				<div>
					<table className="w-full whitespace-nowrap">
						<tbody>
							{GenerateAmenities()}
						</tbody>
					</table>
				</div>
			</div>

			<div className="pb-8">
				<div className="flex items-center border-b border-gray-200 justify-between py-2">
					<p className="text-lg smMax:text-lg lg:text-xl font-semibold leading-tight text-gray-800">Comments</p>
				</div>
				<div>
					<table className="w-full">
						<tbody>
							{GenerateComments()}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</>
}

export default Property;
