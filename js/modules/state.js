// Central Data Store for NexBoard with LocalStorage Persistence

export const projects = [
    { id: 'redesign', name: 'Website Redesign', color: 'redesign', active: true },
    { id: 'mobile', name: 'Mobile App', color: 'mobile', active: false },
    { id: 'marketing', name: 'Marketing Campaign', color: 'marketing', active: false },
    { id: 'launch', name: 'Product Launch', color: 'launch', active: false }
];

export const members = {
    arjun: { name: 'Arjun Sharma', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', status: 'online' },
    priya: { name: 'Priya Singh', role: 'Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', status: 'online' },
    rohan: { name: 'Rohan Verma', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', status: 'online' },
    sneha: { name: 'Sneha Iyer', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80', status: 'idle' },
    ankit: { name: 'Ankit Patel', role: 'Tester', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80', status: 'offline' }
};

export const columns = [
    { id: 'backlog', name: 'Backlog', icon: 'fa-briefcase', class: 'bg-backlog', indicator: 'indicator-backlog' },
    { id: 'todo', name: 'To Do', icon: 'fa-inbox', class: 'bg-todo', indicator: 'indicator-todo' },
    { id: 'inprogress', name: 'In Progress', icon: 'fa-circle-notch', class: 'bg-inprogress', indicator: 'indicator-inprogress' },
    { id: 'review', name: 'Review', icon: 'fa-award', class: 'bg-review', indicator: 'indicator-review' },
    { id: 'done', name: 'Done', icon: 'fa-circle-check', class: 'bg-done', indicator: 'indicator-done' }
];

const defaultTasks = [
    { id: 1, title: 'Market Research', desc: 'Analyze competitors and market trends', tag: 'research', assignees: ['arjun', 'priya'], date: 'May 28', status: 'backlog', priority: '' },
    { id: 2, title: 'Brand Guidelines', desc: 'Create brand identity guidelines', tag: 'design', assignees: ['priya'], date: 'May 30', status: 'backlog', priority: '' },
    { id: 3, title: 'Content Strategy', desc: 'Define content plan for the website', tag: 'marketing', assignees: ['arjun'], date: 'Jun 02', status: 'backlog', priority: '' },
    { id: 4, title: 'SEO Audit', desc: 'Audit current website and SEO issues', tag: 'seo', assignees: ['rohan'], date: 'Jun 04', status: 'backlog', priority: '' },
    { id: 5, title: 'Competitor Analysis', desc: 'Gather feature lists of main competitors', tag: 'research', assignees: ['rohan'], date: 'Jun 05', status: 'backlog', priority: '' },
    { id: 6, title: 'Landing Page Design', desc: 'Design the new landing page', tag: 'design', assignees: ['arjun'], date: 'May 24', status: 'todo', priority: 'Medium' },
    { id: 7, title: 'Wireframes', desc: 'Create wireframes for all pages', tag: 'design', assignees: ['priya', 'arjun'], date: 'May 26', status: 'todo', priority: 'High' },
    { id: 8, title: 'Blog Section', desc: 'Design and develop blog section', tag: 'development', assignees: ['arjun'], date: 'May 27', status: 'todo', priority: 'Medium' },
    { id: 9, title: 'Contact Form', desc: 'Create contact form and validation', tag: 'development', assignees: ['priya'], date: 'May 29', status: 'todo', priority: 'Low' },
    { id: 10, title: 'Homepage Development', desc: 'Develop homepage with responsive design', tag: 'development', assignees: ['arjun', 'rohan'], date: 'May 21', status: 'inprogress', priority: '' },
    { id: 11, title: 'API Integration', desc: 'Integrate backend APIs for the website', tag: 'development', assignees: ['rohan'], date: 'May 23', status: 'inprogress', priority: '' },
    { id: 12, title: 'Mobile Responsiveness', desc: 'Make all pages mobile friendly', tag: 'design', assignees: ['arjun'], date: 'May 25', status: 'inprogress', priority: '' },
    { id: 13, title: 'Design System', desc: 'Review design system and components', tag: 'design', assignees: ['priya', 'arjun'], date: 'May 20', status: 'review', priority: '' },
    { id: 14, title: 'Content Review', desc: 'Review all content and copy', tag: 'content', assignees: ['sneha'], date: 'May 22', status: 'review', priority: '' },
    { id: 15, title: 'Project Setup', desc: 'Initial project setup and configuration', tag: 'setup', assignees: ['rohan'], date: 'May 15', status: 'done', priority: '' },
    { id: 16, title: 'Team Meeting', desc: 'Project kickoff meeting', tag: 'planning', assignees: ['priya', 'rohan'], date: 'May 16', status: 'done', priority: '' },
    { id: 17, title: 'Requirements Gathering', desc: 'Gather and document requirements', tag: 'planning', assignees: ['sneha'], date: 'May 17', status: 'done', priority: '' },
    { id: 18, title: 'Logo Design', desc: 'Design new logo for brand', tag: 'design', assignees: ['priya'], date: 'May 18', status: 'done', priority: '' }
];

const defaultActivities = [
    { id: 1, userId: 'arjun', action: 'moved', target: '“Homepage Development”', extra: 'to In Progress', time: '2 min ago', icon: 'fa-arrow-right' },
    { id: 2, userId: 'priya', action: 'assigned task', target: '“Blog Section”', extra: 'to Rohan Verma', time: '15 min ago', icon: 'fa-user-plus' },
    { id: 3, userId: 'rohan', action: 'updated due date for', target: '“Mobile Responsiveness”', extra: '', time: '1 hour ago', icon: 'fa-calendar-days' },
    { id: 4, userId: 'sneha', action: 'moved', target: '“Contact Form”', extra: 'from To Do to In Progress', time: '2 hours ago', icon: 'fa-arrow-right' },
    { id: 5, userId: 'ankit', action: 'completed', target: '“Project Setup”', extra: 'task', time: '3 hours ago', icon: 'fa-circle-check' }
];

// Load initial arrays from LocalStorage if available
function loadTasks() {
    try {
        const saved = localStorage.getItem('nexboard_tasks');
        return saved ? JSON.parse(saved) : defaultTasks;
    } catch(e) {
        return defaultTasks;
    }
}

function loadActivities() {
    try {
        const saved = localStorage.getItem('nexboard_activities');
        return saved ? JSON.parse(saved) : defaultActivities;
    } catch(e) {
        return defaultActivities;
    }
}

export let tasks = loadTasks();
export let activities = loadActivities();

// Save state changes to LocalStorage
export function saveState() {
    try {
        localStorage.setItem('nexboard_tasks', JSON.stringify(tasks));
        localStorage.setItem('nexboard_activities', JSON.stringify(activities));
    } catch(e) {
        console.error('Failed to save to localStorage:', e);
    }
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

export function addActivity(action, target, extra = '', icon = 'fa-plus', userId = 'arjun') {
    activities.unshift({
        id: activities.length + 1,
        userId: userId,
        action: action,
        target: target,
        extra: extra,
        time: 'Just now',
        icon: icon
    });
    saveState();
}