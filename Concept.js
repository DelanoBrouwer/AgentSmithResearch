// Note: This is only a conceptual version of the implementation.
// Be sure to check the documentation via https://moleculer.services/

const { ServiceBroker } = require("moleculer");

const transporter = process.env.TRANSPORTER || "TCP";

const broker = new ServiceBroker({
    ... // Exluded for brevity
});

// Saving the neighbour IDs.
let Neighbours = [1232, 15235];

// Saving the agents on this node.
let CurrentAgents = [agent1, agent2];

broker.createService({
    name: "Agents",
    actions: {
        GetCurrentAgents(ctx) {
            return CurrentAgents;
        },

        AddAgent(ctx){
            let newAgent = new IAgent(ctx.params.name, ctx.params.id, ...);
            CurrentAgents.push(newAgent);
        }
    }
});

broker.start();

// Down here you would have the simulation. This simulation loop can likely be almost the same as the one in the original Agent Smith Simulator.


// Example of calling all neighbours for agents.
broker.mcall("Agents.GetCurrentAgents", {nodeID: [Neighbours[0], Neighbours[2]]});
