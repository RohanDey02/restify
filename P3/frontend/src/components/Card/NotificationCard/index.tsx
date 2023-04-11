import React, { useEffect, useState } from 'react';
import { Notification } from '../../../assets/types/Notification';

function NotificationCard(props: { notification: Notification, setSelectedNotification: any, selected: boolean, handleNotificationDelete: any }) {    
    
    return (
        <div className="block rounded-lg p-4 shadow-sm shadow-indigo-100 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-500">{props.notification.title}</p>
                <p className="text-sm text-gray-500">{props.notification.description}</p>
                {!props.selected ?
                    <button onClick={() => props.setSelectedNotification()}>Expand Notification</button> 
                    : 
                    <button onClick={() => props.handleNotificationDelete()}>Delete Notification</button>
                }
            </div>
        </div>
    );
}

export default NotificationCard;
