// System of assigning tasks

import { getScreepName as getCreepName, RoomPositionToString } from "utils/common"

export default () => {
	// sort tasks by descending priority and then handle them
	Memory.tasks = Memory.tasks.sort((a, b) => b.priority - a.priority)

	if (!Object.keys(Game.creeps).length) {
		// there are no creeps, we need to make some
		for (const spawnName in Game.spawns) {
			const spawn = Game.spawns[spawnName]
			if (spawn.spawning) continue // cant spawn something on an existing spawner
			if (spawn.room.energyAvailable < 100) continue // not enough energy to spawn a creep
			const name = getCreepName("base")
			spawn.spawnCreep([WORK, CARRY, MOVE], name)
		}
	}

	for (const task of Memory.tasks) {
		const creep = _.find(Game.creeps, (creep) => typeof creep.memory.taskId !== "string")
		if (!creep) break // TODO: add logic to re-assign creeps to more important tasks
		creep.memory.taskId = task.id
		switch (task.type) {
			case "collectEnergy":
				const source = Game.getObjectById(task.target) as Source
				if (creep.store.getFreeCapacity() === 0) {
					// TODO: creep is full, path to some form of storage unit to store go go juice
				} else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
					creep.moveTo(source)
				}
		}
	}

	// continue doing tasks
	for (const _creep in Game.creeps) {
		const creep = Game.creeps[_creep]
		if (creep.memory.taskId === null) continue // we dont care about creeps that are not assigned to any task

		const task = Memory.tasks.find((task) => task.id === creep.memory.taskId)
		if (!task) continue

		switch (task.type) {
			case "collectEnergy":
				const source = Game.getObjectById(task.target) as Source
				if (creep.store.getFreeCapacity() === 0) {
					// TODO: creep is full, path to some form of storage unit to store go go juice
				} else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
					creep.moveTo(source)
				}
		}
	}
}
