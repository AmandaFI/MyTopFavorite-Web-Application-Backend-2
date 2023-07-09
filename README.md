# My Top Favorite Web Application - NestJS Back End

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Table of Content

1. [Application Overview](#application-overview)
2. [Back End Description](#back-end-description)
3. [Technologies](#technologies)
4. [Installation](#installation)
5. [Getting Started](#getting-started)

---

## **Application Overview** <a name="application-overview"></a>

My Top Favorite is a social media platform where registered users can create, edit and share lists containing a rank of their favorite things of a certain theme. Along with each list item, the user has the option to attach a personalized text talking about the chosen item. Users can also follow other users to keep up with their listings.

The platform is integrated with external APIs, therefore, when creating a list, the user can search for items belonging to that theme in reliable sources. As an example, a user creating a list of his favorite action movies will be able to search for them in the collection of the Tmdb platform.

Currently the platform supports lists with themes related to movies, series and public personalities.The theme possibilities are endless and new themes will be supported soon!

## **Back End Description** <a name="back-end-description"></a>

The platform has two fully functional back end implementations that are interchangeable and this repository contains the NestJS version. The Ruby on Rails version can be found in [this repository](https://github.com/AmandaFI/MyTopFavorite-Web-Application-Backend) and the React front end implementation can be found in [this repository](https://github.com/AmandaFI/MyTopFavorite-Web-Application-Frontend).

The API was implemented using the TypeScript programming language and the NestJS framework following the **REST** architectural design pattern. The chosen SQL database was SQlite and the Object Relational Mapping (ORM) system used was the Prisma.

Following the NestJS patterns, the methods containing the Prisma interactions with the database were implemented in services separeted from the controllers. Therefore, **Dependency Injection** was used to provide these services where they were needed.

For testing and validation of the API endpoints, the Swagger tool was used.

As mentioned in the [overview](#Overview) section, only registered users can interact with the platform features, therefore the authentication process was implemented. The main branch implements authentication using **sessions and cookies**.

Among the many features provided by this application, a logged user is able to access certain pages to see and interact ('Like') with lists shared by the users he follows. From the API point of view, lists displayed on this areas are fetched using the **offset pagination** type.

## **Technologies** <a name="technologies"></a>

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [sqlite3](https://www.npmjs.com/package/sqlite3)
- [Swagger](https://docs.nestjs.com/openapi/introduction)
- [class-validator](https://www.npmjs.com/package/class-validator)

## **Installation** <a name="installation"></a>

To run this project locally the following prerequisites are necessary:

- Node.js installed
- npm installed

If your system does not meet the mentioned prerequisites, install Node.js. npm is included with Node.js, so you don’t have to install it separately. The Node.js installation can be executed followig the commands bellow:

### **Linux systems**

1 - If not installed, install curl:

```bash
$ sudo apt install curl
```

2 - Find the correspondent curl command for your Linux distro in the [node repository](https://github.com/nodesource/distributions/blob/master/README.md#debinstall) and run it on bash. Example for Ubuntu:

```bash
$ curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
```

3 - Install the Node.js:

```bash
$ sudo apt-get install -y nodejs
```

### **macOS or Windows systems**

Download macOs installer or Windows installer respectively from the [official site](https://nodejs.org/en/download) and follow the installation steps presented.

## **Getting Started** <a name="getting-started"></a>

If your system meets the mentioned prerequisites just clone this repository and run the following initialization commands:

```bash
$ git clone https://github.com/AmandaFI/MyTopFavorite-Web-Application-Backend-2.git
$ cd MyTopFavorite-Web-Application-Backend-2
```

Install the project packages:

```bash
$ npm install
```

Run the API server:

```bash
$ npm run start:dev
```

This server was configured to run on http://localhost:3001, however this can be changed if necessary.
