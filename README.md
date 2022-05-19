# Personal Node Server

My second personal server. It is not designed to be public.

## Main Utilizations

### Node

The entire project is using NodeJS and `npm` to manage the packages.

### GitHub

While the project was designed from the start to use Git (i.e. a `.gitignore` file has always been present), it was not actually added to a repository until it was essentially finished.

### MongoDB Atlas

The project requires that a MongoDB Atlas is running that was used to for database storage. The Atlas that was used is currently down due to inactivity (with no plans to restart it), but the URL to get in is still present and would need to be changed in order to actually use this repo.

## Notes

- The user passwords were stored base64 encoded to represent the idea that they would not be stored in plain text without requiring me to delve very deep into cryptography.

- There is a Python script that takes all of the built single page applications (SPA) that I created in a separate location and put them into a local file for use by a part of the server that represented a content delivery network (CDN) without me having to actually create a proper CDN.

- There is a JavaScript script that generates a sample JSON web token (JWT) that I was using while I did testing on the SPAs.
