import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// Headless UI: https://headlessui.com/
function CommentsModal(props: { show: boolean; handleClose: any; onModalSubmit: (data: any) => void; propId: number; propTitle: string; propImage: string; commentData: { id: number, name: string, commenterUsername: string, propertyRating: number, avatar: any }; host: { hostUsername: string, host: string }; currentUsername: string; accessToken: string }) {
    var { show, handleClose } = props;
    const [reservationId, setReservationId] = useState<number>(0);
    const [lastSenderType, setLastSenderType] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [propertyConversationComments, setPropertyConversationComments] = useState<{ id: number, message: string, comment_type: string, sender_type: string, last_modified: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    function GetConversationLog(commentId: number): void {
        fetch(`/comments/${commentId}/reservation`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${props.accessToken}`,
                'Content-type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            setReservationId(data.data.reservation_id);

            return fetch(`/comments/${data.data.reservation_id}/allConversationComments`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${props.accessToken}`,
                    'Content-type': 'application/json'
                }
            });
        }).then(response => response.json())
        .then(otherData => {
            setPropertyConversationComments(otherData.data);
            setLastSenderType(otherData.data.at(-1).sender_type);
        }).catch(() => {
            console.error('There was a problem with the fetch request:');
        });
    };

    async function PostReply() {
        try {
            const response = await fetch(`/comments/create/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${props.accessToken}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    property_id: props.propId,
                    reservation_id: reservationId
                })
            });

            if (!response.ok) {
                console.error('There was a problem with the fetch request:', response.status);
            } else {
                const data = await response.json();

                if (data.data.length !== 0) {
                    var newData: {id: number, message: string, comment_type: string, sender_type: string, last_modified: string} = {
                        id: data.data.id,
                        message: data.data.message,
                        comment_type: data.data.comment_type,
                        sender_type: data.data.sender_type,
                        last_modified: data.data.last_modified
                    }

                    if (JSON.stringify(propertyConversationComments) !== JSON.stringify([...propertyConversationComments, newData])) {
                        setPropertyConversationComments([...propertyConversationComments, newData]);
                        setLastSenderType(newData.sender_type);
                    }
                }
            }
        } catch (error) {
            console.error('There was a problem with the fetch request:');
            throw error;
        }
    }

    useEffect(() => {
        GetConversationLog(props.commentData.id);
        setIsLoading(false);
    }, [props.commentData]);

    const GenerateComments = () => {
        if (props.currentUsername === props.host.hostUsername) {
            return propertyConversationComments.map((comment) => comment.sender_type === "host" ? <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                    <div>
                        <div className="bg-teal-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm">{comment.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 leading-none">{new Date(comment.last_modified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                    </div>
                    <img className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" src={props.propImage} />
                </div> : <div className="flex w-full mt-2 space-x-3 max-w-xs">
                    <img className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" src={props.commentData.avatar} />
                    <div>
                        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                            <p className="text-sm">{comment.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 leading-none">{new Date(comment.last_modified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                    </div>
                </div>
            )
        } else {
            return propertyConversationComments.map((comment) => comment.sender_type === "guest" ? <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                    <div>
                        <div className="bg-teal-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm">{comment.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 leading-none">{new Date(comment.last_modified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                    </div>
                    <img className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" src={props.commentData.avatar} />
                </div> : <div className="flex w-full mt-2 space-x-3 max-w-xs">
                    <img className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" src={props.propImage} />
                    <div>
                        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                            <p className="text-sm">{comment.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 leading-none">{new Date(comment.last_modified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                    </div>
                </div>
            )
        }
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
                                Conversation - {props.propTitle} and {props.commentData.name}
                            </Dialog.Title>
                            <Dialog.Title
                                as="h4"
                                className="text-md font-medium leading-6 text-gray-900"
                            >
                                Rating - {props.commentData.propertyRating}/5
                            </Dialog.Title>

                            <div className="w-full bg-white rounded-lg pt-4">
                                {GenerateComments()}

                                {props.currentUsername === props.commentData.commenterUsername || props.currentUsername === props.host.hostUsername ?
                                    <div className="mt-4 grid-cols-4 grid gap-4 rounded-md">
                                        <input
                                            className="flex items-center h-10 w-full rounded px-3 text-sm col-span-3 border-2 border-blue-200"
                                            type="text"
                                            placeholder={(lastSenderType === "guest" && props.currentUsername === props.commentData.commenterUsername) || (lastSenderType === "host" && props.currentUsername === props.host.hostUsername) ? "You cannot send more than 1 message at a time..." : "Type your message..."}
                                            disabled={(lastSenderType === "guest" && props.currentUsername === props.commentData.commenterUsername) || (lastSenderType === "host" && props.currentUsername === props.host.hostUsername)}
                                            onChange={(event) => setMessage(event.target.value)}
                                            value={String(message)}
                                        />
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md col-span-1 border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => {
                                                if ((lastSenderType === "guest" && props.currentUsername === props.commentData.commenterUsername) || (lastSenderType === "host" && props.currentUsername === props.host.hostUsername)) {
                                                    handleClose();
                                                } else {
                                                    PostReply();
                                                    setMessage('');
                                                }
                                            }}
                                        >
                                            {(lastSenderType === "guest" && props.currentUsername === props.commentData.commenterUsername) || (lastSenderType === "host" && props.currentUsername === props.host.hostUsername) ? "Close" : "Send"}
                                        </button>
                                    </div> : <></>}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>;
}

export default CommentsModal;
