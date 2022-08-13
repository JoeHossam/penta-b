# Mars Rover Task using JavaScript

## Project is split into parts

### Vanila JavaScript

This part can be found in file `penta.js`. the code can be simply copied nad pasted into any browser console and run.\
The position of the hover is assumed to be 0,0 and facing NORTH by default.\
You can modify the command query and the obstacles from the first few lines of code.\

After you run the code you can call function `generateRoute()` passing 2 parameters the first is a location object containing `{x, y, heading}`, the second one is a coordinate `{x, y}`.\
So and exmaple would be: `generateRoute({x: 0, y: 0, heading: 0}, {x: 12, y:12})`.\
or simply pass a copy of the current rover position `generateRoute({...pos}, {x:12, y: 12})`.\

### React

This part is the entire project it uses the same code from the Vanilla JS part with some adjustments to the code to make it run with react.\
Everything is built inside `App.js`.\
There is a samll map that is being rendered representing all the coordinates.\
A small interface is built to control the command query, obstacles array and the `generateRoute` function.\

## Testing

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\

### `npm test`

Launches the test runner in the interactive watch mode.\
