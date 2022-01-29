import harvester from "roles/harvester";
import { calculateBodyCost, getScreepName } from "utils/common";
import { ErrorMapper } from "utils/ErrorMapper";

interface CreepDefinition {
	/**
	 * Body part definition for the creep
	 */
	body: BodyPartConstant[];
	/**
	 * The name that is then appended with the ID of the creep
	 */
	name: string;
}

interface CreepTier {
	harvester: CreepDefinition
	upgrader: CreepDefinition
	builder: CreepDefinition
}

const creepTiers: { [tierAmount: string]: CreepTier } = {
	["100"]: {
		harvester: {
			body: [WORK, CARRY, MOVE],
			name: "harvester",
		},
		upgrader: {
			body: [WORK, CARRY, MOVE],
			name: "upgrader",
		},
		builder: {
			body: [WORK, CARRY, MOVE],
			name: "builder",
		},
	}
}

declare global {
	interface Memory {
		id: number;
	}

	interface CreepMemory {
		role: string;
		room: string;
		working: boolean;
	}

	// Syntax for adding proprties to `global` (ex "global.log")
	namespace NodeJS {
		interface Global {
			//   log: any;
		}
	}
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	console.log(`Current game tick is ${Game.time}`);

	// GC: Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}
	if (Object.keys(Game.creeps).length == 0) {
		// need to spawn at least one harverster creep so that more energy is input
		const spawn = Game.spawns['Spawn1']
		if (!spawn.spawning) {
			// if no creep is spawning yet, then we make one spawn
			const creep = creepTiers[100].harvester
			// TODO: add check whether the spawn can create the creep (if it takes too much energy)
			if (spawn.store[RESOURCE_ENERGY] > calculateBodyCost(creep.body))
				spawn.spawnCreep(creepTiers[100].harvester.body, getScreepName(creep.name), {
					memory: {
						role: creep.name,
						room: spawn.room.name,
						working: false,
					}
				})
		}
	}

	// dispatch creeps to do stuff
	for (const name in Memory.creeps) {
		const creep = Game.creeps[name];
		if (creep.memory.role == 'harvester') harvester(creep)
		// TODO: add other creep roles
		// if (creep.memory.role == 'upgrader') harvester(creep)
		// if (creep.memory.role == 'builder') harvester(creep)
	}

	// if we have the energy, then we can spawn a creep
	for (const name in Game.spawns) {
		const spawn = Game.spawns[name];
		if (spawn.spawning) continue // cant spawn more creeps if one is already spawning

		const tiers = Object.keys(creepTiers).reverse() // we want to spawn the highest tier first
		for (const tierName of tiers) {
			const tier = creepTiers[tierName]
			const creep = tier.harvester
			if (spawn.store[RESOURCE_ENERGY] > calculateBodyCost(creep.body)) {
				spawn.spawnCreep(creep.body, getScreepName(creep.name), {
					memory: {
						role: creep.name,
						room: spawn.room.name,
						working: false,
					}
				})
			}
		}
	}
});
