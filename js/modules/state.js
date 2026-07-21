// Central Data Store for NexBoard with Multi-Project & Persistent State Management

// Default Initial Workspace Seed Data
const initialProjects = [
    { id: 'redesign', name: 'Website Redesign', color: 'redesign', active: true },
    { id: 'mobile', name: 'Mobile App', color: 'mobile', active: false }
];

const initialMembers = {
    admin: { name: 'Admin', role: 'Owner', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0d9488&color=fff&bold=true', status: 'online' },
    priya: { name: 'Priya Singh', role: 'Designer', avatar: 'https://ui-avatars.com/api/?name=Priya+Singh&background=ec4899&color=fff&bold=true', status: 'online' },
    rohan: { name: 'Rohan Verma', role: 'Developer', avatar: 'https://ui-avatars.com/api/?name=Rohan+Verma&background=3b82f6&color=fff&bold=true', status: 'online' }
};

export const columns = [
    { id: 'backlog', name: 'Backlog', icon: 'fa-briefcase', class: 'bg-backlog', indicator: 'indicator-backlog' },
    { id: 'todo', name: 'To Do', icon: 'fa-inbox', class: 'bg-todo', indicator: 'indicator-todo' },
    { id: 'inprogress', name: 'In Progress', icon: 'fa-circle-notch', class: 'bg-inprogress', indicator: 'indicator-inprogress' },
    { id: 'review', name: 'Review', icon: 'fa-award', class: 'bg-review', indicator: 'indicator-review' },
    { id: 'done', name: 'Done', icon: 'fa-circle-check', class: 'bg-done', indicator: 'indicator-done' }
];

const initialTasks = [
    { id: 1, projectId: 'redesign', title: 'Landing Page UI Design', desc: 'Design modern dark and light mode mockups for landing page', tag: 'design', assignees: ['priya'], dueDate: '2026-07-28', date: 'Jul 28', status: 'todo', priority: 'High' },
    { id: 2, projectId: 'redesign', title: 'Setup Component System', desc: 'Configure modular JS structure and state store', tag: 'development', assignees: ['rohan'], dueDate: '2026-07-20', date: 'Jul 20', status: 'inprogress', priority: 'Medium' },
    { id: 3, projectId: 'redesign', title: 'Project Kickoff', desc: 'Kickoff meeting with stakeholders', tag: 'planning', assignees: ['admin'], dueDate: '2026-07-15', date: 'Jul 15', status: 'done', priority: 'Low' },
    { id: 4, projectId: 'mobile', title: 'Mobile App Navigation', desc: 'Implement bottom mobile navigation tab switcher', tag: 'development', assignees: ['admin'], dueDate: '2026-07-30', date: 'Jul 30', status: 'todo', priority: 'High' }
];

const initialActivities = [
    { id: 1, userId: 'admin', action: 'initialized workspace', target: '“Website Redesign”', extra: '', time: 'Just now', icon: 'fa-square-check' }
];

// Active Project State Identifier
export let activeProjectId = 'redesign';

export function setActiveProjectId(id) {
    activeProjectId = id;
    projects.forEach(p => p.active = (p.id === id));
    saveState();
}

// Load arrays from LocalStorage if available, otherwise use initial seeds
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

// Sync active project state
const currentActive = projects.find(p => p.active);
if (currentActive) activeProjectId = currentActive.id;

// Save state changes to LocalStorage
export function saveState() {
    try {
        localStorage.setItem('nexboard_projects', JSON.stringify(projects));
        localStorage.setItem('nexboard_members', JSON.stringify(members));
        localStorage.setItem('nexboard_tasks', JSON.stringify(tasks));
        localStorage.setItem('nexboard_activities', JSON.stringify(activities));
    } catch(e) {
        console.error('Failed to save state to localStorage:', e);
    }
}

// Helper to format ISO date (YYYY-MM-DD) into display string (e.g. "Jul 28")
export function formatDisplayDate(isoDateStr) {
    if (!isoDateStr) return 'No Date';
    try {
        const parts = isoDateStr.split('-');
        if (parts.length === 3) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[parseInt(parts[1], 10) - 1]} ${parts[2]}`;
        }
        return isoDateStr;
    } catch(e) {
        return isoDateStr;
    }
}

// Dynamic Statistical Helpers
export function getProjectProgress(projId = activeProjectId) {
    const projTasks = tasks.filter(t => t.projectId === projId || !t.projectId);
    if (projTasks.length === 0) return 0;
    const completed = projTasks.filter(t => t.status === 'done').length;
    return Math.round((completed / projTasks.length) * 100);
}

export function getOverdueCount(projId = activeProjectId) {
    const today = new Date().setHours(0,0,0,0);
    const projTasks = tasks.filter(t => t.projectId === projId || !t.projectId);
    return projTasks.filter(t => {
        if (t.status === 'done' || !t.dueDate) return false;
        const taskDate = new Date(t.dueDate).setHours(0,0,0,0);
        return taskDate < today;
    }).length;
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
    activeProjectId = id;
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

export function updateTask(updatedTask) {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask };
        addActivity('updated task', `“${updatedTask.title}”`, '', 'fa-pen-to-square');
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