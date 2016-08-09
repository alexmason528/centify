#Centify Management Console Development Project

This project is for Centify and developed as a regular ReactJS application.

## Getting Started

Run:

```bash
# Install the dependencies
npm install

# copy configuration (see below)
cp .env.example .env

# Run
npm start
```

## AUTH0 Configuration

.env file at the root contains auth0 client ID and domain. You must configure this file to make this app work.

## Environments

Currently 4 environments are set up as default.

Localdev (environment for local development. Uses localhost:3000 for domain, and staging API.)
Development
Staging
Production

To run application in any of these environments except production (note that production environment does not allow direct running using webpack), you can use any of these commands:
npm start (localdev)
npm run start_dev (development)
npm run start_stg (staging)

To build, use any of these commands:
npm run build_dev
npm run build_stg
npm run build_prd

## Used Libraries

* [auth0-lock](https://github.com/auth0/lock)
* [webpack](https://webpack.github.io)
* [postcss](http://postcss.org)
* [hjs-webpack](https://github.com/HenrikJoreteg/hjs-webpack)
* [react.js](http://facebook.github.io/react/)
* [react-router](https://github.com/reactjs/react-router)
* [react-bootstrap](https://react-bootstrap.github.io/)
* [enzyme](https://github.com/airbnb/enzyme)
* [chai](http://chaijs.com)
