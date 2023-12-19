import { describe, test, it, expect } from "vitest";
import { Datasets } from "../src/datasets";

describe("Datasets", () => {
	it("should throw if not known", async () => {
		await expect(Datasets.getDataset("")).rejects.toThrow(Error);
	});
	// should do this but skipped in function of npmjs release and Github workflow
	it.skip(
		"should fetch food json",
		async () => {
			Datasets.clearCache();
			const dataset = await Datasets.getDataset("food");
			expect(dataset || null).not.toBeNull();
			expect(dataset.schema || null).not.toBeNull();
			expect(Datasets.cachedItemExists("food.json")).toBeTruthy();
		},
		{ timeout: 30000 },
	);
});
