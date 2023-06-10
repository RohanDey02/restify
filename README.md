# Restify

Restify is an Airbnb clone developed as a project for CSC309H1: Programming on the Web at the University of Toronto. It is built using a frontend in React TypeScript, a backend in Django Rest Framework (Python), and incorporates Tailwind for styling.

## Features

- User authentication: Register, login, and logout functionality.
- Property listings: Users can create, update, and delete property listings, including details such as title, description, price, location, and images.
- Search and filtering: Users can search for properties based on location, price, and other criteria.
- Booking management: Users can make bookings for available properties and manage their bookings.
- Reviews and ratings: Users can leave reviews and ratings for properties they have booked.
- User profiles: Users can view and update their profiles, including profile picture, contact information, and bio.

## Technologies Used

- Frontend: React TypeScript
- Backend: Django Rest Framework (Python)
- Documentation: Swagger
- Styling: Tailwind CSS

## Installation

### Prerequisites

- Node.js (v14 or later)
- Python (v3.6 or later)
- PostgreSQL

### Backend Setup

1. Clone the repository:
```sh
git clone <repository-url>
```
2. Change to the backend directory:
```sh
cd restify/backend
```
3. Create and activate a virtual environment:
```sh
python -m venv env
source env/bin/activate
```
4. Install the required Python dependencies:
```sh
pip install -r packages.txt
```
5. Apply database migrations:
```sh
python manage.py migrate
```
6. Start the backend server:
```sh
python manage.py runserver
```

The backend server should now be running on `http://localhost:8000`.

### Frontend Setup

1. Change to the frontend directory:
```sh
cd ../frontend
```
2. Install the required Node.js dependencies:
```sh
npm install
```
3. Start the frontend development server:
```sh
npm start
```

The frontend development server should now be running on `http://localhost:3000`.

## Documentation

Documentation is available in `P2/restify/documentation.yaml` and was created using Swagger. Alternatively, it is available at `P2/restify/docs.pdf`.

## Usage

1. Open your web browser and navigate to `http://localhost:3000` to access the Restify application.

2. Register a new user account or log in with an existing account.

3. Explore the available property listings, search for properties, and make bookings.

4. Manage your bookings, leave reviews, and update your user profile as needed.

## Acknowledgments

- [University of Toronto](https://www.utoronto.ca/) - For the CSC309H1 (Programming on the Web) course.
- The open-source contributors of the used technologies.
