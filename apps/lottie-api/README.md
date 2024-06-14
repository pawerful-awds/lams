# LAMS - Backend (API)

## Overview
The approach is to combine Express, TypeScript, Firebase, and GraphQL, it leverages the strengths of each technology to create a robust, scalable, and efficient API.

- Express + TypeScript: 
    - Express provides the framework for handling HTTP requests and building the API, while TypeScript ensures type safety and better code quality. Together, they offered a strong foundation for building LAMS' Backend API scalable and maintainable.
- Firebase Integration: 
    - Firebase's real-time database and file storage services are seamlessly integrated in the Express-based API server. This setup enables real-time data synchronization and efficient file handling for Lottie animations.
- GraphQL for Data Management: 
    - Using GraphQL on top of Express allows the FE to query the API efficiently, requesting exactly the data FE needs. 
    - GraphQL's type system complements TypeScript, ensuring robust schema definitions and query validations. By using a script to generate the types being used in the schemas
    - Using Apollo for easy interactions with Graphql APIs

## APIs
### GraphQL Url
`http://localhost:4000/graphql`
### API REST Url
`http://localhost:4000/v1/*`

### GraphQL queries and mutations
- `queryName`
Simple query for testing or schema introspection.
```
{
  queryName
}
```
- `getAnimations`
Query to get all available animations
```
query {
  getAnimations {
        title
        id
        url
        animationData
        createdAt
    }
}
```

- `getAnimation`
Query to get details of a specific animation by Id
```
query {
  getAnimation(id: $id) {
        title
        id
        url
        animationData
        createdAt
    }
}
```

- `uploadAnimation` Mutation to upload an animation
    - Used `form-data` mechanism request so that file can be uploaded

```
{
  "query": "mutation UploadAnimation($file: Upload!, $metadata: String!) { uploadAnimation(file: $file, metadata: $metadata) { 
    id, 
    title, 
    metadata, 
    url
    } 
  }",
  "variables": {
    "file": null,
    "metadata": "Sample Metadata"
  },
  "operationName": "UploadAnimation"
}
```

## Flow
### Upload Animation
- Once the request goes thru, `uploadAnimation` resolver will pick it up and gets title, file and metadata params
- It will be then create a blob from the file from the req payload using `bucket.file()` from firebase and create a stream using `createWriteStream` then pipe the read stream to it
- After uploading the file to bucket, it will create a record in Firebase/Firestore database

### Get Animations
- This requests goes thru `getAnimations` resolver. It will get all animations from firestore database
- Once the snapshot is available it will be piped to a transformer function that molds the response payload (`toAnimation`)

### Get Animation
- Request goes thru `getAnimation` and carries in an `id` param.
- It'll fetch the necessary document from firestore and if its present -
- It'll fetch the content of the upload file getting all the data and feed it through the API. Decided to do this to lessen the complications in firebase RBAC especially when dealing with file storage. I believed it added a security layer only the app can access the contents.

### Download Animation
- Downloadable links will be available thru the details as part of the UI
- Another API route is available for downloading `/v1/download`

### Other misc services
- Backend is equipped with rate limiting, this is to ensure that spamming the API will be guarded and returns a `429` error. Configurable to how many request per second.
- Health check, a hygiene that helps to check heartbeat of the API service

## Things to improve
- All `TODO` types need to be replaced with the respective types
- Add unit testing and integration testing coverage
- Request validation in Graphql resolvers
- Protect API routes by API keys and tokens
