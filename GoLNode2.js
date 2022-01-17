const { ServiceBroker } = require("moleculer");

const transporter = process.env.TRANSPORTER || "TCP";

// Creating the servicebroker.
const broker = new ServiceBroker({
    namespace: process.env.NAMESPACE || "nodes",
    nodeID: process.env.nodeID || "node-" + process.pid,
    transporter,
    logger: [
        "Console",
    ],
    logLevel: process.env.LOGLEVEL || "warn",
    registry: {
        discoverer: {
            type: process.env.DISCOVERER || "Local",
            options: {
                serializer: process.env.DISCOVERER_SERIALIZER,
            },
        },
    },
});

// This service does the same as CheckSurroundings() in version 1. It simply checks whether the cells 
// around the target cell are alive by calling isAlive on another node. It then returns the number of live cells.
broker.createService({
    name: "Neighbours",
    actions: {
       async GetNumAlive(ctx) {
        let res1 = await broker.call("Cell.isAlive", { x: ctx.params.x - 1, y: ctx.params.y - 1, numColumns: ctx.params.numColumns, numRows: ctx.params.numRows, objects: ctx.params.grid })
        let res2 = await broker.call("Cell.isAlive", { x: ctx.params.x, y: ctx.params.y - 1, numColumns: ctx.params.numColumns, numRows: ctx.params.numRows, objects: ctx.params.grid })
        let res3 = await broker.call("Cell.isAlive", { x: ctx.params.x + 1, y: ctx.params.y - 1, numColumns: ctx.params.numColumns, numRows: ctx.params.numRows, objects: ctx.params.grid })
        let res4 = await broker.call("Cell.isAlive", { x: ctx.params.x - 1, y: ctx.params.y, numColumns: ctx.params.numColumns, numRows: ctx.params.numRows, objects: ctx.params.grid })
        let res5 = await broker.call("Cell.isAlive", { x: ctx.params.x + 1, y: ctx.params.y, numColumns: ctx.params.numColumns, numRows: ctx.params.numRows, objects: ctx.params.grid })
        let res6 = await broker.call("Cell.isAlive", { x: ctx.params.x - 1, y: ctx.params.y + 1, numColumns: ctx.params.numColumns, numRows: ctx.params.numRows, objects: ctx.params.grid })
        let res7 = await broker.call("Cell.isAlive", { x: ctx.params.x, y: ctx.params.y + 1, numColumns: ctx.params.numColumns, numRows: ctx.params.numRows, objects: ctx.params.grid })
        let res8 = await broker.call("Cell.isAlive", { x: ctx.params.x + 1, y: ctx.params.y + 1, numColumns: ctx.params.numColumns, numRows: ctx.params.numRows, objects: ctx.params.grid });
        let numAlive = res1 + res2 + res3 + res4 + res5 + res6 + res7 + res8;
        return numAlive;
       }
    }
});

broker.start();
