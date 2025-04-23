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
    const startTime = new Date(activities[lastActiveActivityIndex].startTime);
    const formattedTime = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}:${String(startTime.getSeconds()).padStart(2, '0')}`;
    document.getElementById("currentActivity").innerText = "Current Activity: " + activities[lastActiveActivityIndex].activity + " (since " + formattedTime + ")"
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