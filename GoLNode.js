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

broker.createService({
    name: "Cell",
    actions: {
        // Returns the message. Was used for showing inter-node transport.
        Echo(ctx) {
            return ctx.params.message;
        },

        // Checks whether a certain node is alive, and then returns either a 1 or a 0.
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
            return 0;

        }
    }
});

broker.start();
