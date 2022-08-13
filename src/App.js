import React, { useEffect } from 'react';
import './App.css';

const generateIDs = (x, y) => {
    return `x${x}+y${y}`;
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            obstaclesInput: [],
            xSize: 25,
            ySize: 25,
        };
        this.pos = {
            x: Math.round(this.state.xSize / 2) - 1,
            y: Math.round(this.state.ySize / 2) - 1,
            heading: 3,
        };
        this.walkedWay = [];
        this.headings = ['EAST', 'SOUTH', 'WEST', 'NORTH'];
        this.obstacles = {};
        this.directions = {
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
        this.navigationObject = {
            f: this.moveForward,
            b: this.moveBack,
            l: this.rotateLeft,
            r: this.rotateRight,
        };
        this.stopeed = {};
    }

    moveForward = (pos) => {
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
            this.obstacles[nextStepObject.x + ',' + nextStepObject.y]();
            return false;
        } catch (error) {
            forwards[pos.heading](pos);
        }

        return () => {};
    };

    moveBack = (pos) => {
        const backwards = {
            0: (obj) => obj.y--,
            1: (obj) => obj.x--,
            2: (obj) => obj.y++,
            3: (obj) => obj.x--,
        };

        const nextStepObject = { ...pos };
        backwards[pos.heading](nextStepObject);
        try {
            this.obstacles[nextStepObject.x + ',' + nextStepObject.y]();
            return false;
        } catch (error) {
            backwards[pos.heading](pos);
        }

        return () => {};
    };

    rotateLeft = (pos) => {
        pos.heading =
            pos.heading - 1 < 0 ? this.headings.length - 1 : pos.heading - 1;
        return () => {};
    };

    rotateRight = (pos) => {
        pos.heading =
            pos.heading + 1 > this.headings.length - 1 ? 0 : pos.heading + 1;
        return () => {};
    };

    generateRoute = (currentPos, desiredPos) => {
        const mainString = [];
        let x = Math.sign(desiredPos.x - currentPos.x);
        let y = Math.sign(desiredPos.y - currentPos.y);
        while (y + x !== 0) {
            const desiredHeading = this.directions['y' + y + 'x' + x];
            while (desiredHeading !== currentPos.heading) {
                mainString.push('r');
                this.rotateRight(currentPos);
            }
            let isObstacle = this.moveForward(currentPos);
            while (!isObstacle) {
                this.rotateRight(currentPos);
                mainString.push('r');

                isObstacle = this.moveForward(currentPos);
                isObstacle && mainString.push('f');

                this.rotateLeft(currentPos);
                mainString.push('l');

                isObstacle = this.moveForward(currentPos);
                isObstacle && mainString.push('f');

                isObstacle = this.moveForward(currentPos);
                isObstacle && mainString.push('f');

                this.rotateLeft(currentPos);
                mainString.push('l');

                isObstacle = this.moveForward(currentPos);
                isObstacle && mainString.push('f');
            }
            mainString.push('f');
            x = Math.sign(desiredPos.x - currentPos.x);
            y = Math.sign(desiredPos.y - currentPos.y);
        }
        return mainString;
    };

    reset = () => {
        this.pos = {
            x: Math.round(this.state.xSize / 2) - 1,
            y: Math.round(this.state.ySize / 2) - 1,
            heading: 0,
        };
        this.stopeed = {};
        this.walkedWay = [];
        this.setState({ ...this.state, input: '', obstaclesInput: [] });
    };

    render() {
        for (let i = 0; i < this.state.obstaclesInput.length; i++) {
            this.obstacles[this.state.obstaclesInput[i].toString()] = () => {};
        }
        for (let order of this.state.input) {
            try {
                this.navigationObject[order.toLowerCase()](this.pos)();
                this.walkedWay.push({
                    x: this.pos.x,
                    y: this.pos.y,
                });
            } catch (error) {
                this.stopeed = { x: this.pos.x, y: this.pos.y };
                break;
            }
        }

        return (
            <main className="main">
                <section className="settings">
                    <label htmlFor="inpu">Input Command</label> <br />
                    <input
                        aria-label="command"
                        type="text"
                        id="inpu"
                        value={this.state.input}
                        onChange={(e) => {
                            if (/^[fblrFBLR]+$/.test(e.target.value))
                                this.setState({
                                    ...this.state,
                                    input: e.target.value,
                                });
                            this.pos = {
                                x: Math.round(this.state.xSize / 2) - 1,
                                y: Math.round(this.state.ySize / 2) - 1,
                                heading: 0,
                            };
                        }}
                    />
                    <List
                        state={this.state}
                        setState={this.setState.bind(this)}
                    />
                    <CalculatePath
                        pos={this.pos}
                        generateRoute={this.generateRoute.bind(this)}
                    />
                    <button className="reset-button" onClick={this.reset}>
                        Reset
                    </button>
                </section>
                <Table
                    key={this.state.input}
                    x={this.state.xSize}
                    y={this.state.ySize}
                    tableState={{
                        obstacles: this.state.obstaclesInput,
                        start: {
                            x: Math.round(this.state.xSize / 2) - 1,
                            y: Math.round(this.state.ySize / 2) - 1,
                        },
                        end: {
                            ...this.pos,
                            facing: this.headings[this.pos.heading],
                        },
                        path: this.walkedWay,
                        stopped: this.stopeed,
                    }}
                />
            </main>
        );
    }
}

