---
title: "Let's Build A Game - Part 2: Drawing the Player"
date: 2017-08-26T21:38:04-07:00
lastmod: 2017-08-26T21:46:00-07:00
---

## Drawing the Player

[Source Code](https://github.com/NateHark/twinstick/releases/tag/0.2.0)

Now that we've finished [setting up our project]({{< relref "lets-build-a-game-part1-project-setup.md" >}}), we can
begin adding some basic logic to our game. Drawing our player is probably a good place to start. My initial thought 
is that we'll have two main types of entities the player and enemies. The thing these both have in common is the 
need to track position, dimensions, and provide hooks for drawing the object. To ensure these capabilities are 
implemented in a consistent way I'll define an abstract class `GameObject` which the player and enemies will extend.

```typescript
abstract class GameObject {
    protected x: number;
    protected y: number;

    // TODO: Assume square bounding boxes initially. Revisit later.
    protected width: number;
    protected height: number;

    protected image: HTMLImageElement;

    constructor(image: HTMLImageElement) {
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    public abstract render(ctx: CanvasRenderingContext2D): void;

    public moveImmediate(x: number, y: number) {
        this.x = Math.round(x - (this.width / 2));
        this.y = Math.round(y - (this.height / 2));
    }
}
```

You'll notice that the `GameObject` constructor expects an `HTMLImageElement`. While I could manually draw the player,
enemies, and other game objects manually via canvas, I've decided to use images sourced from 
[OpenGameArt.org](https://opengameart.org). Once we have an `HTMLImageElement` available and the image referenced by
the element has been loaded, drawing the image on the canvas is as easy as:

```typescript
const ctx = this.canvas.getContext("2d");
ctx.drawImage(imageElement, x, y);
```

### Loading Images 

Ensuring that our images are loaded and ready before the game starts is the next problem we need to solve. Ideally,
we'll maintain a cache of `HTMLImageElement` for each image used by the game. To implement this behavior, I'll
define two classes, `ImageAsset` which represents and individual image, and `AssetLoader` which represents our cache 
and can also be extended to pre-load other non-image assets.

`ImageAsset` contains a reference to a `HTMLImageElement` and a `load` method that creates the element and assigns a 
handler for the image's `onload` event. Since the `load` method is asynchronous, we'll have it return a 
[Promise](https://developers.google.com/web/fundamentals/getting-started/primers/promises) that will resolve or reject 
when the image is successfully fetched, or an error is returned by the server. 

#### ImageAsset load() method

```typescript
public load(): Promise<ImageAsset> {
    this._image = document.createElement("img");
    this._image.src = this.path;

    const promise = new Promise<ImageAsset>((resolve, reject) => {
        this._image.onload = () => {
            this.isLoaded = true;
            resolve(this);
        };

        this._image.onerror = () => {
            this.isLoaded = false;
            reject(this);
        };
    });

    return promise;
}
```

Now that we've defined `ImageAsset`, we can start working on `AssetLoader` which will load and cache all necessary
image assets. Internally, `ImageAsset` will cache instances of `ImageAsset` in a dictionary. We'll initially define 
two assets, the player image, and a background image for the game.

```typescript
private imageAssets: { [index: string]: ImageAsset; } = {
    background: new ImageAsset("background.png"),
    player: new ImageAsset("player.png"),
};
```

Next we need to provide a method that will fetch all assets. We'll want to avoid starting the game until all assets are
loaded, so this method should take a callback that will be triggered when asset loading is complete. In order to execute
the callback only when asset loading is finished, we can leverage `Promise.all()`, which takes an array of `Promise` and
resolves when all Promises have successfully resolved. When `Promise.all()` resolves, we can trigger the callback
provided to `AssetLoader.loadAssets()`. 

```typescript
Promise.all(Object.keys(this.imageAssets).map((key) => this.imageAssets[key].load()))
       .then((values) => callback());
```

You probably noticed that we didn't implement any error handling for the `loadAssets()` method. Ideally, we'd need to 
handle the case where an asset failed to load and either retry or present the user with an error.

### Putting it All Together

If you followed along to this point, we've accomplished the following:

1. Defined a base class for all entities we want to draw
2. Defined a class to represent image assets
3. Provided a mechanism for loading and caching images

Now we'll make modifications to our `Game` class to draw the player and the background. First we'll utilize 
[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to configure our
basic [game loop](https://developer.mozilla.org/en-US/docs/Games/Anatomy). 

Our game loop, `gameLoop()` will render all entities and then request that it is called again via 
`requestAnimationFrame`, hence our loop. The `gameLoop` method needs to be called once externally in order to start 
the loop. We'll do that in our `startGame` method which itself is called after all of our assets have been loaded.

```typescript
constructor() {
    // Do basic initialization
    // ...

    // Load assets, calling startGame when finished
    this.assetLoader.loadAssets(() => { this.startGame(); });
}

private startGame() {
    // Add event listeners, etc
    // ...

    // Create our player and place them in the center of the canvas
    const canvasCenter = this.getCanvasCenter();
    this.player = new Player(this.assetLoader.getImage("player"));
    this.player.moveImmediate(canvasCenter.x, canvasCenter.y);

    // Start our game loop
    requestAnimationFrame(this.gameLoop);
}

private gameLoop = () => {
    // Clear the canvas
    this.renderingContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.render();
    this.player.render(this.renderingContext);

    // Request execution of gameLoop
    requestAnimationFrame(this.gameLoop);
} 

private render() {
    // Render the background image
    const backgroundImage = this.assetLoader.getImage("background");
    const pattern = this.renderingContext.createPattern(backgroundImage, "repeat");
    this.renderingContext.fillStyle = pattern;
    this.renderingContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
```

All that effort results in something that looks like this: 

[![The Player and Starfield](/img/lets-build-a-game-part2-player-and-background.png)](
    /img/lets-build-a-game-part2-player-and-background.png)