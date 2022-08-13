# Mars Rover Task using JavaScript

This application is about sending commands to control a rover located at Mars.

## How to install

You can install the application by following these steps:

1. Navigate to the desired location on your computer
2. Open the command prompt and run `git clone https://github.com/JoeHossam/penta-b.git`
3. Navigate to the project folder by running `cd .\penta-b\`
4. Run `npm install`, to install all the required packages for this project
5. Run `npm start`

## Project is split into parts

A frontend implementation has been done using react but for more **robust** version use the vanilla JS instead

### Vanila JavaScript

#### How to run

1. This part can be found in file `penta.js`.\
2. simply copy and paste the code into any browser console and run.\
3. You can modify the **command query** and the **obstacles** from the first few lines of code.
    > **_NOTE:_** The position of the hover is assumed to be (0,0) and facing NORTH by default.\
4. `generateRoute()` To calculate a route from the current hover position
    > **_Example:_** generateRoute({...pos}, {x:12, y: 12}) x and y are the desired postion

### React

#### Pannel

The frontend has a pannel where you can:

-   Pass command query
-   Edit obstacles postions
-   Reset

#### Map

This is a simple map to demonstrate the rover's and obstacles' positions

## Testing

Testing has been done in the react part using `@testing-library`.\
The tests can be found in `src/App.test.js` in there you can find 4 tests:

1. it shouldn't allow any letters besides fblr
2. test command query
3. obstacles input only accept numbers
4. add obstacle & smash into it

You can run the tests using run using `npm test` as shown in the next section.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

### `npm test`

Launches the test runner in the interactive watch mode.
