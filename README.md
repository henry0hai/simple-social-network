# Simple Social Network

## Technical Stack

- Programing Language: Javascript
- Platform: NodeJS
- Framework: Moleculer - Micro-services framework
- Database: MongoDB

In almost of projects that I involved to, we always using Moleculer framework because of it flexibility in switching between Monolithic Application and Micro-services application.

## User Stories

- 1.  As a user, I need an API to create a friend connection between two email addresses.
- 2.  As a user, I need an API to retrieve the friends list for an email address.
- 3.  As a user, I need an API to retrieve the common friends list between two email addresses.
- 4.  As a user, I need an API to subscribe to updates from an email address.
- 5.  As a user, I need an API to block updates from an email address.
- 6.  As a user, I need an API to retrieve all email addresses that can receive updates from an email address.

## Analyze

- Database Schema
  - Users (id, email, password, createdAt, updatedAt)
  - Friends (user, friend, createdAt, updatedAt) (user & friend store user email)
  - Subscribes (requestor, target, active, createdAt, updatedAt) (requestor, target store user email, active: true/false)
- APIs
  - Register user:
    - URL: /api/register
    - Params:
      - email: string
      - password: string
    - Response:
      - success: boolean
    - Error:
      - ValidationError (When the params are not correct)
      - ExistedError (When the users connection already established)
      - InternalServerError
    - Unit Test:
      - Register success
      - Give wrong type of params
      - Give wrong shape of request payload
      - Give an email existed
  - Make friend (Propose for User Story 1)
    - URL: /api/make-friend
    - Params:
      - friends: array (email)
    - Response:
      - success: boolean
    - Error:
      - ValidationError (When the params are not correct)
      - ExistedError (When the users connection already established)
      - InternalServerError
    - Unit Test:
      - Request make friend success
      - Give wrong type of params
      - Give wrong shape of request payload
      - Give an array with 1 existed email and 1 not existed
      - Give an array with non existed email
      - Give an array with an array has more than 2 emails
  - Get friend list (Propose for User Story 2)
    - URL: /api/friends
    - Params:
      - email: string
    - Response:
      - success: boolean
      - friends: array (email)
      - count: number
    - Error:
      - ValidationError (When the email that provided is invalid email type)
      - InternalServerError
    - Unit Test:
      - Get friends success
      - Give wrong type of email
      - Give email that not existed in data
  - Get common friend (Propose for User Story 3)
    - URL: /api/get-common-friends
    - Params:
      - friends: array (email)
    - Response:
      - success: boolean
      - friends: array (email)
      - count: number
    - Error:
      - ValidationError (When the params are not correct)
      - InternalServerError
    - Unit Test:
      - Request get success
      - Give wrong type of params
      - Give wrong shape of request payload
      - Give an array with 1 existed email and 1 not existed
      - Give an array with non existed email
  - Subscribe update (Propose for User Story 4)
    - URL: /api/subscribe
    - Params:
      - requestor: string (email)
      - target: string (email)
    - Response:
      - success: boolean
    - Error:
      - ValidationError (When the params are not correct)
      - InternalServerError
    - Unit Test:
      - Request get success
      - Give wrong type of params
      - Give wrong shape of request payload
      - Give requestor existed email and target not existed
      - Give target existed email and requestor not existed
      - Give target not existed email and requestor not existed
  - Block udpate (Propose for User Story 5)
    - URL: /api/block
    - Params:
      - requestor: string (email)
      - target: string (email)
    - Response:
      - success: boolean
    - Error:
      - ValidationError (When the params are not correct)
      - InternalServerError
    - Unit Test:
      - Request get success
      - Give wrong type of params
      - Give wrong shape of request payload
      - Give requestor existed email and target not existed
      - Give target existed email and requestor not existed
      - Give target not existed email and requestor not existed
  - Retrieve all email address that can receive updates from an email address (Propose for User Story 6)
    - URL: /api/compose-message
    - Params:
      - sender: string (email)
      - text: string => when get the mentions => only show email is existed in systems to the recipients
    - Response:
      - success: boolean
      - recipients: array (email)
    - Error:
      - ValidationError (When the params are not correct)
      - InternalServerError
    - Unit Test:
      - Request get success
      - Give wrong type of params
      - Give wrong shape of request payload
      - Give sender not existed email
      - Give a text params that have some existed emails and some not existed

## How to run

### Local

- 1.  Clone and pull the source code into the local machine
- 2.  Open source code in some IDE like: Visual Studio Code
- 3.  Open terminal or some build-in terminal and run command: yarn
- 4.  After step 3, run command: yarn dev
- 5.  After step 4, open Postman or you can download here: https://www.getpostman.com/apps to run API
- 6.  Open Postman and import the script in folder `postman_scripts` that already config to run the user stories

### Server

- Using Postman and make a call API to address: http://206.189.34.9/
