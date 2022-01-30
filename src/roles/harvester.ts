export default function (creep: Creep) {
	// if (creep.store.getFreeCapacity() > 0) {
	// 	// has extra inventory space to farm more energy
	// 	const sources = creep.room.find(FIND_SOURCES);
	// 	const sourcesByDistance = sources
	// 		.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))
	// 	if (creep.harvest(sourcesByDistance[0]) === ERR_NOT_IN_RANGE) {
	// 		// if it's not in range, then it will move to the source
	// 		creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
	// 		creep.say("🔄 harvesting");
	// 	}
	// }  else {
	// 	// go to nearest spawn and drop off stuff there
	// 	const spawn = creep.pos.findClosestByPath<StructureSpawn>(FIND_STRUCTURES, {
	// 		filter: (structure) => {
	// 			return (structure.structureType === STRUCTURE_SPAWN);
	// 		}
	// 	})
	// 	if (spawn) {
	// 		if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	// 			creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
	// 			creep.say("🔄 transfer");
	// 		}
	// 	} else {
	// 		creep.say("🔄 bruh no spawn");
	// 	}
	// }

}
