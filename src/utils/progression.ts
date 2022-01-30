// Progression system

import { RoomPositionToString } from "utils/common"

export default () => {
	const totalEnergy = _.map(Game.rooms, (room) => room.energyAvailable).reduce((a, b) => a + b, 0)
	if (!Memory.tasks.length) {
		// if nothing is being done then upgrade the controller
		for (const roomName in Game.rooms) {
			const room = Game.rooms[roomName]
			if (room.controller && room.controller.my && room.controller.level < 8) {
				const upgradeCost = {
					1: 200,
					2: 45_000,
					3: 135_000,
					4: 405_000,
					5: 1_215_000,
					6: 3_645_000,
					7: 10_935_000,
				} as const

				const level = room.controller.level as 1|2|3|4|5|6|7
				// making the energy required be more just in case something happens
				if (totalEnergy >= (upgradeCost[level] + 4096)) {
					Memory.tasks.push({
						id: room.controller.id,
						type: "build",
						position: RoomPositionToString(room.controller.pos),
						energyRequired: upgradeCost[level],
						structure: STRUCTURE_CONTROLLER,
						creepIds: [],
						priority: 0,
					})
				}
			}
		}
	}

	// mining more energy om nom nom
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName]
		if (!room.controller || !room.controller.my) continue

		const sources = room.find(FIND_SOURCES)
		for (const source of sources) {
			Memory.tasks.push({
				id: Math.random().toString(36).substring(2, 9),
				type: "collectEnergy",
				target: source.id,
				count: Math.min(source.energy, totalEnergy),
				creepIds: [],
				priority: 0,
			})
		}
	}
}
