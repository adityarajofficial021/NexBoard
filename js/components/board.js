import { tasks, columns, members } from '../modules/state.js';

import { initDragAndDrop } from '../modules/dragDrop.js';
import { getFilteredTasks } from '../modules/filter.js';

// Helper to compile inner HTML structure for a single card
function getTaskCardHtml(task) {
    const assigneePics = task.assignees.map(userId => {
        const m = members[userId];
        return m ? `<img src="${m.avatar}" alt="${m.name}" title="${m.name}">` : '';
    }).join('');

    let dateClass = task.status === 'todo' ? 'text-warning' : (task.status === 'done' ? 'text-success' : '');
    const priorityHtml = task.priority ? `<span class="card-priority priority-${task.priority.toLowerCase()}"><i class="fa-solid fa-flag"></i> ${task.priority}</span>` : '';

    return `
        <div class="task-card" draggable="true" data-task-id="${task.id}">
            <div class="card-header">
                <span class="card-tag tag-${task.tag}">${task.tag}</span>
                <button class="btn-card-more"><i class="fa-solid fa-ellipsis"></i></button>
            </div>
            <h4 class="card-title">${task.title}</h4>
            <p class="card-desc">${task.desc}</p>
            <div class="card-footer">
                <div class="assignees-group">${assigneePics}</div>
                <div class="card-meta">
                    ${priorityHtml}
                    <span class="card-due-date ${dateClass}"><i class="fa-regular fa-calendar"></i> ${task.date}</span>
                </div>
            </div>
        </div>
    `;
}

// Main rendering engine export for the board columns
export function renderDesktopBoard() {
    const container = document.getElementById('desktop-board-columns');
    if (!container) return;

    container.innerHTML = columns.map(col => {
        // Swap raw tasks with the multi-parameter filtering engine query results output safely
        const filteredList = getFilteredTasks();
        const colTasks = filteredList.filter(t => t.status === col.id);
        const cardsHtml = colTasks.map(getTaskCardHtml).join('');

        return `
            <div class="board-column" data-status="${col.id}">
                <div class="column-header">
                    <div class="header-title-wrapper">
                        <span class="column-indicator ${col.indicator}"></span>
                        <h3 class="column-title">${col.name}</h3>
                        <span class="task-count-badge">${colTasks.length}</span>
                    </div>
                    <button class="btn-column-more"><i class="fa-solid fa-ellipsis"></i></button>
                </div>
                <div class="task-list" id="list-${col.id}">
                    ${cardsHtml}
                </div>
                <button class="btn-column-add-task"><i class="fa-solid fa-plus"></i> Add Task</button>
            </div>
        `;
    }).join('');
    
initDragAndDrop();
}


// Render the Statistics Panel at the bottom of the board
export function renderStats() {
    const panel = document.getElementById('desktop-stats-panel');
    if (!panel) return;
    
    const total = tasks.length;
    const progressCount = tasks.filter(t => t.status === 'inprogress').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;
    const overdueCount = tasks.filter(t => t.status === 'todo').length; // Mock overdue mapping

    panel.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon-wrapper total-tasks-icon"><i class="fa-solid fa-square-poll-horizontal"></i></div>
            <div class="stat-info">
                <span class="stat-label">Total Tasks</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${total}</h3>
                    <span class="stat-trend trend-up"><i class="fa-solid fa-arrow-up"></i> 12% <span class="trend-sub">from last week</span></span>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon-wrapper in-progress-icon"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
            <div class="stat-info">
                <span class="stat-label">In Progress</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${progressCount}</h3>
                    <span class="stat-trend trend-up"><i class="fa-solid fa-arrow-up"></i> 8% <span class="trend-sub">from last week</span></span>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon-wrapper completed-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div class="stat-info">
                <span class="stat-label">Completed</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${doneCount}</h3>
                    <span class="stat-trend trend-up"><i class="fa-solid fa-arrow-up"></i> 16% <span class="trend-sub">from last week</span></span>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon-wrapper overdue-icon"><i class="fa-solid fa-clock"></i></div>
            <div class="stat-info">
                <span class="stat-label">Overdue</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${overdueCount}</h3>
                    <span class="stat-trend trend-down"><i class="fa-solid fa-arrow-down"></i> 5% <span class="trend-sub">from last week</span></span>
                </div>
            </div>
        </div>
        <div class="stat-card stat-progress-card">
            <div class="progress-circle-wrapper">
                <svg class="radial-progress-svg" viewBox="0 0 36 36">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="circle" stroke-dasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" class="percentage">68%</text>
                </svg>
            </div>
            <div class="stat-info">
                <span class="stat-label">Project Progress</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">68%</h3>
                    <span class="stat-trend trend-up"><i class="fa-solid fa-arrow-up"></i> 12% <span class="trend-sub">from last week</span></span>
                </div>
            </div>
        </div>
    `;
}