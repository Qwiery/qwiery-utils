import fs from "fs";
import _ from "lodash";
import path from "path";
import {Utils} from "~/utils";

/**
 * Shared utility functions for managing datasets.
 */
const DatasetUtils = {
    /**
     * This clears the datasets directory.
     */
    clearDatasetCache() {
        DatasetUtils.ensureDatasetsDirectory();
        const files = fs.readdirSync(DatasetUtils.datasetsPath);
        for (let i = 0; i < files.length; i++) {
            fs.unlinkSync(path.join(DatasetUtils.datasetsPath, files[i]));
        }
    },

    /**
     * This returns true if the dataset file exists.
     * @param datasetName {string} The name of the dataset file.
     * @return {boolean} True if the dataset file exists.
     */
    datasetFileExists(datasetName: string): boolean {
        // check that datasetName has extension .json
        if (!datasetName.endsWith(".json")) {
            datasetName = datasetName + ".json";
        }
        const p = path.join(DatasetUtils.datasetsPath, datasetName);
        return fs.existsSync(p);
    },

    /**
     * This is the path to the datasets directory.
     * @return {string}
     */
    get datasetsPath(): string {
        // things like path.join(__dirname, "../../../datasets") doesnt work because __dirname is not recognized
        return "public/datasets";
    },

    /**
     * This ensures that the datasets directory exists.
     */
    ensureDatasetsDirectory() {
        if (!fs.existsSync("public")) {
            fs.mkdirSync("public");
        }
        if (!fs.existsSync(DatasetUtils.datasetsPath)) {
            fs.mkdirSync(DatasetUtils.datasetsPath);
        }
    },
};

/**
 * This is a simple utility to manage JSON datasets.
 */
const JsonDatasets = {
    get datasetUrls() {
        return {
            "food.json": "https://drive.google.com/uc?export=view&id=12DyKXT3LWMven_vUBNtwoZOARTRPolXc",
        };
    },
    /**
     * This returns the JSON object for the dataset if available on disk.
     * @param datasetName {string} The name of the dataset file.
     * @return {any|null}
     */
    getCachedJson(datasetName: string): any | null {
        DatasetUtils.ensureDatasetsDirectory();
        if (!DatasetUtils.datasetFileExists(datasetName)) {
            return null;
        } else {
            const p = path.join(DatasetUtils.datasetsPath, datasetName);
            return JSON.parse(fs.readFileSync(p, "utf8"));
        }
    },

    cachedExists(datasetName) {
        DatasetUtils.ensureDatasetsDirectory();
        return DatasetUtils.datasetFileExists(datasetName);
    },

    /**
     *  This fetches the file from Google Drive.
     * @param url {URL} The URL of the file.
     * @return {Promise<any>}
     */
    async fetchFromGoogleDrive(url: URL): Promise<any> {
        try {
            const res = await fetch(url);
            if (res.ok) {
                const json = await res.json();
                return json;
            } else {
                throw JSON.parse(await res.text());
            }
        } catch (e: any) {
            throw e.message;
        }
    },

    /**
     * This saves the dataset to the datasets directory.
     * @param datasetName {string} The name of the dataset file.
     * @param dataset {any} The dataset to save.
     */
    saveDataset(datasetName: string, dataset: any) {
        const p = path.join(DatasetUtils.datasetsPath, datasetName);
        if (_.isString(dataset)) {
            fs.writeFileSync(p, dataset);
        } else {
            fs.writeFileSync(p, JSON.stringify(dataset));
        }
    },

    /**
     * This is the main gateway to get a dataset.
     * @param datasetName {string} The name of the dataset file.
     * @return {Promise<*|null>} The dataset.
     */
    async getDataset(datasetName: string): Promise<any | null> {
        if (Utils.isEmpty(datasetName)) {
            throw new Error("datasetName is required");
        }
        // check that datasetName has extension .json
        if (!datasetName.endsWith(".json")) {
            datasetName = datasetName + ".json";
        }
        let found = JsonDatasets.getCachedJson(datasetName);
        if (found) {
            return found;
        } else {
            if (!JsonDatasets.datasetUrls[datasetName]) {
                throw new Error(`Dataset ${datasetName} is not known`);
            }
            try {
                const url = new URL(JsonDatasets.datasetUrls[datasetName]);
                found = await JsonDatasets.fetchFromGoogleDrive(url);
                JsonDatasets.saveDataset(datasetName, found);
                return found;
            } catch (e) {
                console.error(e);
                return null;
            }
        }
    },
};

const SqliteDatasets = {
    async getDataset(datasetName) {
        throw new Error("Not implemented");
    },
};
export const Datasets = {
    Json: JsonDatasets,
    Sqlite: SqliteDatasets,

    /**
     * This clears the datasets directory.
     */
    clearCache() {
        DatasetUtils.clearDatasetCache();
    },
    cachedItemExists(fileName) {
        // check that datasetName has an extension
        if (!fileName.indexOf(".")) {
            throw new Error(`Dataset ${fileName} should have an extension.`);
        }
        return DatasetUtils.datasetFileExists(fileName);
    },
    async getDataset(name, format = "json") {
        switch (format.toLowerCase()) {
            case "json":
                return await JsonDatasets.getDataset(name);
            case "sqlite":
                return await SqliteDatasets.getDataset(name);
            default:
                throw new Error(`Unsupported dataset format: ${format}`);
        }
    },
};
