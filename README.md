# RecipeApp

The project is a Recipe App, designed to allow users to contribute their own recipes, interact with others' recipes through likes and favorites, and potentially incorporate a meal planning feature.

## TODO

- frontend:

  - able to edit a recipe
  - delete recipe
  - add account settings page

- add share button
- turn into a docker container
- redo installation and setup to include docker in README.md

## 🛠️Technology Stack

**Front end:**

- React
- Redux
- TypeScript
- MantineUI

**Back end:**

- Node
- Express
- MongoDB

## 🔧 Installation and Setup

Clone the repository

```
git clone https://github.com/Gunnar50/recipe-app-ts.git
```

Navigate to the project directory

```
cd recipe-app-ts
```

To be able to run this repo locally you will have to create a MongoDB database and setup the .env file. There are two ways of setting up the database, locally (**Compass**) or in the cloud (**Atlas**). Both options are free.

[How to Create Database](https://www.mongodb.com/basics/create-database)

[Atlas Website](https://www.mongodb.com/atlas)

Once you have created the database, you have to create a .env file in the **ROOT** directory and add the following environment variables replacing the URI with the one for your database.

```
MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"

SECRET="this_can_be_anything"

SALT="this_can_be_anything"
```

Install the dependecies

```
npm install
```

There are two options to start the development:

Start Server and Client in different terminal

```
npm run server

npm run client
```

Or start both at once using:

```
npm start
```

## 📝 Testing

Jest is used for testing. Before running any tests make sure you clone and install all the dependencies as specified above.

Navigate to the project root directory and run:

```
npm test
```

To run a specific test you can run (change the folder and test name):

```
npm test -- server/__tests__/auth.test.ts
```

## ⭐️ Show your support

Give a start if you liked and this project helped you!

## 📝 License

This project is open source and available under the MIT License.
