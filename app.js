// console.log(localStorage.getItem('airtable_token'))
// alert(localStorage.getItem('airtable_token'))

// Before anything, verify access token. Also do this periodically
const blurDiv = document.createElement('div');
blurDiv.style.setProperty('display', 'block', 'important');
blurDiv.style.setProperty('opacity', '1', 'important');
blurDiv.style.setProperty('visibility', 'visible', 'important');
blurDiv.style.setProperty('position', 'fixed', 'important');
blurDiv.style.setProperty('top', '0', 'important');
blurDiv.style.setProperty('bottom', '0', 'important');
blurDiv.style.setProperty('left', '0', 'important');
blurDiv.style.setProperty('right', '0', 'important');
blurDiv.style.setProperty('backdrop-filter', 'blur(8px)', 'important');
blurDiv.style.setProperty('z-index', '99999', 'important');
document.body.appendChild(blurDiv);

async function verifyToken() {
	try {
		const isValid = await AirtableService.validateToken();
		console.log(isValid)
		if (!isValid) {
			document.body.appendChild(blurDiv);
			// allow DOM to re-render
			await new Promise(res => setTimeout(res, 100));
			document.body.style.overflow = "hidden";
			const newToken = prompt('Please provide an access token');
			alert(newToken)
			AirtableService.setToken(newToken);
		}
		else {
			blurDiv.remove();
			document.body.style.overflow = "unset";
		}
	}
	finally {
		setTimeout(verifyToken, 10000);
	}
}
setTimeout(verifyToken, 10);

// Date helpers
/**
 * @param {Date} date 
 * @returns 
 */
