// System of assigning tasks

import { RoomPositionToString } from "utils/common"

export default () => {
	for (const task of Memory.tasks) {
		if (task.type === "collectEnergy") {
			/*
				[ ] Make task assigning logic better by creating a limit of how many creeps can be assigned to a task
			*/
			const source = Game.getObjectById(task.target)
			if (!source) {
				console.log(`Task ${task.id} has invalid sourceId ${task.target}`)
				continue
			}
			const room = Game.rooms[source.room.name]
			if (!room) {
				console.log(`Task ${task.id} has invalid source room ${source.room.name}`)
				continue
			}
			const creeps = source.pos.findInRange(FIND_MY_CREEPS, 50)
			if (!creeps.length) {
				// if it didnt find one within 50 tiles, then it should go to the closest creep
				const creep = source.pos.findClosestByPath(FIND_MY_CREEPS)
				if (creep) creeps.push(creep)
			}
			if (creeps.length === 0)
				return console.log(`No creeps could be found for task ${task.id}, exiting assignTasks early`)
			const usableCreeps = creeps.filter((creep) => creep.memory.taskId === null)
			if (usableCreeps.length === 0) {
				console.log(`No creeps could be found for task ${task.id}`)
				continue
			}

			// assign the task to the creeps
			for (const creep of usableCreeps) {
				creep.memory.taskId = task.id
				task.creepIds.push(creep.id)
				if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
					creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.say("🚗 ⛏️")
				}
			}
		}
	}
}
