// =========================================================================
// NexBoard - Root Main Controller Module
// =========================================================================
import { initDragAndDrop } from './modules/dragDrop.js';
import { initFilteringSystem } from './modules/filter.js';
// Import central raw data store arrays
import { projects, members, columns, tasks, activities } from './modules/state.js';

// Import UI component builders
import { renderDesktopBoard, renderStats } from './components/board.js';

/**
 * Initializes the entire application state and binds global event triggers
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Structural Layout Renderers
    renderSidebarProjects();
    renderSidebarTeam();
    renderAssigneeFormOptions();
    
    // 2. Main Workspace Dynamic Renderers
    renderDesktopBoard();
    initDragAndDrop();
    renderStats();
    renderDesktopActivities();
    renderMobileBoardStub(); // Bridge placeholder for responsive view updates
    
    // 3. Bind Modal Trigger Interactivity Actions
    initModalEventListeners();
    initFilteringSystem();
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
}

/**
 * Renders the team directory information profiles within the left sidebar
 */
function renderSidebarTeam() {
    const teamListContainer = document.getElementById('desktop-team-list');
    if (!teamListContainer) return;

    teamListContainer.innerHTML = Object.entries(members).map(([id, m]) => `
        <li data-member-id="${id}">
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
 * Renders the primary log history data arrays within the right sidebar dashboard area
 */
function renderDesktopActivities() {
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
 * Minimal configuration logic for tracking the mobile dashboard tab layouts state
 */
function renderMobileBoardStub() {
    // Hook placeholder for secondary mobile-layout views synchronization logic
    const tabsContainer = document.getElementById('mobile-tabs-bar');
    if (!tabsContainer) return;
    
    // Set up click handlers on pre-rendered mobile structural buttons for now
    document.querySelectorAll('.mobile-column-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.mobile-column-tab').forEach(t => t.classList.remove('active'));
            const targetedTab = e.currentTarget;
            targetedTab.classList.add('active');
            console.log(`Switched layout focus target column index category: ${targetedTab.getAttribute('data-target')}`);
        });
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

    // Helper functions to control modal display states
    const openTaskModal = () => {
        if (!taskModalOverlay) return;
        taskModalOverlay.classList.add('active');
        if (taskDueDateInputField) {
            // Apply minimum standard date limits dynamically to prevent past items choice rules
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
        if (e.target.classList.contains('btn-add-task-trigger') || 
            e.target.classList.contains('btn-column-add-task') || 
            e.target.closest('.btn-add-task-trigger') || 
            e.target.closest('.btn-column-add-task')) {
            openTaskModal();
        }
    });

    // Wire standard native click hooks onto control targets safely
    if (modalCloseButton) modalCloseButton.addEventListener('click', closeTaskModal);
    if (modalCancelButton) modalCancelButton.addEventListener('click', closeTaskModal);
    
    if (taskModalOverlay) {
        taskModalOverlay.addEventListener('click', (e) => {
            if (e.target === taskModalOverlay) closeTaskModal();
        });
    }

    // Capture submissions internally
    if (taskCreationFormDom) {
        taskCreationFormDom.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect fields values
            const titleValue = document.getElementById('task-title-input')?.value.trim();
            const descValue = document.getElementById('task-desc-input')?.value.trim();
            const assigneeValue = document.getElementById('task-assignee')?.value;
            const priorityValue = document.getElementById('task-priority')?.value;
            const dateValue = taskDueDateInputField?.value;

            let isInputValid = true;

            // Simple basic input validations engines
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
                // Parse date formatting quickly
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const dateSegments = dateValue.split('-');
                const formattedDisplayDate = `${monthNames[parseInt(dateSegments[1]) - 1]} ${dateSegments[2]}`;

                // Construct state model modifications object parameters
                const generatedNewTaskObj = {
                    id: tasks.length + 1,
                    title: titleValue,
                    desc: descValue || 'No description provided.',
                    tag: priorityValue === 'High' ? 'design' : 'development',
                    assignees: assigneeValue ? [assigneeValue] : ['arjun'],
                    date: formattedDisplayDate,
                    status: 'todo', // Appends new cards systematically into default To Do stream index entries
                    priority: priorityValue
                };

                // Push onto state array directly
                tasks.push(generatedNewTaskObj);

                // Prepend event activity history logger items lists
                activities.unshift({
                    id: activities.length + 1,
                    userId: generatedNewTaskObj.assignees[0],
                    action: 'created task',
                    target: `“${generatedNewTaskObj.title}”`,
                    extra: `under TODO column workflow entry`,
                    time: 'Just now',
                    icon: 'fa-plus'
                });

                // Trigger dynamic component refresh loops across global screens structures layers
                renderDesktopBoard();
                renderDesktopActivities();
                closeTaskModal();
            }
        });
    }
}