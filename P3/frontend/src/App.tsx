import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomepageWrapper from './pages/Homepage';
import Login from './pages/Login';
import Property from './pages/Property';
import Register from './pages/Register';
import MyReservations from './pages/Reservations/MyReservations';
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
				<Route path="/myreservations" element={<MyReservations />} />
			</Routes>
		</Router>
	</>
}

export default App;
