---
title: "Let's Build A Game - Part 3: Player Controls"
date: 2017-09-15T21:41:10-07:00
---

[Source Code](https://github.com/NateHark/twinstick/releases/tag/0.3.0)

## Basic Keyboard Event Handling

Now that I'm able to draw the player on the game area, I'll start implementing the ability to move the 
player around. My goal is to mimic the basic "twin-stick shooter" behavior with the exception that we'll
be using the keyboard and mouse for input rather than dual analog sticks. Essentially, I'll be using the `W`, `A`, `S`, 
and `D` keys for moving in the cardinal directions, and the mouse for providing the direction the player is facing.

I'll begin with the naive approach of handling the keyboard input directly by adding an event handler for the `keydown`
event to the `window` object in my `startGame()` method.

```typescript
class Game {
    // ...
    private startGame() {
        // ...
        window.addEventListener("keydown", this.handleKeyDown);
        // ...
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode === 87) {
            // w - up
            this.player.moveUp();
        }

        if (event.keyCode === 65) {
            // a - left
            this.player.moveLeft();
        }

        if (event.keyCode === 83) {
            // s - down
            this.player.moveDown();
        }

        if (event.keyCode === 68) {
            // d - right
            this.player.moveRight();
        }
    }
    // ...
}
```

Now that I'm capturing input from the WASD keys, I'll add `moveUp()`, `moveLeft()`, `moveDown()`, and `moveRight()` 
methods to the `Player` class. The body of each of these methods will adjust the x/y location of the player 
as appropriate when the key is invoked. This leaves me with an implementation that moves the player around via the 
WASD keys, but leaves a lot to be desired. 

![Basic Keyboard](/img/lets-build-a-game-part3-basic-keyboard.gif)

The two major problems with this approach are the choppy performance (and that's not just an artifact of the .gif),
and the inability to move in the diagonal by holding two keys such as `W` and `A`. The reason for the latter behavior
is that we only receive events for a single key at a time when keys are held. For example, when I hold down the `W`
key, the `handleKeyDown` method is invoked repeatedly for an event with `keyCode = 87`, corresponding with `W`. If I 
keep `W` held and then press and hold `A`, the `handleKeyDown` method is now invoked repeatedly with an event with
`keyCode = 65`. I've now lost track of the fact that the `W` key is still pressed. 

## Implementing an Input Handler

To resolve the input problems with the naive approach, I'll need to implement a more sophisticated way of tracking 
keyboard input. I'll call this class `InputHandler`, and its role is to track the pressed (or not) state of each
key, allowing me to track whether keys are being held. Since the `InputHandler` is now reponsible for 
tracking keyboard events, I'll move the `handleKeyDown` method from the `Game` class to `InputHandler`. I'll also 
implement a handler for the `keyup` event in order to track when a key is released. The most important part of this 
class is the `keyState` property which is a map of the keycode value to a boolean flag which indicates whether or not
the key is pressed. I'll also add a public `getKeyState` method that allows other classes to query the state of
particular keys.

```typescript
class InputHandler {
    private keyState: { [ index: number ]: boolean } = {};

    public start() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    public stop() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }

    public getKeyState(keyCode: number): boolean {
        const state = this.keyState[keyCode];
        return (state != null) ? state : false;
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.keyState[event.keyCode] = true;
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        this.keyState[event.keyCode] = false;
    }
}
```

Now that I have my `InputHandler`, I need to modify the `Game` class to leverage it rather than handling the 
keyboard events directly. I'll add a new `private readonly` property `inputHandler` to the `Game` class and initialize
it in the constructor. Then, I'll call the `start()` method on `InputHandler` in `startGame()` method, which is 
executed after all game assets are loaded. Finally, I need to implement a method that will handle input changes by 
querying the `InputHandler` for keyboard state. I'll name this method `processInput` and call it from the `gameLoop`
method. The other nice side-effect of this approach is that we will query and modify player position only as often
as our target framerate, which should smooth out some of the choppy movement seen in the naive implementation.

```typescript
class Game {
    // ...
    private processInput() {
        if (this.inputHandler.getKeyState(KeyCode.Forward)) {
            this.player.moveUp();
        }

        if (this.inputHandler.getKeyState(KeyCode.Backward)) {
            this.player.moveDown();
        }

        if (this.inputHandler.getKeyState(KeyCode.Left)) {
            this.player.moveLeft();
        }

        if (this.inputHandler.getKeyState(KeyCode.Right)) {
            this.player.moveRight();
        }
    }

    private gameLoop = () => {
        // ...

        // Process any user-input changes prior to rendering
        this.processInput();

        // ...
    }
    // ...
}
```

Implementing the input handler has solved both issues with the naive approach. The player appears to move smoothly
across the canvas, and we're able to track multiple simultaneous keys being held, enabling the player to move 
both in the cardinal directions, but also diagonally. 

![Input Handler](/img/lets-build-a-game-part3-input-handler.gif)

## Improving Movement Feel

It may not be obvious from the previous example, but my current implementation results in the player moving at a 
constant rate with no acceleration. This is the equivalent of a car that accelerates from 0-60 MPH instantly and can 
stop on a dime. This behavior is not realistic and does not feel that great as the player. Implementing acceleration
and deceleration will go a long way toward making the ship move realistically. Rather than building a complex 
acceleration curve for our player, I'll start out with a simple linear algorithm. I'll add properties to the `Player`
class representing the maximum speed, rate of acceleration, and speed in each cardinal direction. Next, the set of 
`move*` methods can be refactored into a single `move` method that takes boolean flags indicating which direction(s) 
the player should move. The body of the `move` method will update the speed by adding or subtracting our acceleration
until speed hits our max speed if accelerating or 0 if decelerating.

```typescript
class Player extends GameObject {
    protected maxSpeed = 20;
    protected acceleration = 2;

    protected speedUp  = 0;
    protected speedDown  = 0;
    protected speedLeft  = 0;
    protected speedRight  = 0;

    public move(moveUp: boolean, moveDown: boolean, moveLeft: boolean, 
                moveRight: boolean) {
        this.speedUp = this.adjustSpeed(this.speedUp, 
            (moveUp) ? this.acceleration : -this.acceleration);
        this._y -= this.speedUp;

        this.speedDown = this.adjustSpeed(this.speedDown, 
            (moveDown) ? this.acceleration : -this.acceleration);
        this._y += this.speedDown;

        this.speedLeft = this.adjustSpeed(this.speedLeft, 
            (moveLeft) ? this.acceleration : -this.acceleration);
        this._x -= this.speedLeft;

        this.speedRight = this.adjustSpeed(this.speedRight, 
            (moveRight) ? this.acceleration : -this.acceleration);
        this._x += this.speedRight;
    }

    private adjustSpeed(currentSpeed: number, acceleration: number): number {
        const newSpeed = currentSpeed + acceleration;
        return Math.min(Math.max(0, newSpeed), this.maxSpeed);
    }
}

```

The `processInput` method in the `Game` class now can be simplified as demonstrated below. You'll notice that I've 
also defined a simple enumeration of keycode values to make the code more readable.

```typescript
class Game {
    // ...
    private processInput() {
        // ...

        // Set the player's location and direction
        this.player.move(
            this.inputHandler.getKeyState(KeyCode.Forward),
            this.inputHandler.getKeyState(KeyCode.Backward),
            this.inputHandler.getKeyState(KeyCode.Left),
            this.inputHandler.getKeyState(KeyCode.Right),
        );

        // ...
    }
    // ...
}
```

## Handling Mouse Input

As I mentioned at the beginning of this post, the mouse will define the direction in which the player is facing.
Essentially, I want the player to constantly face the mouse cursor. Implementing this behavior
proved to be a bit more difficult than handling keyboard input, but ended up plugging in well with the framework
that I've developed to this point.

Since I've already defined `InputHandler` for handling user input, it would be sensible to add handlers for mouse
events to this class. There are 4 event handlers that we'll add to `InputHandler` for the following mouse events on
our `canvas` element.

  * `mousemove` - Tracks the position of the mouse cursor
  * `mousedown` - Tracks mouse button down
  * `mouseup` - Tracks mouse button up
  * `contextmenu` - Used to suppress the browser context on the `canvas`

I'll also implement a simple class `MouseState` that will track the cursor position and mouse button state.

```typescript
class MouseState {
    public x: number;
    public y: number;
    public isLeftButton: boolean;
    public isRightButton: boolean;

    constructor(x: number, y: number, isLeftButton: boolean, isRightButton: boolean) {
        this.x = x;
        this.y = y;
        this.isLeftButton = isLeftButton;
        this.isRightButton = isRightButton;
    }
}
```

The `InputHandler` class now needs to be modified to react to the mouse events identified above, and update 
`MouseState` as needed. 

```typescript
class InputHandler {
    public static readonly MOUSE_BUTTON_LEFT = 0;
    public static readonly MOUSE_BUTTON_RIGHT = 2;

    // ...

    private mouseState = new MouseState(0, 0, false, false);
    private mouseMoveThrottled: (event: MouseEvent) => void;

    // ...

    constructor(window: Window, canvas: HTMLCanvasElement) {
        this.window = window;
        this.canvas = canvas;

        this.mouseMoveThrottled = Util.throttle(this.handleMouseMove, 
            Game.TARGET_FRAME_INTERVAL);
    }

    public start() {
        // ...

        this.canvas.addEventListener("contextmenu", this.handleContextMenu);
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mousemove", this.mouseMoveThrottled);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
    }

    public stop() {
        // ...

        this.canvas.removeEventListener("contextmenu", this.handleContextMenu);
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        this.canvas.removeEventListener("mousemove", this.mouseMoveThrottled);
        this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    }

    // ...

    public getMouseState(): MouseState {
        return this.mouseState;
    }

    private handleContextMenu = (event: MouseEvent) => {
        // Suppress browser context menu
        event.preventDefault();
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.keyState[event.keyCode] = true;
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        this.keyState[event.keyCode] = false;
    }

    private handleMouseDown = (event: MouseEvent) => {
        if (event.button === InputHandler.MOUSE_BUTTON_LEFT) {
            this.mouseState.isLeftButton = true;
        }

        if (event.button === InputHandler.MOUSE_BUTTON_RIGHT) {
            this.mouseState.isRightButton = true;
        }
    }

    private handleMouseMove = (event: MouseEvent) => {
        this.mouseState.x = event.clientX;
        this.mouseState.y = event.clientY;
    }

    private handleMouseUp = (event: MouseEvent) => {
        if (event.button === InputHandler.MOUSE_BUTTON_LEFT) {
            this.mouseState.isLeftButton = false;
        }

        if (event.button === InputHandler.MOUSE_BUTTON_RIGHT) {
            this.mouseState.isRightButton = false;
        }
    }
}
```

One previously unmentioned item in the code sample above is the use of the `throttle` utility method. My initial
implementation did not throttle the `mousemove` event resulting in it firing much more often than needed which 
harmed performance. Since we're only updating the canvas approximately 60 times per second, we do not need to update 
our mouse position more often than every `1000 / 60` milliseconds. The `throttle` method is a TypeScript port of the 
equivalent method in the [Underscore.js](http://underscorejs.org/) library.

I'm now going to modify the `move()` method on the `Player` class to take the rotation in radians in addition to
boolean flags for each cardinal direction. The problem I have to solve now is how do I define "rotation", and how
is it calculated. For the purposes of this game, rotation will be the angle in radians between the center of the 
player and the current mouse position. In order to calculate this angle, we need to take the arctangent of the 
change in `x` position and the negative (since the y-axis is oriented down) change in `y` position.

```typescript
class Util {
    // ...

    /**
    * Calculates the counterclockwise angle in degress between x1,y1 and x2,y2
    */
    public static angleOf(x1: number, y1: number, x2: number, y2: number): number {
        const deltaY = y2 - y1;
        const deltaX = x1 - x2;
        let radians = Math.atan2(deltaY, deltaX);
        radians = (radians < 0) ? radians + (2 * Math.PI) : radians;

        // Convert to degress
        return Util.toDegrees(radians);
    }

    // ...
}
```

Here's a visualization of how the above angle is calculated:

![Mouse Angle](/img/mouse-rotation.png)

```typescript
class GameObject {
    // ...

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y);
        ctx.rotate(Util.toRadians(-this.rotation + this.defaultAngle));
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // ...
}
```

Now I'm going to modify the render method in `GameObject` to take into account the rotation. This is likely a common
need for different objects, so it makes sense to add this to the base class. There are two additional items in this 
code that are worth pointing out. First, we offset the image by -1/2 its width and height. This ensures that the 
player is drawn centered on its x,y coordinates. Second, I'm negating the provided rotation since we're calculating 
the counter-clockwise rotation between the mouse and the player, and the rotation applied to the transform is 
assumed to be a clockwise rotation. All that effort results in mouse-tracking that behaves like this:

![Mouse Tracking](/img/lets-build-a-game-part3-mouse-input.gif)

Next up? Providing something to shoot!