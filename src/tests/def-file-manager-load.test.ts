import { DefManager } from "src/core/def-file-manager";

describe("DefManager definition load coordination", () => {
	it("coalesces concurrent refresh requests into one trailing reload", async () => {
		const manager = Object.create(DefManager.prototype) as any;
		manager.loadPromise = null;
		manager.reloadRequested = false;
		manager.reset = jest.fn();
		manager.updateActiveFile = jest.fn();

		let finishFirstLoad: () => void = () => {};
		const firstLoad = new Promise<void>((resolve) => {
			finishFirstLoad = resolve;
		});
		manager.loadGlobals = jest
			.fn()
			.mockReturnValueOnce(firstLoad)
			.mockResolvedValue(undefined);

		const activeLoad = manager.loadDefinitions();
		for (let index = 0; index < 20; index++) {
			expect(manager.loadDefinitions()).toBe(activeLoad);
		}
		finishFirstLoad();
		await activeLoad;

		expect(manager.loadGlobals).toHaveBeenCalledTimes(2);
		expect(manager.reset).toHaveBeenCalledTimes(2);
	});
});
