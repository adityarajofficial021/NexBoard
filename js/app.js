// =========================================================================
// NexBoard - Root Main Controller Module
// =========================================================================
import { initDragAndDrop } from './modules/dragDrop.js';
import { initFilteringSystem, currentFilters, applyActiveFilters } from './modules/filter.js';
// Import central raw data store arrays and helpers
import { projects, members, tasks, activities, deleteTask, saveState, addActivity } from './modules/state.js';

// Import UI component builders
import { renderDesktopBoard, renderStats } from './components/board.js';
import { renderMobileBoard } from './components/mobileBoard.js';

let targetColumnId = 'todo';

/**
 * Initializes the entire application state and binds global event triggers
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Structural Layout Renderers
    renderSidebarProjects();
    renderSidebarTeam();
    renderAssigneeFormOptions();
    renderFilterAssigneeOptions();
    
    // 2. Main Workspace Dynamic Renderers
    renderDesktopBoard();
    initDragAndDrop();
    renderStats();
    renderDesktopActivities();
    renderMobileBoard(); // Dynamic mobile phone layout renderer
    
    // 3. Bind Global Interactivity Actions
    initGlobalInteractivity();
    initModalEventListeners();
    initFilteringSystem();
    initKeyboardShortcuts();
    
    console.log("🚀 NexBoard Architecture modular system successfully initialized!");
});

/**
 * Renders the project categories list inside the left sidebar drawer
 */
function renderSidebarProjects() {
    const projectListContainer = document.getElementById('desktop-project-list');
    if (!projectListContainer) return;

    projectListContainer.innerHTML = projects.map(proj => `
        <li class="${proj.active ? 'active' : ''}" data-project-id="${proj.id}">
            <span class="project-bullet ${proj.color}"></span> ${proj.name}
        </li>
    `).join('');

    // Attach click listener on projects
    projectListContainer.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            projectListContainer.querySelectorAll('li').forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const projName = e.currentTarget.textContent.trim();
            const headerTitle = document.getElementById('desktop-project-title');
            if (headerTitle) headerTitle.textContent = projName;
        });
    });
}

/**
 * Renders the team directory information profiles within the left sidebar
 */
function renderSidebarTeam() {
    const teamListContainer = document.getElementById('desktop-team-list');
    if (!teamListContainer) return;

    teamListContainer.innerHTML = Object.entries(members).map(([id, m]) => `
        <li data-member-id="${id}" style="cursor:pointer;">
            <div class="member-avatar">
                <img src="${m.avatar}" alt="${m.name}">
                <span class="status-dot ${m.status}"></span>
            </div>
            <div class="member-info">
                <span class="member-name">${m.name}</span>
                <span class="member-role">${m.role}</span>
            </div>
        </li>
    `).join('');

    // Clicking team member filters task list for that member
    teamListContainer.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            const memberId = e.currentTarget.getAttribute('data-member-id');
            const filterAssignee = document.getElementById('filter-assignee');
            if (filterAssignee) {
                filterAssignee.value = memberId;
                currentFilters.assignee = memberId;
                applyActiveFilters();
            }
        });
    });
}

/**
 * Dynamically builds user profile dropdown selection choices inside the task modal form
 */
function renderAssigneeFormOptions() {
    const assigneeSelectInput = document.getElementById('task-assignee');
    if (!assigneeSelectInput) return;

    assigneeSelectInput.innerHTML = '<option value="">Unassigned</option>' + 
        Object.entries(members).map(([id, m]) => `
            <option value="${id}">${m.name} (${m.role})</option>
        `).join('');
}

/**
 * Populates assignee choices inside the header filter dropdown panel
 */
function renderFilterAssigneeOptions() {
    const filterAssigneeInput = document.getElementById('filter-assignee');
    if (!filterAssigneeInput) return;

    filterAssigneeInput.innerHTML = '<option value="">All Assignees</option>' + 
        Object.entries(members).map(([id, m]) => `
            <option value="${id}">${m.name}</option>
        `).join('');
}

/**
 * Renders the primary log history data arrays within the right sidebar dashboard area
 */
export function renderDesktopActivities() {
    const activityListContainer = document.getElementById('desktop-activity-list');
    if (!activityListContainer) return;

    activityListContainer.innerHTML = activities.map(act => {
        const m = members[act.userId];
        if (!m) return '';
        return `
            <li class="activity-item" data-activity-id="${act.id}">
                <img src="${m.avatar}" alt="${m.name}" class="activity-user-avatar">
                <div class="activity-details">
                    <p class="activity-text">
                        <span class="act-name">${m.name}</span> ${act.action} <span class="act-target">${act.target}</span> ${act.extra}
                    </p>
                    <span class="activity-time">${act.time}</span>
                </div>
            </li>
        `;
    }).join('');
}

/**
 * Attaches document-level delegators for deleting cards, sidebar navigation tabs, and shortcuts
 */
