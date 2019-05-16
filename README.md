# Peach

> Programa para la administración de negocios.
> /- MongoDB - Firebird Server 2.1.7 (If you are using Systel) -/

## MongoDB Installation

download mongodb 32 bits from
'https://www.mongodb.org/dl/win32/i386'

Open cmd as administrator and run

```
"\path\to\mongod.exe" --config "\path\to\mongod.cfg" --install

net start MongoDB
```

## Firebird setup

--- IMPORTANT ---
FIREBIRD VERSION: 2.5.1

download Firebird Super Server from
'https://www.firebirdsql.org/en/firebird-2-5-1/?'

Install and run it as a service

Edit Systels products with incompatible characters (ñ and accent marks)

Everything is ready :D!

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```
