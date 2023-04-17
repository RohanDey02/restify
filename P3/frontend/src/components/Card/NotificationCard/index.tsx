import React, { useEffect, useState } from 'react';
import { Notification } from '../../../assets/types/Notification';

function NotificationCard(props: { notification: Notification, setSelectedNotification: any, selected: boolean, handleNotificationDelete: any, handleApproveCancellationRequest: any, handleDenyCancellationRequest: any }) {    
    
    return (
        <div className="block rounded-lg p-4 shadow-sm shadow-indigo-100 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-500">{props.notification.title}</p>
                {props.selected ? <p className="text-sm text-gray-500">{props.notification.description}</p> : null}
                {!props.selected ?
                    <button 
                        onClick={() => props.setSelectedNotification()}
                        className="hidden rounded-md transition sm:block bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                        >
                        Expand Notification
                    </button> 
                    : 
                    props.notification.title === 'Cancellation Request' ?
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <button 
                            onClick={() => props.handleDenyCancellationRequest()}
                            className="hidden rounded-md transition sm:block bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                            >
                            Deny
                        </button>
                        <button 
                            onClick={() => props.handleApproveCancellationRequest()}
                            className="hidden rounded-md transition sm:block bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                            >
                            Approve
                        </button>
                    </div>
                    :
                    <button 
                        onClick={() => props.handleNotificationDelete()}
                        className="hidden rounded-md transition sm:block bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                        >
                        Delete Notification
                    </button>
                }
            </div>
        </div>
    );
}

export default NotificationCard;
