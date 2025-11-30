# Assignment Portal

A comprehensive web application designed for students to submit assignments and administrators to manage them efficiently.

## Features

- **Student Dashboard**:
  - View assigned tasks.
  - Submit assignments.
  - Track submission status.
- **Admin Dashboard**:
  - Create and manage assignments.
  - Review and grade student submissions.
  - View analytics and reports.
- **Authentication**:
  - Secure login and registration for both students and admins.
  - Role-based access control.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React framework)
- **Backend**: Next.js API Routes
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/assignment-portal.git
    cd assignment-portal
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add the following variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key_here (leave it as it is)
    ADMIN_SECRET=secret_key_admin
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the application**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Register**: Create a new account as a student or admin.
- **Login**: Access your dashboard using your credentials.
- **Admin**: Navigate to the admin dashboard to post new assignments.
- **Student**: Go to the student dashboard to view and submit assignments.

## License

This project is licensed under the MIT License.

