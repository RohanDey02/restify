import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BookingModal from '../../components/BookingModal';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import DefaultAvatar from '../../assets/images/default-avatar.png';
import NoImage from '../../assets/images/no-image.png';
import allAmenities from '../../assets/resources/Amenities';
import './style.css';
import CommentsModal from '../../components/CommentsModal';

interface Item {
	id: number;
	name: string;
	value: string;
}

function Property() {
	const [data, setData] = useState<any>('');
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>({access: '', refresh: ''});
    const [isLoading, setIsLoading] = useState(true);

	const id: number = useLocation().state;
	const [host, setHost] = useState<string>('');
	const [hostUsername, setHostUsername] = useState<string>('');
	const [property, setProperty] = useState<any>('');
	const [totalRating, setTotalRating] = useState<number>(5);
	const [images, setImages] = useState<any[]>([]);
	const [comments, setComments] = useState<any[]>([]);
	const [paginatedComments, setPaginatedComments] = useState<any[]>([]);
	const [show, setShow] = useState<boolean>(false);
	const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
	const [showCommentData, setShowCommentData] = useState<{id: number, name: string, commenterUsername: string, propertyRating: number, avatar: any}>({id: -1, name: "None", commenterUsername: "None", propertyRating: -1, avatar: "None"});

	const [currentCommentsPage, setCurrentCommentsPage] = useState<number>(1);
	const currentCommentsPageSize: number = 5;
	const [totalCommentsPage, setTotalCommentsPage] = useState<number>(1);

	const [searchModalState, setSearchModalState] = useState<any>('');
	const [bookingAlert, setBookingAlert] = useState<string>('');
	const [bookingAlertFlag, setBookingAlertFlag] = useState<boolean>(false);

	async function GetProperty(id: number): Promise<any> {
		try {
			const response = await fetch(`/property/${id}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
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
			console.error('There was a problem with the fetch request:');
			throw error;
		}
	};

	async function GetUser(username: string): Promise<any> {
		try {
			const response = await fetch(`/accounts/${username}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				setHost('An error has occurred!');
			} else {
				const data = await response.json();

				if (host !== `${data.data.first_name} ${data.data.last_name}`) {
					setHost(`${data.data.first_name} ${data.data.last_name}`);
					setHostUsername(data.data.username);
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request');
			throw error;
		}
	};

	async function GetRatings(id: number): Promise<any> {
		try {
			const response = await fetch(`/comments/${id}/allPropertyFeedbackComments`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
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
			console.error('There was a problem with the fetch request:');
			throw error;
		}
	};

	async function GetComments(id: number): Promise<any> {
		try {
			const response = await fetch(`/comments/${id}/allPropertyFeedbackComments`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				console.error('There was a problem with the fetch request:', response.status);
			} else {
				const data = await response.json();

				if (data.data.length !== 0) {
					var dataComments = data.data.map((x: { id: number, message: string; property_rating: number; guest_info: { username: any; avatar: any; first_name: string, last_name: string } ; last_modified: any }) => {
						return {
							id: x.id,
							commenterUsername: x.guest_info.username,
							avatar: x.guest_info.avatar,
							message: x.message,
							property_rating: x.property_rating,
							first_name: x.guest_info.first_name,
							last_name: x.guest_info.last_name,
							last_modified: x.last_modified
						}
					})

					if (JSON.stringify(comments) !== JSON.stringify(dataComments)) {
						setComments(dataComments);
						setPaginatedComments(dataComments.slice(0, currentCommentsPageSize));
						console.log(dataComments.slice(0, currentCommentsPageSize));
						setTotalCommentsPage(Math.ceil(data.count / currentCommentsPageSize));
					}
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
	};

	async function CreateReservation(id: number): Promise<any> {
		try {
			const response = await fetch(`/reservations/${id}/create/`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
                    start_date: searchModalState.date.startDate,
                    end_date: searchModalState.date.endDate
                })
			});

			if (!response.ok) {
				if (response.status === 400) {
					if (data.account_type === "Host") {
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
			console.error('There was a problem with the fetch request:');
			throw error;
		}
	};

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
	}, [])

	useEffect(() => {
		if (data !== '' && JSON.stringify(tokens) !== JSON.stringify({access: '', refresh: ''})) {
			GetProperty(id);
			GetRatings(id);
			GetComments(id);
		}		
	}, [data, tokens])

	useEffect(() => {
		setPaginatedComments(comments.slice((currentCommentsPage - 1) * currentCommentsPageSize, (currentCommentsPage - 1) * currentCommentsPageSize + (currentCommentsPageSize)))
	}, [currentCommentsPage])

	useEffect(() => {
		if (property !== '') {
			GetUser(property.owner);
		}
	}, [property])

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
		if (paginatedComments.length !== 0) {
			return paginatedComments.map((comment: { id: number; commenterUsername: string; message: string; property_rating: number; avatar: string; first_name: string; last_modified: string; last_name: string }) => {
				var commentId: string = `comment-${comment.id}`;

				return <tr className={commentId} onClick={() => HandleOpenCommentModal(comment.id, `${comment.first_name} ${comment.last_name}`, comment.commenterUsername, comment.property_rating, comment.avatar !== undefined ? comment.avatar : DefaultAvatar)}>
					<td className='pt-3'>
						<div className="flex items-center hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)] hover:cursor-pointer rounded-lg">
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

	const HandleOpenCommentModal = (id: number, name: string, commenterUsername: string, property_rating: number, avatar: any) => {
		setShowCommentData({id: id, name: name, commenterUsername: commenterUsername, propertyRating: property_rating, avatar: avatar})
		setShowCommentsModal(true);
	}

	const HandleProcessModal = (data: any) => {
		setSearchModalState(data);
	}

	function BlockCrashingFromNoNavigation(event: { preventDefault: () => void; }) {
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
		<Alert flag={bookingAlertFlag} message={bookingAlert} handleClose={() => setBookingAlertFlag(false)} />
		<Navbar currentLocation='/property' firstName={data.first_name} />
		<BookingModal show={show} handleClose={() => setShow(false)} onModalSubmit={HandleProcessModal} id={property.id} title={property.title} price={property.price} accessToken={tokens.access} />
		<CommentsModal show={showCommentsModal} handleClose={() => setShowCommentsModal(false)} onModalSubmit={HandleProcessModal} propId={property.id} propTitle={property.title} propImage={images[0]} commentData={showCommentData} host={{hostUsername, host}} currentUsername={data.username} accessToken={tokens.access} />

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
							{data.username !== hostUsername ? <a
								href="#"
								className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
								onClick={(event) => {
									setShow(true);
									BlockCrashingFromNoNavigation(event);
								}}
							>
								Book Now
							</a> : <></>}
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

			{/* Pagination */}
			<div className="inline-flex items-center justify-center pb-4 gap-3">
				<a
					href="#"
					className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
					onClick={(event) => {
						if (currentCommentsPage > 1) {
							setCurrentCommentsPage(currentCommentsPage - 1);
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
					{currentCommentsPage}
					<span className="mx-0.25">/</span>
					{totalCommentsPage}
				</p>

				<a
					href="#"
					className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
					onClick={(event) => {
						if (currentCommentsPage < totalCommentsPage) {
							setCurrentCommentsPage(currentCommentsPage + 1);
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
		</div>
	</>
}

export default Property;
