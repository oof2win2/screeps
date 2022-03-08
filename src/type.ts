import { RoomPositionString } from "utils/common";

export type Task = ({
	type: "collectEnergy"
	/**
	 * Where to deposit the energy
	 */
	target: Id<Source>
	/**
	 * Amount of energy to collect
	 */
	count: number
} | {
	type: "build"
	/**
	 * Where to build
	 */
	position: RoomPositionString
	/**
	 * Amount of energy that is required to build the object
	 */
	energyRequired: number
	/**
	 * Identification of what to build
	 */
	structure: StructureConstant
} | {
	type: "upgrade"
	/**
	 * Where to upgrade
	 */
	position: RoomPositionString

	/**
	 * Amount of energy that is required to upgrade the object
	 */
	energyRequired: number

	/**
	 * Identification of what to upgrade
	 */
	structure: StructureConstant
}) & {
	/**
	 * ID of the task
	 */
	id: string
	/**
	 * ID of the creep that is assigned to the task
	 */
	creepIds: string[]
	type: "collectEnergy" | "build" | "upgrade"
	/**
	 * Priority of the task. Higher number means higher priority.
	 */
	priority: number
}

interface TempData {
	rooms: Map<Id<Room>, Room>
}

declare global {
	interface Memory {
		nextCreepId: number
		tasks: Task[]
		temp: TempData
	}

	interface CreepMemory {
		role: "harvester" | "builder";
		room: string;
		taskId: string | null;
	}

	// Syntax for adding proprties to `global` (ex "global.log")
	namespace NodeJS {
		interface Global {
			//   log: any;
		}
	}
}
