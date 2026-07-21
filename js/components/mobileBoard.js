// =========================================================================
// NexBoard - Mobile Layout Rendering Component Module
// =========================================================================

import { tasks, columns, members, activities } from '../modules/state.js';
import { getFilteredTasks } from '../modules/filter.js';

let activeMobileTab = 'todo';

/**
 * Main export to render the mobile tabs, column card stacks, and recent activity card
 */
export function renderMobileBoard() {
    renderMobileTabs();
    renderMobileList();
    renderMobileRecentActivity();
}

/**
 * Renders horizontal category tab buttons across the top bar
 */

export function renderMobileTabs() {
    const tabsContainer = document.getElementById('mobile-tabs-bar');
    if (!tabsContainer) return;

    const filteredTasks = getFilteredTasks();

    tabsContainer.innerHTML = columns.map(col => {
        const colTasksCount = filteredTasks.filter(t => t.status === col.id).length;
        const isActive = col.id === activeMobileTab;

        return `
            <div class="mobile-column-tab ${isActive ? 'active' : ''}" data-target="${col.id}">
                <div class="tab-icon ${col.class}"><i class="fa-solid ${col.icon}"></i></div>
                <span class="tab-name">${col.name}</span>
                <span class="tab-badge badge-${col.id}">${colTasksCount}</span>
            </div>
        `;
    }).join('');

    // Attach click event listeners on mobile tabs
    tabsContainer.querySelectorAll('.mobile-column-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            activeMobileTab = e.currentTarget.getAttribute('data-target');
            renderMobileBoard();
        });
    });
}

/**
 * Renders task cards list for the active column tab in mobile view
 */
export function renderMobileList() {
    const listsContainer = document.getElementById('mobile-lists-container');
    const titleEl = document.getElementById('mobile-current-column-title');
    const countEl = document.getElementById('mobile-current-column-count');

    if (!listsContainer) return;

    const currentCol = columns.find(c => c.id === activeMobileTab) || columns[1];
    const filteredTasks = getFilteredTasks();
    const colTasks = filteredTasks.filter(t => t.status === activeMobileTab);

    if (titleEl) titleEl.textContent = currentCol.name;
    if (countEl) countEl.textContent = `${colTasks.length} tasks`;

    if (colTasks.length === 0) {
        listsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-light); font-size: 0.85rem;">
                <i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 8px; color: var(--border-subtle);"></i>
                <p>No tasks found in ${currentCol.name}</p>
            </div>
        `;
        return;
    }

    listsContainer.innerHTML = `
        <div class="mobile-task-list">
            ${colTasks.map(getMobileCardHtml).join('')}
        </div>
    `;
}

/**
 * Helper to construct HTML for an individual mobile task card
 */
function getMobileCardHtml(task) {
    const assigneePics = task.assignees.map(userId => {
        const m = members[userId];
        return m ? `<img src="${m.avatar}" alt="${m.name}" title="${m.name}">` : '';
    }).join('');

    let dateClass = task.status === 'todo' ? 'text-warning' : (task.status === 'done' ? 'text-success' : '');
    const priorityHtml = task.priority ? `<span class="card-priority priority-${task.priority.toLowerCase()}"><i class="fa-solid fa-flag"></i> ${task.priority}</span>` : '';

    return `
        <div class="task-card" data-task-id="${task.id}">
            <div class="card-header">
                <span class="card-tag tag-${task.tag}">${task.tag}</span>
                <div class="card-header-actions" style="display:flex; gap:6px; align-items:center;">
                    <button class="btn-card-delete" data-task-id="${task.id}" style="background:none; border:none; color:var(--text-light); cursor:pointer; font-size:0.85rem; padding:2px 4px;" title="Delete Task"><i class="fa-solid fa-trash-can"></i></button>
                    <button class="btn-card-more"><i class="fa-solid fa-ellipsis"></i></button>
                </div>
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

/**
 * Renders recent activity summary card widget on mobile dashboard
 */
export function renderMobileRecentActivity() {
    const cardEl = document.getElementById('mobile-recent-activity-card');
    if (!cardEl) return;

    if (activities.length === 0) {
        cardEl.innerHTML = `<p style="padding:12px; font-size:0.8rem; color:var(--text-muted);">No recent activities</p>`;
        return;
    }

    const recent = activities[0];
    const m = members[recent.userId];
    if (!m) return;

    cardEl.innerHTML = `
        <div class="mobile-act-icon-box"><i class="fa-solid ${recent.icon || 'fa-arrow-right'}"></i></div>
        <div class="mobile-act-body">
            <p class="mobile-act-text">
                <span class="bold">${m.name}</span> ${recent.action} <span class="status-blue">${recent.target}</span> ${recent.extra}
            </p>
            <span class="mobile-act-time">${recent.time}</span>
        </div>
        <div class="mobile-act-avatar">
            <img src="${m.avatar}" alt="${m.name}">
            <span class="mobile-act-dot"></span>
        </div>
    `;
}
