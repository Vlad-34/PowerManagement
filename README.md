# Energy Management System

Welcome to the Energy Management System project. This README provides instructions for setting up the project for development and execution.

## Table of Contents
1. Clone the Repository
2. Configuration Setup
3. Running the Application

## 1. Clone the Repository

To get started, clone this repository to your local machine using Git:
```bash
git clone <link>
```

## 2. Configuration Setup

For the Spring application to run, you need to provide configuration details in an `application.yml` file. Follow these steps:

- Navigate to the `src/main/resources` directory in the Spring application project.
- Create an `application.yml` file.
- Add the necessary configuration properties for your environment. You may need to specify database connection details, security settings, and other application-specific parameters.

## 3. Running the Application

Now that you've set up the configuration and installed dependencies, you can run the application.

- Start the container using
```
docker-compose up
```

- Access the application in your web browser at http://localhost:5173 or the broker manager at http://localhost:15672