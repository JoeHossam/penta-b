// Command Query
const input = 'rflfffff';

// Obstacles Input
const obstaclesInput = [
    [1, 4],
    [3, 5],
    [7, 4],
    [4, 12],
    [2, 10],
    [7, 12],
];
const obstacles = {};
for (let i = 0; i < obstaclesInput.length - 1; i++) {
    obstacles[obstaclesInput[i].toString()] = () => {};
}

const headings = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

const pos = {
    x: 0,
    y: 0,
    heading: 0,
};

// Movement functions
const moveForward = (pos) => {
    const forwards = {
        0: (obj) => obj.y++,
        1: (obj) => obj.x++,
        2: (obj) => obj.y--,
        3: (obj) => obj.x--,
    };

    // Copy the current position into another object and see if there is an obstacle in the next step
    const nextStepObject = { ...pos };
    forwards[pos.heading](nextStepObject);
    try {
        obstacles[nextStepObject.x + ',' + nextStepObject.y]();
        return false;
    } catch (error) {
        forwards[pos.heading](pos);
    }

    return () => {};
};

const moveBack = (pos) => {
    const backwards = {
        0: (obj) => obj.y--,
        1: (obj) => obj.x--,
        2: (obj) => obj.y++,
        3: (obj) => obj.x--,
    };

    const nextStepObject = { ...pos };
    backwards[pos.heading](nextStepObject);
    try {
        obstacles[nextStepObject.x + ',' + nextStepObject.y]();
        return false;
    } catch (error) {
        backwards[pos.heading](pos);
    }

    return () => {};
};
const rotateLeft = (pos) => {
    pos.heading = pos.heading - 1 < 0 ? headings.length - 1 : pos.heading - 1;
    return () => {};
};
const rotateRight = (pos) => {
    pos.heading = pos.heading + 1 > headings.length - 1 ? 0 : pos.heading + 1;
    return () => {};
};

const directions = {
    y1x1: 0,
    y1x0: 0,
    'y1x-1': 0,
    y0x1: 1,
    y0x0: 0,
    'y0x-1': 3,
    'y-1x1': 2,
    'y-1x0': 2,
    'y-1x-1': 2,
};

const generateRoute = (currentPos, desiredPos) => {
    const mainString = [];
    let x = Math.sign(desiredPos.x - currentPos.x);
    let y = Math.sign(desiredPos.y - currentPos.y);
    while (y + x !== 0) {
        const desiredHeading = directions['y' + y + 'x' + x];
        while (desiredHeading !== currentPos.heading) {
            mainString.push('r');
            rotateRight(currentPos);
        }
        let isObstacle = moveForward(currentPos);
        while (!isObstacle) {
            rotateRight(currentPos);
            mainString.push('r');

            isObstacle = moveForward(currentPos);
            isObstacle && mainString.push('f');

            rotateLeft(currentPos);
            mainString.push('l');

            isObstacle = moveForward(currentPos);
            isObstacle && mainString.push('f');

            isObstacle = moveForward(currentPos);
            isObstacle && mainString.push('f');

            rotateLeft(currentPos);
            mainString.push('l');

            isObstacle = moveForward(currentPos);
            isObstacle && mainString.push('f');
        }
        mainString.push('f');
        x = Math.sign(desiredPos.x - currentPos.x);
        y = Math.sign(desiredPos.y - currentPos.y);
    }
    return mainString.join('');
};

const navigationObject = {
    f: moveForward,
    b: moveBack,
    l: rotateLeft,
    r: rotateRight,
};

const walkedWay = [];

for (order of input) {
    try {
        navigationObject[order.toLowerCase()](pos)();
        walkedWay.push({ x: pos.x, y: pos.y });
        console.log(`(${pos.x}, ${pos.y}) ${headings[pos.heading]}`);
    } catch (error) {
        console.log(`(${pos.x}, ${pos.y}) ${headings[pos.heading]} STOPPED`);
        break;
    }
}
