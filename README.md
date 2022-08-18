# mock-payment-system
A mock payment system with 3 micro services implemented with rabbitMQ, postgres and redis

## Requirements

For development, you will only need Node.js, npm, postgres, redis, rabbitMQ, docker and a node global package (npm or Yarn) installed in your environment.

### Node

- #### Node installation on Windows

    Just go on [official Node.js website](https://nodejs.org/) and download the installer.
    Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

    You can install nodejs and npm easily with apt install, just run the following commands.

    ##### Installation Commands

        $ sudo apt install nodejs
        $ sudo apt install npm

- #### Other Operating Systems

    You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).
    If the installation was successful, you should be able to run the following command.

    ##### verification Commands

        $ node --version
        v14.17.3 (recommended for this project)
        $ npm --version
        v7.20.5
    If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    ##### update Command

        $ npm install npm -g

### Yarn

After installing node, this project will need yarn too, so just run the following command.

##### Installation Commands

    $ npm install -g yarn

---

## Project Installation

    $ Clone the App
    $ run `npm install` to install dependencies.

---

## Configure app

    $ Create a `.env` on the project's root directory, copy and fill in the missing values for the variables listed on the `.env.example` file
    $ create test and development databases for the project and fill in the name on the `TEST_DB_NAME` and `DB_NAME` on the .env file respectively
---

## Running migrations

    $ run `npm run migrate` set up the database tables
    $ run `npm run seed:up` to seed user data

---

## Running the project locally

    $ run `npm run dev` to serve the app with hot reload at `localhost:2000` or `http://127.0.0.1:2000`

## Running the project with docker

    $ run `docker build --tag mock-payment-api .` to create a docker image file
    $ run `docker compose up` to start the app

---

## Running tests

    $ npm test OR yarn run test

---

## Technologies

- Node JS
- Express
- Chai, Chai-http and mocha
- Postman
- Postgres
- Redis
- RabbitMQ
- Docker

---

## Documentation

    $ The API documentation can be found at `https://documenter.getpostman.com/view/17137732/VUqmvePz`
    
---

## Copyright

Copyright (c) 2022 Austin

---