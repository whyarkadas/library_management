# Library Management API

A RESTful API for managing a library system, built with Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=library_db
DB_DATABASE_TEST=library_db_test
```

4. Create the databases:
```sql
CREATE DATABASE library_db;
CREATE DATABASE library_db_test;
```

## Running the Application

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## Development

To run the application in development mode with automatic reloading:
```bash
npm run watch
```

## Testing

1. Run all tests:
```bash
npm test
```

2. Run tests with coverage:
```bash
npm run test:coverage
```

3. Run tests in watch mode:
```bash
npm run test:watch
```

## Database Seeding

To populate the database with sample data:
```bash
npm run seed
```

## API Endpoints

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user details with their borrowed books
- `POST /users` - Create a new user
- `POST /users/:userId/borrow/:bookId` - Borrow a book
- `POST /users/:userId/return/:bookId` - Return a book

### Books
- `GET /books` - List all books
- `GET /books/:id` - Get book details
- `POST /books` - Create a new book
- `POST /books/:id/borrow` - Borrow a book
- `POST /books/:id/return` - Return a book

## Request/Response Examples

### Create User
```http
POST /users
Content-Type: application/json

{
    "name": "John Doe"
}
```

### Create Book
```http
POST /books
Content-Type: application/json

{
    "name": "The Great Gatsby"
}
```

### Borrow Book
```http
POST /books/1/borrow
Content-Type: application/json

{
    "userId": 1
}
```

### Return Book
```http
POST /books/1/return
Content-Type: application/json

{
    "score": 4.5
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

## Future Improvements

### Authentication & Authorization
- Implement user authentication using JWT
- Add role-based access control (Admin, Librarian, User)
- Add password protection for user accounts
- Implement session management

### Features
- Add book categories/genres
- Implement book search functionality with filters
- Add support for book reservations
- Implement waiting list for borrowed books
- Add email notifications for due dates and reservations
- Support for multiple copies of the same book
- Add book cover image upload functionality
- Implement fine calculation for overdue books

### Technical Improvements
- Add API documentation using Swagger/OpenAPI
- Implement rate limiting
- Add request validation using JSON Schema
- Implement caching for frequently accessed data
- Add pagination for list endpoints
- Implement logging system
- Add monitoring and analytics
- Set up CI/CD pipeline
- Add Docker support for easier deployment
- Implement database migrations

### Testing
- Add integration tests
- Implement end-to-end testing
- Add performance testing
- Improve test coverage
- Add load testing

### User Experience
- Add response pagination
- Implement sorting and filtering options
- Add bulk operations support
- Improve error messages and validation
- Add request/response examples for all endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 