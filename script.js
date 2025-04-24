function onLoad() {
    visualizeCurrentActivity();
}

function addNewActivity(newActivity) {
    let activities = loadActivitiesData();

    const lastActiveActivityIndex = activities.findIndex(activity => activity.endTime === null);

    if (lastActiveActivityIndex !== -1) {
        activities[lastActiveActivityIndex].endTime = new Date().toISOString();
    }

    activities.push(newActivity);

    const updatedJsonData = JSON.stringify(activities);
    localStorage.setItem('timeTrackerData', updatedJsonData);
}

function startNewActivity(activityName, tags = []) {
    const newActivity = {
        startTime: new Date().toISOString(),
        endTime: null,
        activity: activityName,
        tags: tags
    };
    addNewActivity(newActivity);
    visualizeCurrentActivity()
}

function visualizeCurrentActivity() {
    let activities = loadActivitiesData();
    if (activities.length === 0) {return;}
    const lastActiveActivityIndex = activities.findIndex(activity => activity.endTime === null);
    document.getElementById("currentActivity").innerText = "Current Activity: " + activities[lastActiveActivityIndex].activity + " (since: " + formatTime(activities[lastActiveActivityIndex].startTime) + ")"

    const historyContainer = document.getElementById("activityHistory");
    historyContainer.innerHTML = ``;
    let lastDate = null;
    let endTime = null;

    for (let i = 0; i < activities.length; i++) {
        if(formatDate(activities[i].startTime) !== lastDate) {
            historyContainer.innerHTML += `<p class="date-header">${formatDate(activities[i].startTime)}</p>`;
            lastDate = formatDate(activities[i].startTime);
        }

        if (activities[i].endTime == null) {
            endTime = "now";
        } else{
            endTime = formatTime(activities[i].endTime);
        }

        historyContainer.innerHTML += `
            <p class="time-header">${formatTime(activities[i].startTime)} - ${endTime}</p>
            <p class="activity-header">${activities[i].activity}</p>`;
    }
}

function formatTime(time) {
    const TimeVar = new Date(time);
    return `${String(TimeVar.getHours()).padStart(2, '0')}:${String(TimeVar.getMinutes()).padStart(2, '0')}`;
}

function formatDate(time) {
    const TimeVar = new Date(time);
    return `${String(TimeVar.getDay()).padStart(2, '0')}.${String(TimeVar.getMonth()).padStart(2, '0')}.${String(TimeVar.getFullYear()).padStart(2, '0')}`;
}

function exportActivities() {
    const storedJsonData = localStorage.getItem('timeTrackerData');
    if (!storedJsonData) {
        console.error("No data found in local storage to download.");
        return;
    }

    const blob = new Blob([storedJsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'time_tracker_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function addActivityButton() {
    startNewActivity(document.getElementById("activityName").value, document.getElementById("activityTag").value.split(";"));
    document.getElementById("activityName").value = "";
    document.getElementById("activityTag").value = "";
}

function loadActivitiesData() {
    const storedData = localStorage.getItem('timeTrackerData');
    let activities = [];

    if (storedData) {
        try {
            activities = JSON.parse(storedData);
        } catch (error) {
            console.error("Error parsing data from local storage:", error);
            activities = [];
        }
    }
    return activities;
}