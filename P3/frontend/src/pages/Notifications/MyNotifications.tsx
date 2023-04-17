import React, { useEffect, useState } from 'react';
import NotificationCard from '../../components/Card/NotificationCard';
import Navbar from "../../components/Navbar";
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { Notification } from '../../assets/types/Notification';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function MyNotifications() {
    const [data, setData] = useState<any>('');
    const [tokens, setTokens] = useState<{ access: string, refresh: string }>({access: '', refresh: ''});
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<any>([]);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);

    async function GetNotifications(): Promise<any> {
        try {
			const response = await fetch(`/notifications/all`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				}
			});

			if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				const data = await response.json();

				if (JSON.stringify(notifications) !== JSON.stringify(data.data)) {
					setNotifications(data.data);
				}
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

    async function handleNotificationSelect(notification: Notification): Promise<any> {
        setSelectedNotification(notification);
        var notificationJson = JSON.stringify({
            title: notification.title,
            description: notification.description,
            status: 'Read',
        })
        if (notification.url) {
            let newObject = Object.assign({}, JSON.parse(notificationJson), {["url"]: notification.url});
            notificationJson = JSON.stringify(newObject);
        }
        if (notification.host_id) {
            let newObject = Object.assign({}, JSON.parse(notificationJson), {["host_id"]: notification.host_id});
            notificationJson = JSON.stringify(newObject);
        }
        if (notification.user_id) {
            let newObject = Object.assign({}, JSON.parse(notificationJson), {["user_id"]: notification.user_id});
            notificationJson = JSON.stringify(newObject);
        }
        try {
			const response = await fetch(`/notifications/${notification.id}/update/`, {
				method: "PATCH",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				},
                body: notificationJson
			});

			if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				GetNotifications();
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

    async function handleNotificationDelete(notification: Notification): Promise<any> {
        setSelectedNotification(null);
        try {
			const response = await fetch(`/notifications/${notification.id}/delete/`, {
				method: "DELETE",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				},
			});

			if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				GetNotifications();
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

    async function handleApproveCancellationRequest(notification: Notification): Promise<any> {
        setSelectedNotification(null);
        try {
			const response = await fetch(`/notifications/create/`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				},
                body: JSON.stringify({
                    title: 'Update on Cancellation Request',
                    description: 'Your cancellation request has been approved.',
                    status: 'Unread',
                    user_id: notification.user_id,
                    host_id: notification.host_id
                })
			});

			if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				try {
                    const response = await fetch(`/reservations/${notification.url}/update/`, {
                        method: "PUT",
                        headers: {
                            'Authorization': `Bearer ${tokens.access}`,
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            status: 'cancelled'
                        })
                    });
        
                    if (!response.ok) {
                        console.error('An error has occurred!');
                    } else {
                        handleNotificationDelete(notification);
                    }
                } catch (error) {
                    console.error('There was a problem with the fetch request:');
                    throw error;
                }
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

    async function handleDenyCancellationRequest(notification: Notification): Promise<any> {
        setSelectedNotification(null);
        console.log('here');
        try {
			const response = await fetch(`/notifications/create/`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${tokens.access}`,
					'Content-type': 'application/json'
				},
                body: JSON.stringify({
                    title: 'Update on Cancellation Request',
                    description: 'Your cancellation request has been denied. Please contact the host for more information.',
                    status: 'Unread',
                    user_id: notification.user_id,
                    host_id: notification.host_id
                })
			});

            console.log(response);
			if (!response.ok) {
				console.error('An error has occurred!');
			} else {
				handleNotificationDelete(notification);
			}
		} catch (error) {
			console.error('There was a problem with the fetch request:');
			throw error;
		}
    }

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
			GetNotifications();
		}		
	}, [data, tokens])

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
        <Navbar currentLocation='/mynotifications' firstName={data.first_name} />
        <div className="">
            <h1 className="text-left text-2xl font-bold text-teal-700 sm:text-3xl">Unread Notifications</h1>
            <div style={{ overflowX: 'scroll', display: 'flex', flexDirection: 'row' }}>
                {notifications.filter((notification: any) => {return notification.status === 'Unread'}).map((notification: any) => {
                    return (
                        <NotificationCard
                            notification={notification}
                            setSelectedNotification={() => handleNotificationSelect(notification)}
                            selected={false}
                            handleNotificationDelete={() => handleNotificationDelete(notification)}
                            handleApproveCancellationRequest={() => handleApproveCancellationRequest(notification)}
                            handleDenyCancellationRequest={() => handleDenyCancellationRequest(notification)}
                        />
                    )
                })}
            </div>
            <h1 className="text-left text-2xl font-bold text-teal-700 sm:text-3xl">Read Notifications</h1>
            <div style={{ overflowX: 'scroll', display: 'flex', flexDirection: 'row' }}>
                    {notifications.filter((notification: any) => {return notification.status === 'Read'}).map((notification: any) => {
                        return (
                            <NotificationCard
                                notification={notification}
                                setSelectedNotification={() => {setSelectedNotification(notification)}}
                                selected={false}
                                handleNotificationDelete={() => handleNotificationDelete(notification)}
                                handleApproveCancellationRequest={() => handleApproveCancellationRequest(notification)}
                                handleDenyCancellationRequest={() => handleDenyCancellationRequest(notification)}
                            />
                        )
                    })}
            </div>
            <Modal
                open={selectedNotification !== null}
                onClose={() => {setSelectedNotification(null)}}
            >
                <Box sx={style}>
                    <NotificationCard
                        notification={selectedNotification}
                        setSelectedNotification={() => {setSelectedNotification(null)}}
                        selected={true}
                        handleNotificationDelete={() => handleNotificationDelete(selectedNotification)}
                        handleApproveCancellationRequest={() => handleApproveCancellationRequest(selectedNotification)}
                        handleDenyCancellationRequest={() => handleDenyCancellationRequest(selectedNotification)}
                    />
                </Box>
            </Modal>
        </div>
    </>
}