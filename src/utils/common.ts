export const getScreepName = (prefix: string): string => {
	const id = Memory.id || 0;
	Memory.id = id + 1;
	return `${prefix}_${id}`
}

export const calculateBodyCost = (body: BodyPartConstant[]): number => {
	let cost = 0
	for (const part of body) {
		cost += BODYPART_COST[part]
	}
	return cost
}
