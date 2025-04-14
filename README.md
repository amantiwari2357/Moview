# Movie Browser

## Description
A Movie Browser application that allows users to explore various movies, view details, and manage their watched movies.

## Installation
### Prerequisites
- Node.js
- npm

### Steps to Clone the Repository
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd movie-browser
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Setup API for TMDB
1. Go to [TMDB](https://www.themoviedb.org/) and create an account.
2. Obtain your API key from the API section.
3. Configure the API key in the project (e.g., in `src/Constants/URLs.js`).

### Setup Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project and set up Firestore.
3. Obtain your Firebase configuration and add it to `src/Firebase/FirebaseConfig.js`.

## Usage
- To run the application in development mode:
  ```bash
  npm run dev
  ```
- To build the application for production:
  ```bash
  npm run build
  ```

## Technologies Used
- React
- Firebase
- Tailwind CSS
- Vite

## Error Handling
The application includes a user-friendly 404 error page for handling non-existent routes.

## Contributing
Contributions are welcome! Please follow the standard guidelines for contributing.

## License
This project is licensed under the ISC License.
