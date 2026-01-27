document.write(
    '<script src="https://cdn.jsdelivr.net/npm/airtable@0.11.4/lib/airtable.umd.min.js"></script>'
);

const API_KEY_CIPHER = 'p1a2t3A445m6J7T8j9Z0r1g2C3K4K576H7.819208192e324850607c849706172a344858637084900a122235415f6571809b0e122f3e415f6e72819c0d1226384e5263788194021329354b5d62738d9b001d2';
const BASE_ID = 'appFUYHViQUU0fu26';

const TABLES = {
    TRACKERS: 'tblrGFuwTXBPT1nR9',
    JOURNAL: 'tblVPu2AG8KkhpXC2',
    WEEKLY_NOTES: 'tblxtK0MO0FX7QBjO',
};

const BATCH_SIZE = 10;

const AirtableService = {
    constructor () {
        this.isInitialized = false;
    },

    _init() {
		// REQUIRES THE AIRTABLE SDK TO BE LOADED TO DOC PRIOR
		const apiKey = API_KEY_CIPHER.split('').filter((_, i) => i % 2 === 0).join('');
        this._base = new Airtable({apiKey}).base(BASE_ID);
        this.isInitialized = true;
        return this._base;
    },

    get base() {
        return this._base ?? this._init();
    },

	async loadTable(tableIdentifier, options = {}) {
        return (await this.base(TABLES[tableIdentifier] || tableIdentifier).select(options).all()).map(this.recordToJs);
	},

    async upsertRecords(tableName, records) {
		const toUpdate = records.filter(r => Boolean(r.recordId) === true);
		const toCreate = records.filter(r => Boolean(r.recordId) === false);

		let savedRecords = [];

        await this.batchOperation(toUpdate.map(this.jsToRecord), async batch => {
            savedRecords = savedRecords.concat(await this.base(TABLES[tableName] || tableName).update(batch));
        });

        await this.batchOperation(toCreate.map(this.jsToRecord), async batch => {
            savedRecords = savedRecords.concat(await this.base(TABLES[tableName] || tableName).create(batch));
        });

		return savedRecords.map(this.recordToJs);
    },

    async batchOperation(records, op) {
        if (records.length === 0) return [];

        records = [...records];

        let batches = [];
        while (records.length > 0) {
            batches.push(records.splice(0, BATCH_SIZE));
        }
        let res = await Promise.all(batches.map(op));
        return res.flat(1);
    },

    jsToRecord(file) {
		const id = file.recordId;
		delete file.recordId;

        return {
            id,
            fields: {
               ...file,
            }
        }
    },

    recordToJs(record) {
        return {
            recordId: record.id || null,
			...record.fields,
        }
    }
};
