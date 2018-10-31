# Laravel Rest API Seed
This project is a laravel application with common functionality for a SASS restful API.

## Installing

Download and install all dependencies
```
$ composer install
```

Create the `.env` file using the `.env.example` as a reference
```
$ cp .env.example .env
```

Set secret keys for JWT and for Laravel.
```
$ php artisan jwt:secret
$ php artisan key:generate
```

Open the `.env` file and update the database credentials based on your environment. The run the migrations to setup the database.

```
$ php artisan migrate
```

Run the http server
```
$ php artisan serve
```

## Features
[x] Sign up with email
[x] Login with email
[x] Login with Facebook
[x] Geolocalization based on IP
[x] Activity system
[x] Comment system
[x] Simple blog
[x] Social system to follow other users
[ ] Tag system
[ ] Assets uploading system