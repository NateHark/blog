---
title: "Let's Build A Game - Part 1: Project Setup"
date: 2017-08-12T10:04:33-07:00
draft: true
---

## Intro

[Source Code](https://github.com/NateHark/twinstick)

The overarching philosophy for this project is to follow the 
[KISS Principle](https://en.wikipedia.org/wiki/KISS_principle). I hope to avoid unnecessary complexity as much as 
possible where it doesn't directly contribute to the goal of building a simple game.

## Project Structure

To get started, we'll need to install [NodeJS](https://nodejs.org) to support TypeScript compilation. We can also 
leverage NodeJS to implement any required server-side functionality. Once NodeJS is installed, we can bootstrap a
new project as follows:

```bash
$ mkdir twinstick
$ cd twinstick && npm init
```

The output of `npm init` is a file, `package.json`, describing our project. 
Next we'll start sketching out a directory structure for our project. One decision that may not be 
immediately obvious is the creation of separate directories for client and server TypeScript. This enables 
us to configure different compiler options for the client and server code, which I'll get into later in 
this post. The resulting project directory looks like this:

```txt
src
├── ts
│   ├── client
│   ├── server
```

## TypeScript and TSLint

Next we'll install and configure support for the TypeScript compiler and a linter (TSLint).

```bash
# Install TypeScript as a non-global project dependency
$ npm install --save-dev typescript
# Install the TypeScript linter
$ npm install --save-dev tslint
```
We now need to configure the TypeScript compiler. Instead of passing all of the compiler arguments to `tsc` 
on the command line, we can instead provide the options via a configuration file. In order to specify 
different compiler options for the client and server code, we'll need a configuration file, `tsconfig.json` 
in the client and server directories.

**tsconfig.json (src/ts/client)**

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "system",
    "strict": true,
    "strictNullChecks": true,
    "outFile": "../../../dist/public/js/bundle.js",
    "rootDir": "./"
  }
} 
```
The most interesting thing to note about the client `tsconfig.json` is that I've chosen to bundle all client 
TypeScript into a single JavaScript file. This choice was made for the sake of simplicity and wouldn't be 
the best choice for a large JavaScript project, where it would be advisable to consider using a proper 
JavaScript module loader. 

**tsconfig.json (src/ts/server)**

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "strict": true,
    "strictNullChecks": true,
    "outDir": "../../../dist",
    "rootDir": "./"
  }
}
```

Configuring TSLint is as easy as running `tslint --init` in the root of your TypeScript source directory. 
This command creates a `tslint.json` file in the current working directory which enables the default set 
of [recommended](https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts) linter rules. 
While the linter rules can be customized and tweaked to your heart's content, I find the recommended ruleset 
to be a good starting point. The only rule I'm going to disable to start with is `interface-name` which requires that 
all interface names are prefixed with an "I". 

```json
{
    "defaultSeverity": "error",
    "extends": [
        "tslint:recommended"
    ],
    "jsRules": {},
    "rules": {
      "interface-name": [true, "never-prefix"]
    },
    "rulesDirectory": []
}
```

# Back-end Implementation

This project does not require a server to get started. A simple `index.html` would be entirely sufficient. 
However, I'll probably want to add leaderboards or a login of some sort later in the process, so a simple back-end 
implementation is warranted. Initially, I'll have the back-end serve our `index.html` file via 
[Express](https://expressjs.com/). We'll install Express first, then the TypeScript bindings for Express 
since Express is not a TypeScript library, and finally the Pug template engine.

```bash
# Install Express
$ npm install --save express
# Install the TypeScript bindings for Express
$ npm install --save @types/express
# Install pug
$ npm install --save pug
```

Now we'll create an `index.ts` file in `src/ts/server` and implement the Express bootstrap and routing required to 
serve a simple HTML page.

```typescript
import * as express from "express";
import * as path from "path";

// Initialize Express
const app = express();

// Provide Express with the path to our static assets (images, CSS, JavaScript)
app.use("/public", express.static(path.join(__dirname + "/public")));

// Configure the view engine and views directory.
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// Handling for the root URL path 
app.get("/", (req, res) => {
    // Render the "index" template 
    res.render("index");
});

app.listen(3000);
``` 

Next we'll define the template for the index page. This will pull in our JavaScript bundle and render a `canvas` 
element upon which we'll implement the game.

```text
doctype html
html
    head
        title Twin-Stick Shooter

        script(src='public/js/bundle.js')
    body
        div(class='content')
            canvas(id='twinstick')
        
        script.
            var game = new TwinStick();
```

## Build Process

Since we're using TypeScript we need to transpile the TypeScript to JavaScript. We have a few different 
implentation options: manually invoke the TypeScript compiler, script compilation via a shell script, use 
[NPM scripts](https://docs.npmjs.com/misc/scripts), or use a full-blown build tool like [Gulp](https://gulpjs.com/) 
or [WebPack](https://webpack.github.io/). Sticking with the KISS theme, I'll stick with NPM scripts for this project. 
NPM scripts are defined in the project's `package.json` file. My initial `package.json` appears below with comments 
explaining the various script targets. _Note: The comments do not appear in the source code._

**"scripts" node in package.json**

```json
{
  ...
  "scripts": {
    // Delete the build directory
    "clean": "rm -rf ./dist",
    // Runs clean, compile:ts, and copy:templates in that order
    "build": "npm run clean && npm run compile && npm run copy:templates",
    // Compile both the server and client TypeScript files
    "compile:ts": "tsc -p src/ts/server && tsc -p src/ts/client",
    // Copy the server templates to the output directory
    "copy:templates": "mkdir -p ./dist/ && cp -R ./src/views ./dist",
    // Start the application
    "start": "node ./dist/server/index.js",
    // Recompiles the TypeScript in src/ts/client when changes are made
    "watch:client": "tsc -w -p src/ts/client",
  },
  ...
}
```

We're now ready to build and run the application. First we'll build the project by running `npm run build` followed by 
`npm run start` to start the server. At this point we can hit `http://localhost:3000` in our browser and see 
...drumroll please... a blank page. However, if you inspect the DOM our canvas element should be present and our 
compiled TypeScript will be pulled in as `bundle.js`. Now that we have our project set up and build process running, 
it's time to actually start building a game.





