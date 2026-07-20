// Central Data Store for NexBoard

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

export let tasks = [
    { id: 1, title: 'Market Research', desc: 'Analyze competitors and market trends', tag: 'research', assignees: ['arjun', 'priya'], date: 'May 28', status: 'backlog', priority: '' },
    { id: 6, title: 'Landing Page Design', desc: 'Design the new landing page', tag: 'design', assignees: ['arjun'], date: 'May 24', status: 'todo', priority: 'Medium' },
    { id: 10, title: 'Homepage Development', desc: 'Develop homepage with responsive design', tag: 'development', assignees: ['arjun', 'rohan'], date: 'May 21', status: 'inprogress', priority: '' },
    { id: 13, title: 'Design System', desc: 'Review design system and components', tag: 'design', assignees: ['priya', 'arjun'], date: 'May 20', status: 'review', priority: '' },
    { id: 15, title: 'Project Setup', desc: 'Initial project setup and configuration', tag: 'setup', assignees: ['rohan'], date: 'May 15', status: 'done', priority: '' }
];

export let activities = [
    { id: 1, userId: 'arjun', action: 'moved', target: '“Homepage Development”', extra: 'to In Progress', time: '2 min ago', icon: 'fa-arrow-right' }
];