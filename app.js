// Storage helper functions
async function saveData(key, value) {
    try {
        await window.storage.set(key, JSON.stringify(value), false);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

async function loadData(key) {
    try {
        const result = await window.storage.get(key, false);
        return result ? JSON.parse(result.value) : null;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

async function deleteData(key) {
    try {
        await window.storage.delete(key, false);
        return true;
    } catch (error) {
        console.error('Error deleting data:', error);
        return false;
    }
}

async function listKeys(prefix) {
    try {
        const result = await window.storage.list(prefix, false);
        return result ? result.keys : [];
    } catch (error) {
        console.error('Error listing keys:', error);
        return [];
    }
}

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
const trackerData = {
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

const calorieData = [
	{ key: 'breakfast_food', label: 'Breakfast Food' },
	{ key: 'breakfast_cal', label: 'Breakfast Calories', type: 'calories' },
	{ key: 'snack_food', label: 'Snack Food' },
	{ key: 'snack_cal', label: 'Snack Calories', type: 'calories' },
	{ key: 'lunch_food', label: 'Lunch Food' },
	{ key: 'lunch_cal', label: 'Lunch Calories', type: 'calories' },
	{ key: 'dinner_food', label: 'Dinner Food' },
	{ key: 'dinner_cal', label: 'Dinner Calories', type: 'calories' }
];

// Tracker functions
let currentTrackerDate = getTodayString();

async function initializeTrackerView() {
	await loadTrackerData();
    currentTrackerDate = getTodayString();
    const dateInput = document.getElementById('tracker-date');
    if (dateInput) {
        dateInput.value = currentTrackerDate;
    }
    loadTrackerDataForDate();
}

/** Dictionary of daily tracking data by date */
const TRACKER_DATA = {};
async function loadTrackerData() {
	const allRecords = await AirtableService.loadTable('TRACKERS');
	console.log(allRecords)
	for (const record of allRecords) {
		const data = {
			recordId: record.recordId,
			...record,
		};
		TRACKER_DATA[data.date] = data;
	}
	console.log(TRACKER_DATA)
}

async function loadTrackerDataForDate() {
    const dateInput = document.getElementById('tracker-date');
    if (dateInput && dateInput.value) {
        currentTrackerDate = dateInput.value;
    }

    const displayDate = document.getElementById('current-tracker-date');
    if (displayDate) {
        displayDate.textContent = new Date(currentTrackerDate + 'T12:00:00').toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    }

    const savedData = TRACKER_DATA[currentTrackerDate];

	Object.keys(trackerData).forEach(category => {
		const container = document.getElementById(category);
		if (!container) return;
		
		container.innerHTML = '';
		
		trackerData[category].forEach((item) => {
			const div = document.createElement('div');
			div.className = 'checkbox-item';
			const id = `check_item-${item.key}`;
			div.id = id;
			const key = item.key;

			div.innerHTML = `
				<input type="checkbox" />
				<label for="${id}">${item.label}</label>
			`;

			div.addEventListener('click', async (e) => {
				const currentValue = getChecklistValue(key);
				const newValue = !currentValue;
				setChecklistValue(key, newValue);
				updateChecklistItem(id, newValue);
				if (newValue) {
					renderConfetti(e);
				}
				await saveTrackerData();
			});

			container.appendChild(div);
			updateChecklistItem(id, getChecklistValue(key));
		});
	});

	// Load calorie data
	calorieData.forEach(item => {
		const element = document.getElementById(item.key);
		if (element) {
			element.value = savedData && savedData[item.key] ? savedData[item.key] : '';
			element.removeEventListener('input', debounceSaveTrackerData);
			element.addEventListener('input', debounceSaveTrackerData);
		}
	});
    
    updateCalorieTotal();
}

function getChecklistValue(key) {
	return TRACKER_DATA[currentTrackerDate][key];
}
function setChecklistValue(key, value) {
	return TRACKER_DATA[currentTrackerDate][key] = value;
}

function updateChecklistItem(id, isChecked) {
	const div = document.getElementById(id);
	div.className = 'checkbox-item';
	const input = div.querySelector('input');

	if (isChecked) {
		div.classList.add('checked');
		input.checked = true;
	}
	else {
		div.classList.remove('checked');
		input.checked = false;
	}
}

async function saveTrackerData() {
    const data = {};
    
	Object.keys(trackerData).forEach(category => {
		trackerData[category].forEach((item) => {
			const checkbox = document.querySelector(`#check_item-${item.key} input`);
			if (checkbox) {
				data[item.key] = checkbox.checked;
			}
		});
	});

    // Save calorie data
	calorieData.forEach(item => {
		const element = document.getElementById(item.key);
		if (element) {
			data[item.key] = item.type === 'calories' ? Number(element.value) : element.value;
		}
	});

	const savedRecord = TRACKER_DATA[currentTrackerDate];
	const newRecord = {
		recordId: savedRecord?.recordId,
		...data,
		date: currentTrackerDate,
	}
	const [updatedRecord] = await AirtableService.upsertRecords('TRACKERS', [newRecord]);
	if (updatedRecord) {
		TRACKER_DATA[updatedRecord.date] = updatedRecord;
	}
	updateCalorieTotal();
}


const inputDebounceTime = 1000;
let saveTrackerTimeout = null;
function debounceSaveTrackerData() {
	if (saveTrackerTimeout) return;
	saveTrackerTimeout = setTimeout(async () => {
		await saveTrackerData();
		saveTrackerTimeout = null;
	}, inputDebounceTime);
}


// Calorie tracking
function updateCalorieTotal() {
    const calorieInputs = calorieData.filter(d => d.type === 'calories').map(d => d.key);
    let total = 0;
    
    calorieInputs.forEach(id => {
        const element = document.getElementById(id);
        const value = element ? parseInt(element.value) || 0 : 0;
        total += value;
    });

    const totalElement = document.getElementById('total_cal');
    if (totalElement) {
        totalElement.textContent = total;
    }

    const statusDiv = document.getElementById('calorie-status');
    if (!statusDiv) return;

    if (total === 0) {
        statusDiv.textContent = 'Enter your meals above';
        statusDiv.style.background = 'rgba(255,255,255,0.2)';
    } else if (total < 1800) {
        statusDiv.textContent = '⚠️ Too few calories - eat more!';
        statusDiv.style.background = 'rgba(244, 67, 54, 0.3)';
    } else if (total >= 1800 && total <= 2200) {
        statusDiv.textContent = '✓ Perfect! You\'re in the healthy range!';
        statusDiv.style.background = 'rgba(76, 175, 80, 0.4)';
    } else if (total > 2200 && total <= 2400) {
        statusDiv.textContent = '⚠️ Slightly over goal';
        statusDiv.style.background = 'rgba(255, 152, 0, 0.3)';
    } else {
        statusDiv.textContent = '⚠️ Too many calories';
        statusDiv.style.background = 'rgba(244, 67, 54, 0.3)';
    }
}

// Journal functions
let currentJournalDate = getTodayString();

function setJournalToday() {
    currentJournalDate = getTodayString();
    const dateInput = document.getElementById('journal-date');
    if (dateInput) {
        dateInput.value = currentJournalDate;
    }
    loadJournalData();
}

async function loadJournalData() {
    const dateInput = document.getElementById('journal-date');
    if (dateInput && dateInput.value) {
        currentJournalDate = dateInput.value;
    }

    const displayDate = document.getElementById('journal-entry-date');
    if (displayDate) {
        displayDate.textContent = new Date(currentJournalDate + 'T12:00:00').toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    }

    const storageKey = `journal_${currentJournalDate}`;
    const savedJournal = await loadData(storageKey);

    const textArea = document.getElementById('journal-text');
    if (textArea) {
        textArea.value = savedJournal ? savedJournal.text : '';
    }
}

async function saveJournal() {
    const textArea = document.getElementById('journal-text');
    if (!textArea) return;
    
    const text = textArea.value;
    const storageKey = `journal_${currentJournalDate}`;
    
    await saveData(storageKey, {
        text: text,
        date: currentJournalDate,
        timestamp: new Date().toISOString()
    });

    alert('✅ Journal entry saved!');
    loadRecentJournals();
}

async function loadRecentJournals() {
    const keys = await listKeys('journal_');
    const journals = [];

    for (const key of keys) {
        const data = await loadData(key);
        if (data && data.text) {
            journals.push(data);
        }
    }

    journals.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent = journals.slice(0, 10);

    const container = document.getElementById('recent-journals');
    if (!container) return;

    if (recent.length === 0) {
        container.innerHTML = '<p style="color: #666;">No journal entries yet. Start writing!</p>';
        return;
    }

    container.innerHTML = recent.map(entry => `
        <div class="saved-journal">
            <h4>
                ${new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
                <button class="delete-btn" onclick="deleteJournal('${entry.date}')">Delete</button>
            </h4>
            <p>${entry.text}</p>
        </div>
    `).join('');
}

async function deleteJournal(date) {
    if (confirm('Are you sure you want to delete this journal entry?')) {
        await deleteData(`journal_${date}`);
        loadRecentJournals();
    }
}

// Progress tracking helper functions
function countChecked(data) {
    let count = 0;
    Object.keys(data).forEach(category => {
        if (category !== 'calories' && Array.isArray(data[category])) {
            data[category].forEach(checked => {
                if (checked) count++;
            });
        }
    });
    return count;
}

function countTotal(data) {
    let count = 0;
    Object.keys(data).forEach(category => {
        if (category !== 'calories' && Array.isArray(data[category])) {
            count += data[category].length;
        }
    });
    return count;
}

function calculateTotalCalories(calories) {
    return (parseInt(calories.breakfastCal) || 0) +
           (parseInt(calories.snackCal) || 0) +
           (parseInt(calories.lunchCal) || 0) +
           (parseInt(calories.dinnerCal) || 0);
}

async function loadProgressData() {
    const keys = await listKeys('tracker_');
    const allData = [];

    for (const key of keys) {
        const data = await loadData(key);
        if (data) {
            const date = key.replace('tracker_', '');
            allData.push({ date, data });
        }
    }

    allData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate overall stats
    let totalDays = allData.length;
    let totalChecked = 0;
    let totalPossible = 0;
    let daysWithAllMeals = 0;
    let daysInCalorieRange = 0;

    allData.forEach(entry => {
        Object.keys(entry.data).forEach(category => {
            if (category !== 'calories' && Array.isArray(entry.data[category])) {
                entry.data[category].forEach(checked => {
                    totalPossible++;
                    if (checked) totalChecked++;
                });
            }
        });

        if (entry.data.calories) {
            const hasAllMeals = entry.data.calories.breakfastCal && 
                               entry.data.calories.lunchCal && 
                               entry.data.calories.dinnerCal;
            if (hasAllMeals) daysWithAllMeals++;

            const total = calculateTotalCalories(entry.data.calories);
            if (total >= 1800 && total <= 2200) daysInCalorieRange++;
        }
    });

    const completionRate = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;

    // Display overall stats
    const statsContainer = document.getElementById('overall-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${totalDays}</div>
                <div class="stat-label">Days Tracked</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${completionRate}%</div>
                <div class="stat-label">Task Completion</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${daysWithAllMeals}</div>
                <div class="stat-label">Days with All Meals</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${daysInCalorieRange}</div>
                <div class="stat-label">Days in Calorie Range</div>
            </div>
        `;
    }

    // Last 7 days
    const last7 = allData.slice(0, 7);
    const weekContainer = document.getElementById('week-history');
    if (weekContainer) {
        if (last7.length === 0) {
            weekContainer.innerHTML = '<p style="color: #666;">No data for the last 7 days</p>';
        } else {
            weekContainer.innerHTML = last7.map(entry => {
                const checked = countChecked(entry.data);
                const total = countTotal(entry.data);
                const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
                return `
                    <div class="saved-journal">
                        <h4>${new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { 
                            weekday: 'long', month: 'short', day: 'numeric' 
                        })}</h4>
                        <p>Completed: ${checked} / ${total} tasks (${percent}%)</p>
                        ${entry.data.calories ? `<p>Calories: ${calculateTotalCalories(entry.data.calories)}</p>` : ''}
                    </div>
                `;
            }).join('');
        }
    }

    // Last 30 days
    const last30 = allData.slice(0, 30);
    const monthContainer = document.getElementById('month-history');
    if (monthContainer) {
        if (last30.length === 0) {
            monthContainer.innerHTML = '<p style="color: #666;">No data for the last 30 days</p>';
        } else {
            monthContainer.innerHTML = last30.map(entry => {
                const checked = countChecked(entry.data);
                const total = countTotal(entry.data);
                const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
                return `
                    <div class="saved-journal">
                        <h4>${new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                        })}</h4>
                        <p>Completed: ${checked} / ${total} tasks (${percent}%)</p>
                        ${entry.data.calories ? `<p>Calories: ${calculateTotalCalories(entry.data.calories)}</p>` : ''}
                    </div>
                `;
            }).join('');
        }
    }
}

async function updateHomeStats() {
    const storageKey = `tracker_${getTodayString()}`;
    const todayData = await loadData(storageKey);

    const statsContainer = document.getElementById('home-stats');
    if (!statsContainer) return;

    if (!todayData) {
        statsContainer.innerHTML = '<p style="color: #666;">No data tracked for today yet</p>';
        return;
    }

    const checked = countChecked(todayData);
    const total = countTotal(todayData);
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    const calories = todayData.calories ? calculateTotalCalories(todayData.calories) : 0;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${percent}%</div>
            <div class="stat-label">Tasks Complete</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${checked}/${total}</div>
            <div class="stat-label">Checked Today</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${calories}</div>
            <div class="stat-label">Calories</div>
        </div>
    `;
}

// Schedule page functions - COMPLETE WITH ALL DETAILS
function showSchedule(day) {
    const scheduleContent = document.getElementById('schedule-content');
    if (!scheduleContent) return;
    
    let html = '';

    if (day === 'Monday' || day === 'Wednesday' || day === 'Friday') {
        html = `
            <div class="card" style="background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; text-align: center;">
                <h3 style="color: white; margin: 0;">💪 Gym Day Schedule</h3>
                <p style="margin: 0.5rem 0 0 0; opacity: 0.95;">You go to the gym with Mindy</p>
            </div>

            <h3>Morning Block (8:30 AM - 12:30 PM)</h3>
            
            <div class="schedule-block">
                <div class="schedule-time">8:30 - 9:00 AM</div>
                <div class="schedule-title">🌅 Wake Up & Morning Personal Care</div>
                <div class="schedule-details">✓ Compression socks first ✓ Bathroom ✓ Wash face ✓ Brush teeth (2 min) ✓ Comb hair ✓ Get dressed ✓ Apply deodorant ✓ Drink 16 oz water</div>
            </div>

            <div class="schedule-block meal">
                <div class="schedule-time">9:00 - 9:45 AM</div>
                <div class="schedule-title">🍳 Breakfast (Mindy has this ready)</div>
                <div class="schedule-details">PCOS & gout-friendly, egg-free meal. Examples: Steel-cut oats with berries, smoothie bowl, avocado toast.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">9:45 - 10:00 AM</div>
                <div class="schedule-title">🚶 Post-Meal Movement & Kitchen Help</div>
                <div class="schedule-details">10-minute gentle walk OR calf raises, squats, light stretching. Help Mindy clean up.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">10:00 - 10:30 AM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #1</div>
                <div class="schedule-details">Complete rest, lying flat. Set timer for 30 minutes. NO screens - just rest.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">10:30 - 11:00 AM</div>
                <div class="schedule-title">💬 Speech Therapy Exercises (SITTING)</div>
                <div class="schedule-details">Follow your speech therapy app. Reading aloud, vocal exercises, breathing techniques.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">11:00 - 11:05 AM</div>
                <div class="schedule-title">🎒 Prepare for Gym</div>
                <div class="schedule-details">Gather gym bag (towel, water, phone with PT app). Use bathroom. Walk to car with Mindy.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">11:05 - 11:20 AM</div>
                <div class="schedule-title">🚗 Travel to Gym</div>
                <div class="schedule-details">15-minute drive. Sit, relax, listen to music.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">11:20 AM - 12:20 PM</div>
                <div class="schedule-title">💪 PHYSICAL THERAPY AT GYM</div>
                <div class="schedule-details">10 min warm-up (recumbent bike) → 15 min active → 5 min cool-down → Rest 5 min → 1 hour strength training. Remember: Movement is SAFE. You're retraining your nervous system!</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">12:20 - 12:35 PM</div>
                <div class="schedule-title">🚗 Travel Home</div>
                <div class="schedule-details">15-minute drive. Acknowledge: You exercised and you're safe!</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">12:35 - 1:05 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #2</div>
                <div class="schedule-details">CRITICAL post-exercise recovery. Lie flat, drink water. NO phone - body needs full recovery.</div>
            </div>

            <h3>Midday Block (1:05 PM - 5:00 PM)</h3>

            <div class="schedule-block meal">
                <div class="schedule-time">1:05 - 1:50 PM</div>
                <div class="schedule-title">🥗 Lunch</div>
                <div class="schedule-details">Substantial PCOS & gout-friendly meal. Examples: Chicken quinoa bowl, turkey wrap, lentil soup.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">1:50 - 2:05 PM</div>
                <div class="schedule-title">🚶 Post-Meal Movement & Kitchen Help</div>
                <div class="schedule-details">10-minute gentle walk. Help clean dishes (sit and dry).</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">2:05 - 2:35 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #3</div>
                <div class="schedule-details">Post-meal rest. Lie flat, set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">2:35 - 3:35 PM</div>
                <div class="schedule-title">🎨 OT & Creative Time (SITTING)</div>
                <div class="schedule-details">First 30 min: OT exercises. Second 30 min: Art OR reading aloud.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">3:35 - 4:05 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #4</div>
                <div class="schedule-details">Afternoon rest. Lie flat, set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">4:05 - 5:00 PM</div>
                <div class="schedule-title">✨ Light Cleaning OR Creative Activity</div>
                <div class="schedule-details">Help with light cleaning OR continue art project OR gentle stretching.</div>
            </div>

            <h3>Evening Block (5:00 PM - 10:00 PM)</h3>

            <div class="schedule-block meal">
                <div class="schedule-time">5:00 - 5:45 PM</div>
                <div class="schedule-title">🍽️ Dinner</div>
                <div class="schedule-details">Help Mindy prep. Eat dinner. FINISH BY 6:00 PM!</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">5:45 - 6:00 PM</div>
                <div class="schedule-title">🧹 Post-Meal Movement & Cleanup</div>
                <div class="schedule-details">10-minute walk. Help clean up.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">6:00 - 6:30 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #5</div>
                <div class="schedule-details">Post-meal/cleanup rest. Lie flat for digestion.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">6:30 - 7:00 PM</div>
                <div class="schedule-title">🚿 Evening Personal Hygiene</div>
                <div class="schedule-details">Shower OR wash face/freshen up. Full hygiene routine.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">7:00 - 7:30 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #6</div>
                <div class="schedule-details">Post-hygiene rest. Lie flat, set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">7:30 - 8:30 PM</div>
                <div class="schedule-title">📚 Evening Activity (SITTING) 📵 NO SCREENS AFTER 8 PM</div>
                <div class="schedule-details">Art, reading aloud, audio book, conversation with Mindy. Dim lights at 8 PM.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">8:30 - 9:00 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #7</div>
                <div class="schedule-details">Pre-bedtime rest. Practice gratitude (3 things).</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">9:00 - 9:30 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #8</div>
                <div class="schedule-details">Continue resting. Can read while lying down.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">9:30 - 10:00 PM</div>
                <div class="schedule-title">🌙 Evening Wind-Down</div>
                <div class="schedule-details">Bathroom, brush teeth (2 min), floss, wash face, wash feet, breathing exercises, prepare bedroom for sleep.</div>
            </div>

            <div class="alert-box" style="border-color: #4caf50; background: #e8f5e9;">
                <h4 style="color: #2e7d32; margin: 0 0 0.5rem 0;">💚 Gym Day Totals</h4>
                <p style="margin: 0;"><strong>Lying Down Rest:</strong> 4 hours (8 periods) - Need 2 more 30-min periods</p>
                <p style="margin: 0;"><strong>Exercise:</strong> 1.5 hours gym PT + 30 min post-meal = 2 hours ✓</p>
                <p style="margin: 0;"><strong>Last eating time:</strong> 6:00 PM</p>
            </div>
        `;
    } else if (day === 'Sunday') {
        html = `
            <div class="card" style="background: linear-gradient(135deg, #9c27b0, #ab47bc); color: white; text-align: center;">
                <h3 style="color: white; margin: 0;">⛪ Sunday Schedule (Church & Rest Day)</h3>
                <p style="margin: 0.5rem 0 0 0; opacity: 0.95;">Your lightest day - church, family time, and extra rest</p>
            </div>

            <h3>Morning (8:30 AM - 11:30 AM)</h3>

            <div class="schedule-block">
                <div class="schedule-time">8:30 - 9:00 AM</div>
                <div class="schedule-title">🌅 Wake Up & Morning Personal Care</div>
                <div class="schedule-details">Take extra time to prepare for church. Dress in church clothes. Extra attention to hair.</div>
            </div>

            <div class="schedule-block meal">
                <div class="schedule-time">9:00 - 9:45 AM</div>
                <div class="schedule-title">🍳 Breakfast</div>
                <div class="schedule-details">Same as other days - Mindy has this ready.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">9:45 - 10:00 AM</div>
                <div class="schedule-title">🚶 Post-Meal Movement</div>
                <div class="schedule-details">10-minute gentle walk. Help clean up.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">10:00 - 10:30 AM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #1</div>
                <div class="schedule-details">Post-meal rest.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">10:30 - 10:50 AM</div>
                <div class="schedule-title">🧘 Exercise: Gentle Movement</div>
                <div class="schedule-details">20 minutes: Very light activity. Gentle stretching, slow walk, light yoga. Very low intensity (rest day!).</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">10:50 - 11:20 AM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #2</div>
                <div class="schedule-details">Post-exercise rest.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">11:20 - 11:30 AM</div>
                <div class="schedule-title">🎒 Final Church Preparation</div>
                <div class="schedule-details">Gather items: scriptures, water bottle, small snack. Use bathroom. Walk to car with Mindy.</div>
            </div>

            <h3>Church (11:30 AM - 1:30 PM)</h3>

            <div class="schedule-block">
                <div class="schedule-time">11:30 AM - 1:30 PM</div>
                <div class="schedule-title">⛪ Church Services & Fellowship</div>
                <div class="schedule-details">2 hours of sitting/standing/social interaction. Low-intensity but can be exhausting. Bring water bottle. You'll rest after!</div>
            </div>

            <h3>Afternoon & Evening (1:30 PM - 10:00 PM)</h3>

            <div class="schedule-block rest">
                <div class="schedule-time">1:30 - 2:00 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #3</div>
                <div class="schedule-details">CRITICAL post-church recovery. Social interaction is very draining.</div>
            </div>

            <div class="schedule-block meal">
                <div class="schedule-time">2:00 - 2:45 PM</div>
                <div class="schedule-title">🥗 Lunch</div>
                <div class="schedule-details">Substantial meal. Eat with Mindy.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">2:45 - 3:00 PM</div>
                <div class="schedule-title">🚶 Post-Meal Movement</div>
                <div class="schedule-details">10-minute gentle walk. Help clean up.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">3:00 - 3:30 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #4</div>
                <div class="schedule-details">Post-meal rest.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">3:30 - 4:30 PM</div>
                <div class="schedule-title">📖 Restful Activity (SITTING)</div>
                <div class="schedule-details">Scripture study, journaling, light reading OR help Mindy with meal prep OR art time. Keep it calm!</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">4:30 - 5:00 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #5</div>
                <div class="schedule-details">Afternoon rest.</div>
            </div>

            <div class="schedule-block meal">
                <div class="schedule-time">5:00 - 6:00 PM</div>
                <div class="schedule-title">🍽️ Dinner</div>
                <div class="schedule-details">Help Mindy, eat dinner (FINISH BY 6 PM!), post-meal walk (10 min), help cleanup.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">6:00 - 6:30 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #6</div>
                <div class="schedule-details">Post-meal/cleanup rest.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">6:30 - 7:30 PM</div>
                <div class="schedule-title">🎲 Family Game Time!</div>
                <div class="schedule-details">30-45 minutes: Card games or board games with Mindy's family. Sit at table, enjoy family time. This is FUN but uses social energy!</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">7:30 - 8:00 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #7</div>
                <div class="schedule-details">Post-game recovery. Social activity is tiring even when fun!</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">8:00 - 8:30 PM</div>
                <div class="schedule-title">📚 Evening Reflection (SITTING) 📵 NO SCREENS AFTER 8 PM</div>
                <div class="schedule-details">Scripture study, gratitude journaling, review the week, set intentions for Monday. Calm, reflective activities.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">8:30 - 9:00 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #8</div>
                <div class="schedule-details">Pre-bedtime rest. Gratitude (3 things). Calm mind for sleep.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">9:00 - 9:30 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #9</div>
                <div class="schedule-details">Continue resting. Can read while lying down.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">9:30 - 10:00 PM</div>
                <div class="schedule-title">🌙 Evening Wind-Down</div>
                <div class="schedule-details">Bathroom, teeth, face, feet, breathing, remove compression socks, bedroom prep.</div>
            </div>

            <div class="alert-box" style="border-color: #9c27b0; background: #f3e5f5;">
                <h4 style="color: #7b1fa2; margin: 0 0 0.5rem 0;">💜 Sunday Totals</h4>
                <p style="margin: 0;"><strong>Lying Down Rest:</strong> 4.5 hours (9 periods) - Need 1.5 more hours</p>
                <p style="margin: 0;"><strong>Exercise:</strong> 20 min gentle + 30 min post-meal = 50 minutes (lightest day)</p>
                <p style="margin: 0;"><strong>Special:</strong> Church (2 hrs sitting) + Family Game Time!</p>
            </div>
        `;
    } else {
        html = `
            <div class="card" style="background: linear-gradient(135deg, #2196f3, #42a5f5); color: white; text-align: center;">
                <h3 style="color: white; margin: 0;">🏠 Home Exercise Day Schedule</h3>
                <p style="margin: 0.5rem 0 0 0; opacity: 0.95;">Light PT maintenance at home - 6 exercise bursts throughout the day</p>
            </div>

            <h3>Morning Block (8:30 AM - 12:30 PM)</h3>
            
            <div class="schedule-block">
                <div class="schedule-time">8:30 - 9:00 AM</div>
                <div class="schedule-title">🌅 Wake Up & Morning Personal Care</div>
                <div class="schedule-details">✓ Compression socks first ✓ Bathroom ✓ Wash face ✓ Brush teeth (2 min) ✓ Comb hair ✓ Get dressed ✓ Apply deodorant ✓ Drink 16 oz water</div>
            </div>

            <div class="schedule-block meal">
                <div class="schedule-time">9:00 - 9:45 AM</div>
                <div class="schedule-title">🍳 Breakfast (Mindy has this ready)</div>
                <div class="schedule-details">PCOS & gout-friendly, egg-free meal. Examples: Steel-cut oats with berries, smoothie bowl, avocado toast.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">9:45 - 10:00 AM</div>
                <div class="schedule-title">🚶 Post-Meal Movement & Kitchen Help</div>
                <div class="schedule-details">10-minute gentle walk OR calf raises, squats, light stretching. Help Mindy clean up.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">10:00 - 10:30 AM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #1</div>
                <div class="schedule-details">Complete rest, lying flat. Set timer for 30 minutes. NO screens - just rest.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">10:30 - 10:50 AM</div>
                <div class="schedule-title">💪 EXERCISE BURST #1: Bodyweight Strength</div>
                <div class="schedule-details">20 minutes: Wall push-ups, chair squats, standing leg lifts, arm circles, heel raises. Do each exercise for 2 minutes, rest 1 minute between. Movement is SAFE!</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">10:50 - 11:20 AM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #2</div>
                <div class="schedule-details">Post-exercise rest. Lie flat, drink water. Set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">11:20 - 11:35 AM</div>
                <div class="schedule-title">💬 Speech Therapy Exercises (SITTING)</div>
                <div class="schedule-details">Follow your speech therapy app. Reading aloud, vocal exercises, breathing techniques.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">11:35 - 11:55 AM</div>
                <div class="schedule-title">💪 EXERCISE BURST #2: Cardio Intervals</div>
                <div class="schedule-details">20 minutes: March in place (2 min) → Side steps (2 min) → Arm movements (2 min). Repeat 3 times. Keep it gentle but keep moving!</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">11:55 AM - 12:25 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #3</div>
                <div class="schedule-details">Post-exercise rest. Lie flat, set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">12:25 - 12:30 PM</div>
                <div class="schedule-title">🚶 Quick Movement Break</div>
                <div class="schedule-details">5-minute gentle walk or stretching before lunch.</div>
            </div>

            <h3>Midday Block (12:30 PM - 6:00 PM)</h3>

            <div class="schedule-block meal">
                <div class="schedule-time">12:30 - 1:15 PM</div>
                <div class="schedule-title">🥗 Lunch</div>
                <div class="schedule-details">Substantial PCOS & gout-friendly meal. Examples: Chicken quinoa bowl, turkey wrap, lentil soup.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">1:15 - 1:30 PM</div>
                <div class="schedule-title">🚶 Post-Meal Movement & Kitchen Help</div>
                <div class="schedule-details">10-minute gentle walk. Help clean dishes (sit and dry).</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">1:30 - 2:00 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #4</div>
                <div class="schedule-details">Post-meal rest. Lie flat, set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">2:00 - 2:20 PM</div>
                <div class="schedule-title">💪 EXERCISE BURST #3: Gentle Walk or Yoga</div>
                <div class="schedule-details">20 minutes: EITHER gentle walk around the block OR chair yoga (neck rolls, shoulder stretches, seated twists, breathing). Choose what feels good today.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">2:20 - 2:50 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #5</div>
                <div class="schedule-details">Post-exercise rest. Lie flat, set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">2:50 - 3:50 PM</div>
                <div class="schedule-title">🎨 OT & Creative Time (SITTING)</div>
                <div class="schedule-details">First 30 min: OT exercises. Second 30 min: Art OR reading aloud.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">3:50 - 4:20 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #6</div>
                <div class="schedule-details">Afternoon rest. Lie flat, set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">4:20 - 5:15 PM</div>
                <div class="schedule-title">✨ Light Cleaning OR Creative Activity</div>
                <div class="schedule-details">Help with light cleaning OR continue art project OR gentle stretching. Keep it calm and low-energy.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">5:15 - 5:45 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #7</div>
                <div class="schedule-details">Pre-dinner rest. Lie flat, set timer.</div>
            </div>

            <h3>Evening Block (5:45 PM - 10:00 PM)</h3>

            <div class="schedule-block meal">
                <div class="schedule-time">5:45 - 6:30 PM</div>
                <div class="schedule-title">🍽️ Dinner</div>
                <div class="schedule-details">Help Mindy prep. Eat dinner. FINISH BY 6:00 PM!</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">6:30 - 6:45 PM</div>
                <div class="schedule-title">🧹 Post-Meal Movement & Cleanup</div>
                <div class="schedule-details">10-minute walk. Help clean up.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">6:45 - 6:55 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #8</div>
                <div class="schedule-details">Quick 10-minute rest before exercise.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">6:55 - 7:15 PM</div>
                <div class="schedule-title">💪 EXERCISE BURST #4: Resistance Bands</div>
                <div class="schedule-details">20 minutes: Seated or standing band exercises. Arm pulls, leg presses, shoulder work. Light resistance, slow and controlled movements.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">7:15 - 7:40 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #9</div>
                <div class="schedule-details">Post-exercise rest. Lie flat, set timer.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">7:40 - 8:00 PM</div>
                <div class="schedule-title">💪 EXERCISE BURST #5: Stretching/Restorative Yoga</div>
                <div class="schedule-details">20 minutes: Gentle stretching. Focus on breathing, slow movements, releasing tension. This is CALM exercise to prepare for sleep.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">8:00 - 8:25 PM</div>
                <div class="schedule-title">📚 Evening Activity (SITTING) 📵 NO SCREENS AFTER 8 PM</div>
                <div class="schedule-details">Art, reading aloud, audio book, conversation with Mindy. Dim lights at 8 PM. Keep it calm.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">8:25 - 8:45 PM</div>
                <div class="schedule-title">💪 EXERCISE BURST #6: Gentle Movement/Tai Chi</div>
                <div class="schedule-details">20 minutes: Very gentle flowing movements OR slow walking OR simple tai chi moves. This is the GENTLEST exercise of the day. Wind down for sleep.</div>
            </div>

            <div class="schedule-block rest">
                <div class="schedule-time">8:45 - 9:15 PM</div>
                <div class="schedule-title">🛏️ LYING DOWN REST #10</div>
                <div class="schedule-details">Final rest before bedtime routine. Lie flat, practice gratitude (3 things).</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">9:15 - 9:45 PM</div>
                <div class="schedule-title">🚿 Evening Personal Hygiene</div>
                <div class="schedule-details">Shower OR wash face/freshen up. Bathroom, brush teeth (2 min), floss, wash face, wash feet. Full evening hygiene routine.</div>
            </div>

            <div class="schedule-block">
                <div class="schedule-time">9:45 - 10:00 PM</div>
                <div class="schedule-title">🌙 Evening Wind-Down</div>
                <div class="schedule-details">Final bathroom check, breathing exercises, remove compression socks, set out for morning, prepare bedroom for sleep.</div>
            </div>

            <div class="alert-box" style="border-color: #2196f3; background: #e3f2fd;">
                <h4 style="color: #1976d2; margin: 0 0 0.5rem 0;">💙 Home Day Totals</h4>
                <p style="margin: 0;"><strong>Lying Down Rest:</strong> 5 hours (10 periods) ✓ COMPLETE!</p>
                <p style="margin: 0;"><strong>Exercise:</strong> 6 bursts x 20 min = 2 hours ✓ COMPLETE!</p>
                <p style="margin: 0;"><strong>Speech/OT:</strong> Included in schedule ✓</p>
                <p style="margin: 0;"><strong>Last eating time:</strong> 6:00 PM ✓</p>
            </div>
        `;
    }

    scheduleContent.innerHTML = html;
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
	img.src = 'confetti.gif';
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