import _ from "lodash"
import harvester from "roles/harvester";
import assignTasks from "utils/assignTasks";
// import harvester from "roles/harvester";
// import { calculateBodyCost, getScreepName as getCreepName } from "utils/common";
import { ErrorMapper } from "utils/ErrorMapper";
import progression from "utils/progression";

// code that it outside of loop effectively runs on init only
// Initialize non-standard items in the Memory object
console.log("Initializing memory")
Memory.nextCreepId = 0
Memory.tasks = []
for (const creepName in Memory.creeps) {
	const creepMemory = Memory.creeps[creepName]
	creepMemory.taskId = null
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	console.log("current tick is " + Game.time)
	// Instantaniate temp data for this tick
	Memory.temp = {
		rooms: new Map(),
	}

	// GC: Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}

	// create tasks
	progression()
	// sort the tasks by priority
	Memory.tasks = Memory.tasks.sort((a, b) => a.priority - b.priority)
	console.log(Memory.tasks.length)
	// assign the tasks to creeps
	assignTasks()

	// GC: Automatically delete memory of data that can be fetched during the next cycle
	// @ts-ignore
	Memory.temp = null
});