const TableCell = ({ id, type }) => {
    const types = {
        0: 'empty',
        1: 'obsatcle',
        2: 'start',
        3: 'end',
        4: 'path',
        5: 'stopped',
    };
    const currentType = types[type];
    const styles = {
        empty: {
            background: 'white',
        },
        obsatcle: {
            background: 'red',
        },
        start: {
            background: 'blue',
        },
        end: {
            background: 'cyan',
        },
        path: {
            background: 'green',
        },
        stopped: {
            background: 'yellow',
        },
    };
    return <span className="t-cell" style={styles[currentType]} id={id}></span>;
};

const TableRow = ({ id, children }) => {
    return (
        <div className="t-row" id={id}>
            {children}
        </div>
    );
};

const Table = ({ x, y, tableState }) => {
    const [tableData, setTableData] = React.useState(
        Array.from(Array(x), () => new Array(y).fill(0))
    );
    const [stopped, setStopped] = React.useState(false);

    useEffect(() => {
        const newState = Array.from(Array(x), () => new Array(y).fill(0));
        tableState.obstacles.forEach(([x, y]) => {
            newState[x][y] = 1;
        });
        tableState.path.forEach(({ x, y }) => {
            newState[x][y] = 4;
        });
        newState[tableState.start.x][tableState.start.y] = 2;
        newState[tableState.end.x][tableState.end.y] = 3;
        if (Object.keys(tableState.stopped).length > 0) {
            newState[tableState.stopped.x][tableState.stopped.y] = 5;
            setStopped(true);
        }
        setTableData(newState);
    }, []);
    return (
        <div className="container">
            <h4>Facing: {tableState.end.facing}</h4>
            <h4 id="position" data-testid="position">
                Position: ({tableState.end.x}, {tableState.end.y})
                {stopped && ' STOPPED'}
            </h4>
            <div style={{ overflow: 'auto' }}>
                {tableData.map((_, i) => (
                    <TableRow key={i} id={i}>
                        {tableData[i].map((type, j) => (
                            <TableCell
                                key={j}
                                id={generateIDs(i, j)}
                                type={type}
                            />
                        ))}
                    </TableRow>
                ))}
            </div>
        </div>
    );
};

const List = ({ state, setState }) => {
    const [newObs, setNewObs] = React.useState([0, 0]);
    const handleChange = (val, index, innerIndex) => {
        val = parseInt(val);
        if (!/^[0-9]+$/.test(val)) return;
        const newArr = state.obstaclesInput;
        newArr[index].splice(innerIndex, 1, val);
        setState({ ...state, obstaclesInput: newArr });
    };
    const handleDelete = (index) => {
        const newArr = state.obstaclesInput;
        newArr.splice(index, 1);
        setState({ ...state, obstaclesInput: newArr });
    };
    const handleAdd = () => {
        setState({
            ...state,
            obstaclesInput: [...state.obstaclesInput, newObs],
        });
        setNewObs([0, 0]);
    };
    return (
        <>
            <h2>Obstacles</h2>
            <ul>
                {state.obstaclesInput.map((item, index) => {
                    return (
                        <li>
                            <input
                                type="text"
                                value={item[0]}
                                onChange={(e) =>
                                    handleChange(e.target.value, index, 0)
                                }
                            />
                            <input
                                type="text"
                                value={item[1]}
                                onChange={(e) =>
                                    handleChange(e.target.value, index, 1)
                                }
                            />
                            <button onClick={() => handleDelete(index)}>
                                Remove
                            </button>
                        </li>
                    );
                })}
                <hr />
                <li>
                    <input
                        aria-label="new-obs-x"
                        type="text"
                        value={newObs[0]}
                        onChange={(e) => {
                            if (!/^[0-9]+$/.test(e.target.value)) return;
                            setNewObs([e.target.value, newObs[1]]);
                        }}
                    />
                    <input
                        aria-label="new-obs-y"
                        type="text"
                        value={newObs[1]}
                        onChange={(e) => {
                            if (!/^[0-9]+$/.test(e.target.value)) return;
                            setNewObs([newObs[0], e.target.value]);
                        }}
                    />
                    <button aria-label="new-obs-button" onClick={handleAdd}>
                        Add New Obstacle
                    </button>
                </li>
            </ul>
        </>
    );
};

const CalculatePath = ({ pos, generateRoute }) => {
    const [solution, setSolution] = React.useState('');
    const [newObs, setNewObs] = React.useState([]);
    const handleCalculate = () => [
        setSolution(
            generateRoute(pos, { x: newObs[0], y: newObs[1] }).join('')
        ),
    ];
    return (
        <>
            Move to: <br />
            <input
                type="text"
                value={newObs[0]}
                onChange={(e) => setNewObs([e.target.value, newObs[1]])}
            />
            <input
                type="text"
                value={newObs[1]}
                onChange={(e) => setNewObs([newObs[0], e.target.value])}
            />
            <hr />
            <button onClick={handleCalculate}>Calculate</button>
            <p>{solution && `Solution: ${solution}`}</p>
        </>
    );
};

export default App;
