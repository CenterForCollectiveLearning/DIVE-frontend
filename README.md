
# DIVE-frontend (dive-frontend)

> DIVE Frontend Codebase

## Installing packages
1. Run `npm install`
2. For packages requiring react@>=0.12.0 (griddle-react and svg-react-loader), find the corresponding packages in  /node_modules and change the peerDependencies line in each package.json to "react": ">=0.12.0||0.14.0-rc1".


## Running your project

The generated project includes a development server on port `3003`, which will rebuild the app whenever you change application code. To start the server, run:

```bash
$ npm start
```

To run the server with the dev-tools enabled, run:

```bash
$ export API_URL=http://localhost:8081
$ export NODE_ENV=DEVELOPMENT
$ DEBUG=true npm start
```

To build for production, this command will output optimized production code:

```bash
$ npm run build
```
