export const getScreepName = (prefix: string): string => {
	const id = Memory.nextCreepId|| 0;
	Memory.nextCreepId = id + 1;
	return `${prefix}_${id}`
}

export const calculateBodyCost = (body: BodyPartConstant[]): number => {
	let cost = 0
	for (const part of body) {
		cost += BODYPART_COST[part]
	}
	return cost
}

export type RoomPositionString = `${string}_${number}_${number}`

/**
 * Stringify a room position into a string for better storage
 * @returns Room position string
 */
export const RoomPositionToString = (pos: RoomPosition): RoomPositionString => {
	return `${pos.roomName}_${pos.x}_${pos.y}`
}
/**
 * Parse a room position to a
 * @param str RoomPosition string
 * @returns Room position object or null if room is invalid
 */
export const StringToRoomPosition = (str: RoomPositionString): RoomPosition | null => {
	const [roomName, x, y] = str.split("_")
	if (!Game.rooms[roomName]) return null
	return new RoomPosition(Number(x), Number(y), roomName)
}
