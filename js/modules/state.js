// Central Data Store for NexBoard - Clean Production State

// Clean Default Initial Workspace
const initialProjects = [
    { id: 'redesign', name: 'My Workspace', color: 'redesign', active: true }
];

const initialMembers = {
    admin: { name: 'Admin', role: 'Owner', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0d9488&color=fff&bold=true', status: 'online' }
};

export const columns = [
    { id: 'backlog', name: 'Backlog', icon: 'fa-briefcase', class: 'bg-backlog', indicator: 'indicator-backlog' },
    { id: 'todo', name: 'To Do', icon: 'fa-inbox', class: 'bg-todo', indicator: 'indicator-todo' },
    { id: 'inprogress', name: 'In Progress', icon: 'fa-circle-notch', class: 'bg-inprogress', indicator: 'indicator-inprogress' },
    { id: 'review', name: 'Review', icon: 'fa-award', class: 'bg-review', indicator: 'indicator-review' },
    { id: 'done', name: 'Done', icon: 'fa-circle-check', class: 'bg-done', indicator: 'indicator-done' }
];

const initialTasks = [];
const initialActivities = [];

// Load arrays from LocalStorage if available, otherwise start clean
function loadProjects() {
    try {
        const saved = localStorage.getItem('nexboard_projects');
        return saved ? JSON.parse(saved) : initialProjects;
    } catch(e) {
        return initialProjects;
    }
}

function loadMembers() {
    try {
        const saved = localStorage.getItem('nexboard_members');
        return saved ? JSON.parse(saved) : initialMembers;
    } catch(e) {
        return initialMembers;
    }
}

function loadTasks() {
    try {
        const saved = localStorage.getItem('nexboard_tasks');
        return saved ? JSON.parse(saved) : initialTasks;
    } catch(e) {
        return initialTasks;
    }
}

function loadActivities() {
    try {
        const saved = localStorage.getItem('nexboard_activities');
        return saved ? JSON.parse(saved) : initialActivities;
    } catch(e) {
        return initialActivities;
    }
}

export let projects = loadProjects();
export let members = loadMembers();
export let tasks = loadTasks();
export let activities = loadActivities();

// Save state changes to LocalStorage
export function saveState() {
    try {
        localStorage.setItem('nexboard_projects', JSON.stringify(projects));
        localStorage.setItem('nexboard_members', JSON.stringify(members));
        localStorage.setItem('nexboard_tasks', JSON.stringify(tasks));
        localStorage.setItem('nexboard_activities', JSON.stringify(activities));
    } catch(e) {
        console.error('Failed to save to localStorage:', e);
    }
}

// Dynamic Member Addition Helper
export function addMember(name, role) {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`;
    
    members[id] = {
        name: name,
        role: role,
        avatar: avatar,
        status: 'online'
    };
    
    addActivity('added team member', `“${name}”`, `as ${role}`, 'fa-user-plus');
    saveState();
    return id;
}

// Dynamic Project Addition Helper
export function addProject(name, color = 'redesign') {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    projects.forEach(p => p.active = false);
    
    const newProj = {
        id: id,
        name: name,
        color: color,
        active: true
    };
    
    projects.push(newProj);
    addActivity('created new project', `“${name}”`, '', 'fa-folder-plus');
    saveState();
    return newProj;
}

// State Mutation Helpers
export function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        const removed = tasks.splice(index, 1)[0];
        addActivity('deleted task', `“${removed.title}”`, '', 'fa-trash');
        saveState();
    }
}

export function addActivity(action, target, extra = '', icon = 'fa-plus', userId = 'admin') {
    const defaultUser = Object.keys(members)[0] || 'admin';
    activities.unshift({
        id: activities.length + 1,
        userId: userId || defaultUser,
        action: action,
        target: target,
        extra: extra,
        time: 'Just now',
        icon: icon
    });
    saveState();
}