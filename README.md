# Q&A API

This project is a Q&A API that allows users to create, retrieve, and vote on questions and answers. It is built using Express.js, PostgreSQL, and Swagger for API documentation.

## Features

- **Create Questions**: Users can create questions with a title, description, and category.
- **Create Answers**: Users can submit answers to a specific question.
- **Vote on Questions and Answers**: Users can upvote or downvote both questions and answers.
- **Search Questions**: Allows searching for questions by category or title.

## Database Overview

This project uses **PostgreSQL** as the database management system to store the data for questions, answers, and votes.

### Database Schema

The database schema consists of four main tables:

1. **`questions`**: Stores the details of the questions including the title, description, and category.
2. **`answers`**: Stores the answers to questions. Each answer is associated with a specific question via a foreign key.
3. **`question_votes`**: Stores the votes for questions. Each vote can either be an upvote (1) or a downvote (-1).
4. **`answer_votes`**: Stores the votes for answers. Each vote can either be an upvote (1) or a downvote (-1).

### Relationships Between Tables

- The **`answers`** table has a foreign key reference to the **`questions`** table, linking each answer to a specific question.
- The **`question_votes`** table links votes to a specific question, and the **`answer_votes`** table links votes to a specific answer.
- Both **`question_votes`** and **`answer_votes`** tables ensure that the `vote` column only accepts values of `1` (upvote) or `-1` (downvote).

### Environment Configuration

Ensure you have the correct PostgreSQL credentials set up in your `.env` file for the application to connect to the database. Here's a sample `.env` file format:
```.env
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
```
**Note**: Replace `your_postgres_username` and `your_postgres_password` with your actual PostgreSQL username and password. These credentials will be used by the application to connect to your PostgreSQL database. And don't forget to replace `your_database_name` with your database


## Install Dependencies

To install the required dependencies for the project, run:

```bash
npm install
```
## Running the Application

After setting up the database and installing dependencies, you can start the application by running:

```bash
npm start
```

The server will start on port `4000`. You can access the API documentation at:
[http://localhost:4000/api-docs](http://localhost:4000/api-docs)