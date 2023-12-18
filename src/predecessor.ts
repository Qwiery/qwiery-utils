import { Utils } from "./utils.js";
import {Durations} from "./durations";

/**
 * A simple structure holding predecessor information.
 */
export class Predecessor {
	get delayDays() {
		if (Utils.isEmpty(this.delay)) {
			return 0;
		}
		return Durations.durationToDays(this.delay);
	}

	constructor(public id, public typeName, public delay) {

	}
}

