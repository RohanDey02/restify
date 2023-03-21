import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';

function App() {
	return <>
		<Router>
			<Routes>
				<Route path="/" element={<Homepage pageSize={10} />} />
				<Route path="/test" element={<Homepage pageSize={10} />} />
			</Routes>
		</Router>
	</>
}

export default App;
