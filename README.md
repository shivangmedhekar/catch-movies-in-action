# Catch Movies in Action (CMA)

**CMA** is a comprehensive web application designed to help users find information about their favorite movies, browse showtimes, select seats, and manage their profiles securely. The application leverages modern technologies such as Node.js, Express.js, MongoDB, and Handlebars.js to deliver a seamless and secure user experience. This project showcases robust backend architecture, including user authentication, session management, and integration with external APIs for movie data.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Backend Modules](#backend-modules)
  - [Configuration](#configuration)
  - [Data Access Layer](#data-access-layer)
  - [User Management](#user-management)
  - [Movie Management](#movie-management)
  - [Theater Management](#theater-management)
  - [Showtime Management](#showtime-management)
  - [Order Processing](#order-processing)
  - [Seat Selection](#seat-selection)
- [API Endpoints](#api-endpoints)
  - [Home Routes](#home-routes)
  - [Authentication Routes](#authentication-routes)
  - [User Routes](#user-routes)
  - [Movie Routes](#movie-routes)
  - [Theater Routes](#theater-routes)
  - [Showtime Routes](#showtime-routes)
  - [Seat Selection Routes](#seat-selection-routes)
  - [Order Routes](#order-routes)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [License](#license)
- [Contributing](#contributing)
- [Bugs](#bugs)
- [Author](#author)

## Features

- **User Authentication**: Secure user registration and login with password hashing.
- **Session Management**: Manage user sessions securely using `express-session`.
- **Movie Data Integration**: Fetch and manage movie data from IMDb and TMDB APIs.
- **Showtimes and Theaters**: Display showtimes for various theaters and manage seat availability.
- **Order Processing**: Handle movie ticket orders with real-time seat availability checks.
- **Secure Input Handling**: Protect against XSS attacks and ensure data validation.
- **Dynamic Views**: Render dynamic content using `express-handlebars`.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Templating Engine**: Handlebars.js
- **Authentication**: bcrypt, express-session
- **HTTP Client**: Axios
- **Security**: dotenv, xss
- **Others**: imdb-id, mongodb

## Prerequisites

- **Node.js**: Version `18.x`
- **MongoDB**: Access to a MongoDB instance (e.g., MongoDB Atlas)
- **API Keys**:
  - **AMC Vendor Key**: For accessing AMC APIs
  - **TMDB API Key**: For fetching movie details
  - **OMDB API Key**: For additional movie data

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shivangmedhekar/CMA.git
   cd CMA
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```env
PORT=3000
SESSION_SECRET=your_secret_key_here
ATLAS_SERVER_URL=your_mongodb_connection_string
ATLAS_DATABASE=your_database_name
X_AMC_VENDOR_KEY=your_amc_vendor_key
TMDB_API_KEY=your_tmdb_api_key
OMDB_API_KEY=your_omdb_api_key
```

- **PORT**: The port on which the server will run (default is `3000`).
- **SESSION_SECRET**: A secret key for session encryption.
- **ATLAS_SERVER_URL**: MongoDB connection string.
- **ATLAS_DATABASE**: Name of the MongoDB database.
- **X_AMC_VENDOR_KEY**: API key for AMC services.
- **TMDB_API_KEY**: API key for The Movie Database.
- **OMDB_API_KEY**: API key for the Open Movie Database.

## Running the Application

Start the server using the following command:

```bash
npm start
```

The server will be running at `http://localhost:3000`.

## Project Structure

```
CMA/
├── config/
│   ├── mongoConnection.js
│   └── mongoCollections.js
├── data/
│   ├── checkout.js
│   ├── movies.js
│   ├── seatselection.js
│   ├── showtimes.js
│   ├── theater.js
│   └── user.js
├── routes/
│   ├── auth.js
│   ├── checkout.js
│   ├── home.js
│   ├── movie.js
│   ├── seatselection.js
│   ├── showtimes.js
│   ├── theater.js
│   ├── users.js
│   └── index.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── pages/
│   │   ├── error/
│   │   │   └── error.handlebars
│   │   ├── home/
│   │   │   ├── home.handlebars
│   │   │   ├── nowplaying.handlebars
│   │   │   └── upcoming.handlebars
│   │   ├── checkout/
│   │   │   └── confirm-purchase.handlebars
│   │   └── ... (other page templates)
│   └── ... (other view templates)
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── index.js
├── package.json
└── README.md
```

## Backend Modules

### Configuration

#### `config/mongoConnection.js`

Handles the connection to the MongoDB database using the MongoDB Node.js driver.

- **Functions**:
  - **dbConnection**: Establishes and returns a connection to the MongoDB database.

#### `config/mongoCollections.js`

Provides access to different MongoDB collections used in the application.

- **Functions**:
  - **getCollectionFn**: Returns a function that provides a reference to a specified collection.
- **Exports**:
  - `movies`, `theaters`, `showtimes`, `orders`, `users`: Functions to access respective collections.

### Data Access Layer

#### `data/checkout.js`

Manages the checkout process for movie ticket orders.

- **Functions**:
  - **checkout(orderSummary, user)**: Processes an order by checking seat availability, inserting the order, and updating seat availability.
  - **checkSeatsAvailability(showtimeId, seats)**: Verifies if the requested seats are available.
  - **updateMovieAvailability(showtimeId, seats)**: Updates the seat availability after a successful order.

#### `data/movies.js`

Manages movie data, including fetching from external APIs and storing in the database.

- **Functions**:
  - **getAllMovies()**: Retrieves a list of all movies from the database.
  - **getMovieById(movieId)**: Fetches movie details by its AMC ID.
  - **getMovieNameById(movieId)**: Retrieves the movie name using its AMC ID.
  - **getMovieBySlug(slug)**: Fetches detailed movie information using its slug from the AMC API.
  - **getMovies(pageSize, view, latestMovies)**: Retrieves movies based on pagination and view parameters, optionally returning the latest releases.
- **Notes**:
  - Integrates with IMDb and TMDB APIs to enrich movie data.
  - Handles insertion of new movies into the database if they do not exist.

#### `data/seatselection.js`

Provides seat layout configurations based on auditorium formats.

- **Functions**:
  - **getAudiLayout(format)**: Returns the seating layout matrix for a given auditorium format (e.g., Digital, IMAX).

#### `data/showtimes.js`

Handles showtime-related operations, including fetching showtimes and managing their details.

- **Functions**:
  - **clearOldShowtime()**: Removes outdated showtimes from the database.
  - **getShowsOfMovie(theaterId, slug, searchDate)**: Retrieves showtimes for a specific movie at a theater on a given date.
  - **getShowsDetails(showtimeId)**: Fetches detailed information for a specific showtime.
  - **setAudiAvailability(format)**: Initializes seat availability based on auditorium format.

#### `data/theater.js`

Manages theater information, including fetching from external APIs and storing in the database.

- **Functions**:
  - **getAllTheaters()**: Retrieves a list of all theaters from the AMC API.
  - **getTheaterById(theaterId)**: Fetches detailed information for a specific theater.
  - **getTheaterNameById(theaterId)**: Retrieves the theater name using its ID from the database.

#### `data/user.js`

Handles user-related operations such as registration, authentication, and retrieving order history.

- **Functions**:
  - **createUser(firstName, lastName, email, phoneNo, dob, password, confirmPassword)**: Registers a new user with validation and password hashing.
  - **checkUser(email, password)**: Authenticates a user by verifying email and password.
  - **getOrderHistory(userId)**: Retrieves the order history for a specific user.
  - **ValidateEmail(email)**: Utility function to validate email format.

### API Endpoints

*Note: The following endpoints are based on the route configurations defined in the `routes` folder. Ensure that the actual implementation in each route file aligns with these descriptions.*

#### Home Routes

- **`GET /`**
  - **Description**: Displays the home page with a list of currently available movies.
  - **Functionality**:
    - Clears old showtime data from the database.
    - Fetches now-playing and upcoming movies.
    - Renders the home page with movie data.

- **`GET /nowplaying`**
  - **Description**: Displays a list of all now-playing movies.
  - **Functionality**:
    - Retrieves now-playing movies.
    - Renders the now-playing movies page.

- **`GET /upcoming`**
  - **Description**: Displays a list of all upcoming movies.
  - **Functionality**:
    - Retrieves upcoming movies.
    - Renders the upcoming movies page.

#### Authentication Routes

- **`POST /auth/signup`**
  - **Description**: Registers a new user.
  - **Body Parameters**:
    - `firstName`: User's first name.
    - `lastName`: User's last name.
    - `email`: User's email address.
    - `phoneNo`: User's phone number.
    - `dob`: User's date of birth.
    - `password`: User's password.
    - `confirmPassword`: Confirmation of the user's password.
  - **Functionality**:
    - Validates input data.
    - Creates a new user with hashed password.
    - Returns the created user upon successful registration.

- **`POST /auth/login`**
  - **Description**: Authenticates a user.
  - **Body Parameters**:
    - `email`: User's email address.
    - `password`: User's password.
  - **Functionality**:
    - Validates input data.
    - Checks user credentials.
    - Creates a user session upon successful authentication.
    - Returns the authenticated user.

- **`GET /auth/logout`**
  - **Description**: Logs out the authenticated user.
  - **Functionality**:
    - Destroys the user session.
    - Returns a success message upon successful logout.

- **`GET /auth/auth-status`**
  - **Description**: Checks the authentication status of the user.
  - **Functionality**:
    - Returns `authStatus: true` if the user is authenticated.
    - Returns `authStatus: false` if the user is not authenticated.

#### User Routes

- **`GET /profile`**
  - **Description**: Displays the authenticated user's profile.
  - **Authentication**: Required
  - **Functionality**:
    - Renders the user's profile page with user details.

- **`GET /profile/orders`**
  - **Description**: Retrieves the authenticated user's order history.
  - **Authentication**: Required
  - **Functionality**:
    - Fetches and displays the user's past ticket orders.

#### Movie Routes

- **`GET /movie`**
  - **Description**: Retrieves a list of all movies.
  - **Query Parameters**:
    - `pageSize`: Number of movies per page.
    - `view`: Type of view (e.g., now-playing, coming-soon).
    - `latestMovies`: Boolean indicating whether to include the latest releases.
  - **Functionality**:
    - Fetches movies based on query parameters.
    - Returns a list of movies.

- **`GET /movie/:id`**
  - **Description**: Retrieves details of a specific movie by AMC ID.
  - **Path Parameters**:
    - `id`: AMC ID of the movie.
  - **Functionality**:
    - Fetches and returns movie details for the specified ID.

- **`GET /movie/slug/:slug`**
  - **Description**: Retrieves movie details using its slug.
  - **Path Parameters**:
    - `slug`: Slug identifier for the movie.
  - **Functionality**:
    - Fetches detailed movie information using the slug.
    - Returns enriched movie data with additional details from external APIs.

#### Theater Routes

- **`GET /theater`**
  - **Description**: Retrieves a list of all theaters.
  - **Functionality**:
    - Fetches and returns a list of theaters.

- **`GET /theater/:id`**
  - **Description**: Retrieves details of a specific theater by ID.
  - **Path Parameters**:
    - `id`: ID of the theater.
  - **Functionality**:
    - Fetches and returns theater details for the specified ID.

#### Showtime Routes

- **`GET /showtimes/:theaterId/:slug/:date`**
  - **Description**: Retrieves showtimes for a specific movie at a theater on a given date.
  - **Path Parameters**:
    - `theaterId`: ID of the theater.
    - `slug`: Slug of the movie.
    - `date`: Date for which to retrieve showtimes.
  - **Functionality**:
    - Fetches and returns showtimes matching the criteria.

- **`GET /showtimes/details/:showtimeId`**
  - **Description**: Retrieves detailed information for a specific showtime.
  - **Path Parameters**:
    - `showtimeId`: ID of the showtime.
  - **Functionality**:
    - Fetches and returns detailed showtime information, including seat availability and ticket prices.

#### Seat Selection Routes

- **`GET /seatselection/:showtimeId`**
  - **Description**: Displays available seats for the selected showtime and allows users to pick their seats.
  - **Path Parameters**:
    - `showtimeId`: ID of the showtime.
  - **Functionality**:
    - Fetches seat layout based on auditorium format.
    - Renders seat selection page with available seats.

#### Order Routes

- **`POST /order/checkout`**
  - **Description**: Processes the ticket booking and payment.
  - **Body Parameters**:
    - `orderSummary`: Summary of the order, including selected seats and showtime details.
    - `user`: Information about the authenticated user.
  - **Functionality**:
    - Processes the order by verifying seat availability.
    - Inserts the order into the database.
    - Updates seat availability.
    - Redirects the user to their profile upon successful checkout.

- **`POST /order/confirm-purchase`**
  - **Description**: Confirms the purchase of tickets.
  - **Body Parameters**:
    - `Purchase Summary`: Summary of the purchase in JSON format.
  - **Functionality**:
    - Renders the confirm purchase page with order summary details.

### Error Handling

- **`404 Not Found`**
  - **Description**: Any undefined route will result in a 404 error with a "Not Found" message.
  - **Functionality**:
    - Returns a 404 status code for all undefined routes.

## Testing

Currently, the project does not include specified tests. You can run the placeholder test script using:

```bash
npm test
```

*Note: Implement appropriate tests for your modules and functionalities.*

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests via [GitHub](https://github.com/shivangmedhekar/CMA).

## Bugs

Report bugs at the [issues page](https://github.com/shivangmedhekar/CMA/issues).

## Author

Developed by [Shivang Medhekar](https://www.smedhekar.com).

---

## Additional Information

### Security Considerations

- **Password Security**: User passwords are hashed using `bcrypt` with a salt before storing in the database.
- **Session Security**: Sessions are managed securely with a secret key and proper cookie configurations.
- **Input Validation**: All user inputs are validated and sanitized to prevent XSS and other injection attacks.
- **Environment Variables**: Sensitive information like API keys and database credentials are managed through environment variables using `dotenv`.

### External API Integrations

- **AMC API**: Used for fetching theater and showtime information.
- **IMDb API**: Utilized for retrieving IMDb IDs for movies.
- **TMDB API**: Provides additional movie details like backdrops and posters.
- **OMDB API**: Offers supplementary movie data.

### Future Enhancements

- **Testing**: Implement comprehensive unit and integration tests.
- **Frontend Enhancements**: Improve the user interface and user experience.
- **Caching**: Introduce caching mechanisms to reduce API calls and improve performance.
- **Deployment**: Set up CI/CD pipelines for automated testing and deployment.

---

Feel free to explore the codebase and contribute to making CMA an even better platform for movie enthusiasts!
