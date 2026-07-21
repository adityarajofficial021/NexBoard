import { tasks, columns, members, activeProjectId, getProjectProgress, getOverdueCount } from '../modules/state.js';
import { initDragAndDrop } from '../modules/dragDrop.js';
import { getFilteredTasks } from '../modules/filter.js';

// Helper to compile inner HTML structure for a single task card
function getTaskCardHtml(task) {
    const assigneePics = (task.assignees || []).map(userId => {
        const m = members[userId];
        return m ? `<img src="${m.avatar}" alt="${m.name}" title="${m.name}">` : '';
    }).join('');

    let dateClass = task.status === 'todo' ? 'text-warning' : (task.status === 'done' ? 'text-success' : '');
    const priorityHtml = task.priority ? `<span class="card-priority priority-${task.priority.toLowerCase()}"><i class="fa-solid fa-flag"></i> ${task.priority}</span>` : '';

    return `
        <div class="task-card" draggable="true" data-task-id="${task.id}">
            <div class="card-header">
                <span class="card-tag tag-${task.tag}">${task.tag}</span>
                <div class="card-header-actions" style="display:flex; gap:6px; align-items:center;">
                    <button class="btn-card-edit" data-task-id="${task.id}" style="background:none; border:none; color:var(--text-light); cursor:pointer; font-size:0.85rem; padding:2px 4px;" title="Edit Task"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-card-delete" data-task-id="${task.id}" style="background:none; border:none; color:var(--text-light); cursor:pointer; font-size:0.85rem; padding:2px 4px;" title="Delete Task"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
            <h4 class="card-title">${task.title}</h4>
            <p class="card-desc">${task.desc}</p>
            <div class="card-footer">
                <div class="assignees-group">${assigneePics}</div>
                <div class="card-meta">
                    ${priorityHtml}
                    <span class="card-due-date ${dateClass}"><i class="fa-regular fa-calendar"></i> ${task.date || 'No Date'}</span>
                </div>
            </div>
        </div>
    `;
}

// Main rendering engine export for the desktop board columns
export function renderDesktopBoard() {
    const container = document.getElementById('desktop-board-columns');
    if (!container) return;

    // Filter tasks by active project and multi-parameter query engine
    const filteredList = getFilteredTasks().filter(t => t.projectId === activeProjectId || !t.projectId);

    container.innerHTML = columns.map(col => {
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

// Render Statistics Panel at bottom of the workspace
export function renderStats() {
    const panel = document.getElementById('desktop-stats-panel');
    if (!panel) return;
    
    const projTasks = tasks.filter(t => t.projectId === activeProjectId || !t.projectId);
    const total = projTasks.length;
    const progressCount = projTasks.filter(t => t.status === 'inprogress').length;
    const doneCount = projTasks.filter(t => t.status === 'done').length;
    const overdueCount = getOverdueCount(activeProjectId);
    const progressPercentage = getProjectProgress(activeProjectId);

    panel.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon-wrapper total-tasks-icon"><i class="fa-solid fa-square-poll-horizontal"></i></div>
            <div class="stat-info">
                <span class="stat-label">Total Tasks</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${total}</h3>
                    <span class="stat-trend trend-up"><i class="fa-solid fa-arrow-up"></i> Active</span>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon-wrapper in-progress-icon"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
            <div class="stat-info">
                <span class="stat-label">In Progress</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${progressCount}</h3>
                    <span class="stat-trend trend-up"><i class="fa-solid fa-arrow-up"></i> Active</span>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon-wrapper completed-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div class="stat-info">
                <span class="stat-label">Completed</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${doneCount}</h3>
                    <span class="stat-trend trend-up"><i class="fa-solid fa-arrow-up"></i> ${progressPercentage}%</span>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon-wrapper overdue-icon"><i class="fa-solid fa-clock"></i></div>
            <div class="stat-info">
                <span class="stat-label">Overdue</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${overdueCount}</h3>
                    <span class="stat-trend ${overdueCount > 0 ? 'trend-down' : 'trend-up'}">${overdueCount > 0 ? 'Urgent' : 'On Track'}</span>
                </div>
            </div>
        </div>
        <div class="stat-card stat-progress-card">
            <div class="progress-circle-wrapper">
                <svg class="radial-progress-svg" viewBox="0 0 36 36">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="circle" stroke-dasharray="${progressPercentage}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" class="percentage">${progressPercentage}%</text>
                </svg>
            </div>
            <div class="stat-info">
                <span class="stat-label">Project Progress</span>
                <div class="stat-value-row">
                    <h3 class="stat-value">${progressPercentage}%</h3>
                    <span class="stat-trend trend-up"><i class="fa-solid fa-arrow-up"></i> Target 100%</span>
                </div>
            </div>
        </div>
    `;
}