# WeVe Wedding Venues

## Platform for renting and making reservations for wedding venues

## About
This repo implements the backend REST API (build in Express + MongoDB).

A repository for with the frontend (React App) can be found [HERE](https://github.com/tulip-hunters/weve-wedding-planner-app-client)

## Instructions
To run in your computer, follow these steps:

- clone
- install dependencies: npm install
- create a .env file with the following environment variables
- - ORIGIN, with the location of your frontend app (example, ORIGIN=https://weve.netlify.app/)
- - TOKEN_SECRET: used to sign auth tokens (example, TOKEN_SECRET=ilovepizza)
- - CLOUDINARY_NAME: used to upload Images (example, CLOUDINARY_NAME=xxxvtvzw)
- - CLOUDINARY_KEY: used to upload Images (example, - CLOUDINARY_KEY=0007790786874281)
- - CLOUDINARY_SECRET: used to upload Images (example CLOUDINARY_SECRET=XXX6sDCVskBGDFjXY6vb-2T0da0)
- run the application: npm run dev

## API Endpoints

### Auth endpoints
| HTTP verb | Path             | Request Headers               | Request body                                     | Description       |
| --------- | ---------------- | ----------------------------- | ------------------------------------------------ | ----------------- |
| POST      | /api/auth/signup | –                             | { name: String,email: String, password: String } | Create an account |
| POST      | /api/auth/login  | –                             | { email: String, password: String }              | Login             |
| GET       | /api/auth/verify | Authorization: Bearer `<jwt>` | –                                                | Verify jwt        |

### Venue routes

| HTTP verb | Path                 | Request Headers               | Request body                                                      | Description                                                                                 |
| --------- | -------------------- | ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| POST      | /api/venue           | Authorization: Bearer `<jwt>` | { name, description, address, price, capacity, imageUrl, offers } | Create new venue                                                                            |
| GET       | /api/venue           | –                             | –                                                                 | Get all venue                                                                               |
| GET       | /api/venue/:venued   | –                             | –                                                                 | Get venuedetails                                                                            |
| POST      | /api/venues/:venueId | Authorization: Bearer `<jwt>` | –                                                                 | Add Comments and likes to the Venue(This functionality is restricted to owner of the venue) |
| POST      | /api/upload          | Authorization: Bearer `<jwt>` | –                                                                 | Upload Images                                                                               |
| PUT       | /api/venues/:venueId | Authorization: Bearer `<jwt>` | { title: String, description: String, tasks: Array }              | Update a venue(User can update only their own Venue)                                        |
| DELETE    | /api/venues/:venueId | Authorization: Bearer `<jwt>` | –                                                                 | Delete a venue (User can delete only their own Venue)   


### Reservations routes

| HTTP verb | Path                  | Request Headers               | Request body                                                                | Description              |
| --------- | ----------------------| ----------------------------- | --------------------------------------------------------------------------- | ------------------------ |
| POST      | /api/reservations     | Authorization: Bearer `<jwt>` | { title, weddingDate, guestsNumber, venue, user }                           | Create new Reservation   |
| GET       | /api/reservations     | –                             | –                                                                           | Get all Reservations     |
| GET       | /api//my-reservations | Authorization: Bearer `<jwt>` | –                                                                           | Get all user Reservations|

##DEMO
Here is the link of deployed frontend React.js App by Netlify: [WeVe Wedding Venues](https://weve.netlify.app/)