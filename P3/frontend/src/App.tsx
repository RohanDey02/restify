import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomepageWrapper from './pages/Homepage';
import Login from './pages/Login';
import Property from './pages/Property';
import Register from './pages/Register';
import InitialRating from './pages/InitialRating/InitialRating';
import MyReservations from './pages/Reservations/MyReservations';
import MyNotifications from './pages/Notifications/MyNotifications';
import AccountHome from './pages/AccountHome';
import UpdateAccount from './pages/UpdateAccount';
import ListingHome from './pages/ListingsHome';
import CreateListing from './pages/Listing/CreateListing';
import ManageListing from './pages/Listing/ManageListing';

function App() {
	return <>
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/home" element={<HomepageWrapper />} />
				<Route path="/account/home" element={<AccountHome />} />
				<Route path="/account/update" element={<UpdateAccount />} />
				<Route path="/listing/home" element={<ListingHome />} />
				<Route path="/listing/create" element={<CreateListing />} />
				<Route path="/listing/manage" element={<ManageListing />} />
				<Route path="/register" element={<Register />} />
				<Route path="/property" element={<Property />} />
				<Route path="/initialrating/:reservationId" element={<InitialRating />} />
				<Route path="/myreservations" element={<MyReservations />} />
				<Route path="/mynotifications" element={<MyNotifications />} />
			</Routes>
		</Router>
	</>
}

export default App;