function initGlobalInteractivity() {
    // 1. Task Card Delete Button Handler
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-card-delete');
        if (deleteBtn) {
            e.stopPropagation();
            const taskId = parseInt(deleteBtn.getAttribute('data-task-id'), 10);
            if (taskId) {
                deleteTask(taskId);
                renderDesktopBoard();
                renderStats();
                renderDesktopActivities();
                renderMobileBoard();
            }
        }
    });

    // 2. Sidebar Navigation Tabs Switcher
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const label = item.querySelector('span')?.textContent.trim();
            if (label === 'My Tasks') {
                currentFilters.assignee = 'arjun'; // Filter tasks assigned to Arjun
                const filterAssignee = document.getElementById('filter-assignee');
                if (filterAssignee) filterAssignee.value = 'arjun';
            } else {
                currentFilters.assignee = '';
                const filterAssignee = document.getElementById('filter-assignee');
                if (filterAssignee) filterAssignee.value = '';
            }
            applyActiveFilters();
        });
    });
}

/**
 * Keyboard shortcuts listener (Cmd+K / Ctrl+K for search)
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('desktop-search');
            if (searchInput) searchInput.focus();
        }
    });
}

/**
 * Orchestrates form behaviors, handling opening overlays, setting constraints, and closing visibility toggles
 */
function initModalEventListeners() {
    const taskModalOverlay = document.getElementById('add-task-modal');
    const modalCloseButton = document.getElementById('btn-close-modal');
    const modalCancelButton = document.getElementById('btn-cancel-modal');
    const taskCreationFormDom = document.getElementById('add-task-form');
    const taskDueDateInputField = document.getElementById('task-due-date');

    const titleErrorLabel = document.getElementById('title-error-msg');
    const dateErrorLabel = document.getElementById('date-error-msg');

    const openTaskModal = (colId = 'todo') => {
        if (!taskModalOverlay) return;
        targetColumnId = colId;
        taskModalOverlay.classList.add('active');
        if (taskDueDateInputField) {
            taskDueDateInputField.min = new Date().toISOString().split('T')[0];
        }
    };

    const closeTaskModal = () => {
        if (!taskModalOverlay) return;
        taskModalOverlay.classList.remove('active');
        if (taskCreationFormDom) taskCreationFormDom.reset();
        if (titleErrorLabel) titleErrorLabel.classList.remove('visible');
        if (dateErrorLabel) dateErrorLabel.classList.remove('visible');
    };

    // Global click delegate listener to capture clicks on dynamic "Add Task" buttons
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.btn-add-task-trigger') || e.target.closest('.btn-column-add-task');
        if (trigger) {
            const columnWrapper = trigger.closest('.board-column');
            const colId = columnWrapper ? columnWrapper.getAttribute('data-status') : 'todo';
            openTaskModal(colId);
        }
    });

    if (modalCloseButton) modalCloseButton.addEventListener('click', closeTaskModal);
    if (modalCancelButton) modalCancelButton.addEventListener('click', closeTaskModal);
    
    if (taskModalOverlay) {
        taskModalOverlay.addEventListener('click', (e) => {
            if (e.target === taskModalOverlay) closeTaskModal();
        });
    }

    // Form Submission Handler
    if (taskCreationFormDom) {
        taskCreationFormDom.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const titleValue = document.getElementById('task-title-input')?.value.trim();
            const descValue = document.getElementById('task-desc-input')?.value.trim();
            const assigneeValue = document.getElementById('task-assignee')?.value;
            const priorityValue = document.getElementById('task-priority')?.value;
            const dateValue = taskDueDateInputField?.value;

            let isInputValid = true;

            if (!titleValue) {
                titleErrorLabel?.classList.add('visible');
                isInputValid = false;
            } else {
                titleErrorLabel?.classList.remove('visible');
            }

            if (!dateValue || new Date(dateValue) < new Date().setHours(0,0,0,0)) {
                dateErrorLabel?.classList.add('visible');
                isInputValid = false;
            } else {
                dateErrorLabel?.classList.remove('visible');
            }

            if (isInputValid) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const dateSegments = dateValue.split('-');
                const formattedDisplayDate = `${monthNames[parseInt(dateSegments[1]) - 1]} ${dateSegments[2]}`;

                const generatedNewTaskObj = {
                    id: Date.now(),
                    title: titleValue,
                    desc: descValue || 'No description provided.',
                    tag: priorityValue === 'High' ? 'design' : (priorityValue === 'Medium' ? 'development' : 'marketing'),
                    assignees: assigneeValue ? [assigneeValue] : ['arjun'],
                    date: formattedDisplayDate,
                    status: targetColumnId || 'todo',
                    priority: priorityValue
                };

                tasks.push(generatedNewTaskObj);

                addActivity(
                    'created task',
                    `“${generatedNewTaskObj.title}”`,
                    `under ${generatedNewTaskObj.status.toUpperCase()}`,
                    'fa-plus',
                    generatedNewTaskObj.assignees[0]
                );

                saveState();

                renderDesktopBoard();
                renderStats();
                renderDesktopActivities();
                renderMobileBoard();
                closeTaskModal();
            }
        });
    }
}