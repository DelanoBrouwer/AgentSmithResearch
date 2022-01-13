const { ServiceBroker } = require("moleculer");

const transporter = process.env.TRANSPORTER || "TCP";

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

let stats = []

broker.createService({
    name: "Cell",
    actions: {
        Echo(ctx) {
            return ctx.params.message;
        },

        isAlive(ctx) {
            let objects = ctx.params.objects;
            if (ctx.params.x >= 0) {
                if (ctx.params.x < objects.length) {
                    if (ctx.params.y >= 0) {
                        if (ctx.params.y < objects[ctx.params.x].length) {
                            //console.log(objects[ctx.params.x][ctx.params.y]);
                            stats.push(objects[ctx.params.x][ctx.params.y].alive);
                            return objects[ctx.params.x][ctx.params.y].alive ? 1 : 0;
                        }
                    }
                }
            }
            return false;

        }
    }
});

broker.start();