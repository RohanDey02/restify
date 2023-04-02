import React from 'react';
import Navbar from '../../components/Navbar';
import { useLocation } from 'react-router-dom';
import Card from '../../components/Card';
import Default from '../../assets/images/default-avatar.png';
import PersonalInfoCardImage from '../../assets/images/PersonalInfoCardImage.jpg';

function AccountHome() {
    const locationState: any = useLocation().state;

    return <>
        {/* <Navbar currentLocation='/account/home' first_name={locationState} /> */}
        <h1>Account</h1>
        <p>{locationState.data.first_name} {locationState.data.last_name}, {locationState.data.email}</p>
        
        <div className='cards-grid'>
            <Card description='Update your personal data' destination='/account/home' image={PersonalInfoCardImage} state={locationState} title='Personal Information' />
            <Card description='Check the status and details of existing and potential reservations' destination='/account/home' image={PersonalInfoCardImage} state={locationState} title='Reservations' />
        </div>
    </>
}

export default AccountHome;