function formatDate(date) {
	var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function getTodayString() {
    return formatDate(new Date());
}

// Get current day
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = days[new Date().getDay()];

// Tracker data structure
const trackerChecklists = {
	'morning-checks': [
		{ key: 'check_socks_on', label: 'Compression socks put on FIRST' },
		{ key: 'check_bathroom', label: 'Used bathroom properly' },
		{ key: 'check_wash_face', label: 'Washed face' },
		{ key: 'check_brush_teeth_am', label: 'Brushed teeth (2 minutes)' },
		{ key: 'check_comb_hair', label: 'Combed hair, pulled back from face' },
		{ key: 'check_get_dressed', label: 'Got dressed in clean clothes' },
		{ key: 'check_deodorant', label: 'Applied deodorant' },
		{ key: 'check_water_am', label: 'Drank 16 oz water' }
	],
	'meals-checks': [
		{ key: 'check_breakfast', label: 'Ate breakfast' },
		{ key: 'check_breakfast_movement', label: 'Post-breakfast movement (10 min)' },
		{ key: 'check_snack', label: 'Ate snack' },
		{ key: 'check_lunch', label: 'Ate lunch' },
		{ key: 'check_lunch_movement', label: 'Post-lunch movement (10 min)' },
		{ key: 'check_dinner', label: 'Ate dinner (BEFORE 6 PM)' },
		{ key: 'check_dinner_movement', label: 'Post-dinner movement (10 min)' },
		{ key: 'check_water_total', label: 'Drank 80-100 oz water today' }
	],
	'exercise-checks': [
		{ key: 'check_pt_gym_exercise', label: 'Completed PT/gym session OR exercise bursts' },
		{ key: 'check_speech_therapy', label: 'Speech therapy exercises' },
		{ key: 'check_ot_exercise', label: 'OT exercises' },
		{ key: 'check_movement_safe', label: 'All movement felt safe' }
	],
	'rest-checks': [
		{ key: 'check_rest_1', label: 'REST #1' },
		{ key: 'check_rest_2', label: 'REST #2' },
		{ key: 'check_rest_3', label: 'REST #3' },
		{ key: 'check_rest_4', label: 'REST #4' },
		{ key: 'check_rest_5', label: 'REST #5' },
		{ key: 'check_rest_6', label: 'REST #6' },
		{ key: 'check_rest_7', label: 'REST #7' },
		{ key: 'check_rest_8', label: 'REST #8' },
		{ key: 'check_rest_9', label: 'REST #9 (if applicable)' },
		{ key: 'check_rest_10', label: 'REST #10 (if applicable)' },
		{ key: 'check_unscheduled_lie_down', label: 'Did NOT lie down outside scheduled times' }
	],
	'evening-checks': [
		{ key: 'check_evening_clean', label: 'Showered OR washed face/freshened up' },
		{ key: 'check_evening_brush_teeth', label: 'Brushed teeth (2 minutes)' },
		{ key: 'check_floss', label: 'Flossed' },
		{ key: 'check_mouthwash', label: 'Used mouthwash' },
		{ key: 'check_evening_wash_face', label: 'Washed face' },
		{ key: 'check_wash_feet', label: 'Washed feet' },
		{ key: 'check_moisturize', label: 'Moisturized' },
		{ key: 'check_socks_off', label: 'Removed compression socks' },
		{ key: 'check_evening_breathing', label: 'Evening breathing exercises' }
	]
};

const calorieFields = [
	{ key: 'breakfast_food', label: 'Breakfast Food' },
	{ key: 'breakfast_cal', label: 'Breakfast Calories', type: 'calories' },
	{ key: 'snack_food', label: 'Snack Food' },
	{ key: 'snack_cal', label: 'Snack Calories', type: 'calories' },
	{ key: 'lunch_food', label: 'Lunch Food' },
	{ key: 'lunch_cal', label: 'Lunch Calories', type: 'calories' },
	{ key: 'dinner_food', label: 'Dinner Food' },
	{ key: 'dinner_cal', label: 'Dinner Calories', type: 'calories' }
];

const weekNoteFields = [
	{ key: "energyBest", dataType: 'string' },
	{ key: "energyWorst", dataType: 'string' },
	{ key: "energyHelp", dataType: 'string' },
	{ key: "energyDrain", dataType: 'string' },
	{ key: "painLevel", dataType: 'number' },
	{ key: "tremorLevel", dataType: 'number' },
	{ key: "tremorTrigger", dataType: 'string' },
	{ key: "tremorCalm", dataType: 'string' },
	{ key: "waterIntake", dataType: 'string' },
	{ key: "speechWins", dataType: 'string' },
	{ key: "otCompleted", dataType: 'string' },
	{ key: "ptImprovements", dataType: 'string' },
	{ key: "skillsMastering", dataType: 'string' },
	{ key: "goal1", dataType: 'string' },
	{ key: "goal2", dataType: 'string' },
	{ key: "goal3", dataType: 'string' },
];

/** Dictionary of daily tracking data by date */
const TRACKER_DATA = {};
async function loadTrackerData() {
	const allRecords = await AirtableService.loadTable(TABLES.TRACKERS);
	for (const record of allRecords) {
		const data = {
			recordId: record.recordId,
			...record,
		};
		TRACKER_DATA[data.date] = data;
	}
}

const JOURNAL_DATA = {};
async function loadJournalData() {
	const allRecords = await AirtableService.loadTable(TABLES.JOURNAL);
	for (const record of allRecords) {
		const data = {
			recordId: record.recordId,
			...record,
		};
		JOURNAL_DATA[data.date] = data;
	}
}

const NOTES_DATA = {};
async function loadNotesData() {
	const allRecords = await AirtableService.loadTable(TABLES.WEEKLY_NOTES);
	for (const record of allRecords) {
		const data = {
			recordId: record.recordId,
			...record,
		};
		NOTES_DATA[data.weekStart_sunday] = data;
	}
}

// Progress tracking helper functions
function countChecked(data) {
    let count = 0;
    Object.values(trackerChecklists).forEach(categoryChecks => {
		for (const check of categoryChecks) {
			if (data[check.key]) count++;
		}
    });
    return count;
}

function countTotal() {
    let count = 0;
    Object.values(trackerChecklists).forEach(categoryChecks => {
		count += categoryChecks.length;
    });
    return count;
}

function calculateTotalCalories(calories) {
    return (parseInt(calories?.breakfast_cal) || 0) +
           (parseInt(calories?.snack_cal) || 0) +
           (parseInt(calories?.lunch_cal) || 0) +
           (parseInt(calories?.dinner_cal) || 0);
}

const CONFETTI_DURATION = 1100;

function renderConfetti(event = null) {
	let x = '50%';
	let y = '50%';

	// compute element center
	if (event.clientX && event.clientY) {
		x = String(event.clientX) + 'px';
		y = String(event.clientY) + 'px';
	}
	else if (event?.target) {
		const rect = event.target.getBoundingClientRect();
		const elLeft = rect.x;
		const elTop = rect.y;
		x = String(elLeft + rect.width / 2) + 'px';
		y = String(elTop + rect.height / 2) + 'px';
	}

	const img = document.createElement('img');
	img.src = 'confetti.gif?' + Date.now(); // variable url to keep each gif separate
	img.width = 150;
	img.style.position = 'fixed';
	img.style.top = String(y);
	img.style.left = String(x);
	img.style.translate = '-25% -65%';
	img.style.pointerEvents = 'none';

	img.onload = () => {
		document.body.appendChild(img);
		setTimeout(() => img.remove(), CONFETTI_DURATION);
	}
}