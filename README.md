# Peach

> Programa para la administración de negocios.
> /- MongoDB (Optional, fallback on Nedb) - Firebird Server (If you are using Systel) -/

## MongoDB Installation

download mongodb 32 bits from
'https://www.mongodb.org/dl/win32/i386'

Open cmd as administrator and run

```
"\path\to\mongod.exe" --config "\path\to\mongod.cfg" --install

net start MongoDB
```

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
