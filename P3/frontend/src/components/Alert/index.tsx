import React, { useState } from "react";

const Alert = (props: { flag: boolean, message: string, handleClose: () => void }) => {
    return props.flag ? (
        <div>
            <div className="flex items-center justify-center px-4 lg:px-0 py-6 smMax:pt-6 smMax:pb-4">
                <div id="alert" className={props.flag ? "transition duration-150 ease-in-out mx-auto py-3 px-4  dark:bg-gray-800 bg-white md:flex items-center justify-between shadow rounded smMax:w-full sm:w-full smMax:py-0 md:mx-4" : "transition duration-150 ease-in-out lg:w-11/12 mx-auto py-3 px-4  dark:bg-gray-800 bg-white md:flex items-center justify-between shadow rounded translate-hide"}>
                    <div className="sm:flex sm:items-start lg:items-center">
                        <div className="flex items-end">
                            <div className="mr-2 text-indigo-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
                                    <path className="heroicon-ui" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 9a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                                </svg>
                            </div>
                            <p className="mr-2 text-base font-bold text-gray-800 dark:text-gray-100">{props.message.startsWith("E") ? "Error" : "Success"}</p>
                        </div>
                        <div className="h-1 w-1 bg-gray-300 dark:bg-gray-700 rounded-full mr-2 hidden xl:block" />
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 pt-2 sm:pt-0 pb-2 sm:pb-0">{props.message.slice(2)}</p>
                    </div>
                    <div className="flex items-center justify-end sm:mt-4 md:mt-0 ml-4">
                        <div onClick={props.handleClose} className="cursor-pointer text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                <line x1={18} y1={6} x2={6} y2={18} />
                                <line x1={6} y1={6} x2={18} y2={18} />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                .translate-show{
                    transform : translateY(0%);
                }
                .translate-hide{
                    transform : translateY(18vh);
                }
                `}
            </style>
        </div>
    ) : null;
};

export default Alert;
