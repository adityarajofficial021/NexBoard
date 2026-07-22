// =========================================================================
// NexBoard - Root Main Controller Module
// =========================================================================
import { initDragAndDrop } from './modules/dragDrop.js';
import { initFilteringSystem, currentFilters, applyActiveFilters } from './modules/filter.js';
import { getCurrentUser, loginUser, registerUser, logoutUser } from './modules/auth.js';
import { 
    projects, members, tasks, activities, activeProjectId, setActiveProjectId,
    deleteTask, updateTask, saveState, addActivity, addMember, addProject, formatDisplayDate, syncCurrentUserMember 
} from './modules/state.js';

import { renderDesktopBoard, renderStats } from './components/board.js';
import { renderMobileBoard } from './components/mobileBoard.js';

let targetColumnId = 'todo';
let taskToDeleteId = null;

/**
 * Initializes the entire application state and binds global event triggers
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Controller
    initThemeController();

    // 2. Auth Session Controller
    initAuthController();

    // 3. Core Structural Layout Renderers
    refreshAllUI();

    // 4. Bind Global Interactivity Actions
    initGlobalInteractivity();
    initModalEventListeners();
    initMemberAndProjectModals();
    initDeleteConfirmationModal();
    initFilteringSystem();
    initKeyboardShortcuts();
    
    console.log("🚀 NexBoard Architecture modular system successfully initialized!");
});

/**
 * Master UI refresher function
 */
export function refreshAllUI() {
    syncCurrentUserMember();
    updateHeaderUserProfile();
    renderSidebarProjects();
    renderSidebarTeam();
    renderAssigneeFormOptions();
    renderFilterAssigneeOptions();
    renderDesktopBoard();
    initDragAndDrop();
    renderStats();
    renderDesktopActivities();
    renderMobileBoard();
}

/**
 * Authentication & User Profile Controller
 */
function initAuthController() {
    const authModal = document.getElementById('auth-modal');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabSignupBtn = document.getElementById('tab-signup-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const fillDemoBtn = document.getElementById('btn-fill-demo-login');
    const logoutBtn = document.getElementById('btn-logout');
    const userAvatarBtn = document.getElementById('current-user-avatar-btn');
    const userProfileMenu = document.getElementById('user-profile-menu');

    // 1. Session check on launch
    const currentUser = getCurrentUser();
    if (!currentUser) {
        if (authModal) authModal.classList.add('active');
    } else {
        if (authModal) authModal.classList.remove('active');
    }

    // 2. Tab switching
    if (tabLoginBtn && tabSignupBtn) {
        tabLoginBtn.addEventListener('click', () => {
            tabLoginBtn.classList.add('active');
            tabLoginBtn.style.background = 'var(--bg-card)';
            tabLoginBtn.style.color = 'var(--text-main)';
            tabSignupBtn.classList.remove('active');
            tabSignupBtn.style.background = 'transparent';
            tabSignupBtn.style.color = 'var(--text-muted)';
            if (loginForm) loginForm.style.display = 'block';
            if (signupForm) signupForm.style.display = 'none';
        });

        tabSignupBtn.addEventListener('click', () => {
            tabSignupBtn.classList.add('active');
            tabSignupBtn.style.background = 'var(--bg-card)';
            tabSignupBtn.style.color = 'var(--text-main)';
            tabLoginBtn.classList.remove('active');
            tabLoginBtn.style.background = 'transparent';
            tabLoginBtn.style.color = 'var(--text-muted)';
            if (signupForm) signupForm.style.display = 'block';
            if (loginForm) loginForm.style.display = 'none';
        });
    }

    // 3. Demo Login Fill Button
    if (fillDemoBtn) {
        fillDemoBtn.addEventListener('click', () => {
            const result = loginUser('admin@nexboard.com', 'admin123');
            if (result.success) {
                if (authModal) authModal.classList.remove('active');
                showToast(`Welcome back, ${result.user.name}!`, 'success');
                refreshAllUI();
            }
        });
    }

    // 4. Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email')?.value;
            const pass = document.getElementById('login-password')?.value;
            const errorMsg = document.getElementById('login-error-msg');

            const result = loginUser(email, pass);
            if (result.success) {
                if (errorMsg) errorMsg.style.display = 'none';
                if (authModal) authModal.classList.remove('active');
                showToast(`Welcome back, ${result.user.name}!`, 'success');
                refreshAllUI();
            } else {
                if (errorMsg) {
                    errorMsg.textContent = result.message;
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    // 5. Sign Up Form Submit
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name')?.value.trim();
            const email = document.getElementById('signup-email')?.value;
            const pass = document.getElementById('signup-password')?.value;
            const role = document.getElementById('signup-role')?.value;
            const errorMsg = document.getElementById('signup-error-msg');

            const result = registerUser(name, email, pass, role);
            if (result.success) {
                if (errorMsg) errorMsg.style.display = 'none';
                if (authModal) authModal.classList.remove('active');
                showToast(`Account created! Welcome, ${result.user.name}!`, 'success');
                refreshAllUI();
            } else {
                if (errorMsg) {
                    errorMsg.textContent = result.message;
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    // 6. User Avatar Profile Menu Dropdown Toggle
    if (userAvatarBtn && userProfileMenu) {
        userAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = userProfileMenu.style.display === 'flex';
            userProfileMenu.style.display = isVisible ? 'none' : 'flex';
        });

        document.addEventListener('click', (e) => {
            if (!userProfileMenu.contains(e.target) && !userAvatarBtn.contains(e.target)) {
                userProfileMenu.style.display = 'none';
            }
        });
    }

    // 7. Logout Button Action
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logoutUser();
            if (userProfileMenu) userProfileMenu.style.display = 'none';
            if (authModal) authModal.classList.add('active');
            showToast('Logged out successfully', 'info');
        });
    }
}

/**
 * Updates top header profile avatar, name, and email details
 */
function updateHeaderUserProfile() {
    const curUser = getCurrentUser();
    const avatarImg = document.getElementById('header-user-avatar');
    const mobileAvatarImg = document.getElementById('mobile-user-avatar-img');
    const nameEl = document.getElementById('menu-user-name');
    const emailEl = document.getElementById('menu-user-email');
    const roleEl = document.getElementById('menu-user-role');

    if (curUser) {
        if (avatarImg) avatarImg.src = curUser.avatar;
        if (mobileAvatarImg) mobileAvatarImg.src = curUser.avatar;
        if (nameEl) nameEl.textContent = curUser.name;
        if (emailEl) emailEl.textContent = curUser.email;
        if (roleEl) roleEl.textContent = curUser.role;
    }
}

/**
 * Dark/Light Theme Controller & Persistence
 */
function initThemeController() {
    const themeBtn = document.getElementById('btn-theme-toggle');
    const savedTheme = localStorage.getItem('nexboard_theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('nexboard_theme', isDark ? 'dark' : 'light');
            showToast(isDark ? 'Dark Mode Enabled' : 'Light Mode Enabled', 'info');
        });
    }
}

/**
 * Toast Notification Popup Dispatcher
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    const iconMap = { success: 'fa-circle-check', warning: 'fa-trash-can', info: 'fa-circle-info' };
    toast.innerHTML = `<i class="fa-solid ${iconMap[type] || 'fa-bell'}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Renders the project categories list inside the left sidebar drawer
 */
export function renderSidebarProjects() {
    const projectListContainer = document.getElementById('desktop-project-list');
    if (!projectListContainer) return;

    projectListContainer.innerHTML = projects.map(proj => `
        <li class="${proj.id === activeProjectId ? 'active' : ''}" data-project-id="${proj.id}">
            <span class="project-bullet ${proj.color}"></span> ${proj.name}
        </li>
    `).join('');

    projectListContainer.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            const projId = e.currentTarget.getAttribute('data-project-id');
            setActiveProjectId(projId);
            const projObj = projects.find(p => p.id === projId);
            const headerTitle = document.getElementById('desktop-project-title');
            if (headerTitle && projObj) headerTitle.textContent = projObj.name;
            refreshAllUI();
        });
    });
}

/**
 * Renders the team directory information profiles within the left sidebar
 */
export function renderSidebarTeam() {
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
export function renderAssigneeFormOptions() {
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
export function renderFilterAssigneeOptions() {
    const filterAssigneeInput = document.getElementById('filter-assignee');
    if (!filterAssigneeInput) return;

    filterAssigneeInput.innerHTML = '<option value="">All Assignees</option>' + 
        Object.entries(members).map(([id, m]) => `
            <option value="${id}">${m.name}</option>
        `).join('');
}

/**
 * Renders activity log entries in right sidebar
 */
export function renderDesktopActivities() {
    const activityListContainer = document.getElementById('desktop-activity-list');
    if (!activityListContainer) return;

    if (activities.length === 0) {
        activityListContainer.innerHTML = `
            <li class="activity-item" style="padding: 12px 0; color: var(--text-light); font-size: 0.85rem; text-align: center;">
                No activity yet.
            </li>
        `;
        return;
    }

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
 * Attaches document-level delegators for editing, deleting cards, and mobile quick moves
 */
function initGlobalInteractivity() {
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-card-delete');
        if (deleteBtn) {
            e.stopPropagation();
            const taskId = parseInt(deleteBtn.getAttribute('data-task-id'), 10);
            if (taskId) {
                taskToDeleteId = taskId;
                const confirmModal = document.getElementById('confirm-delete-modal');
                if (confirmModal) confirmModal.classList.add('active');
            }
        }
    });

    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-card-edit');
        if (editBtn) {
            e.stopPropagation();
            const taskId = parseInt(editBtn.getAttribute('data-task-id'), 10);
            if (taskId) {
                openTaskModalForEdit(taskId);
            }
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('mobile-status-select')) {
            const taskId = parseInt(e.target.getAttribute('data-task-id'), 10);
            const newStatus = e.target.value;
            const targetTask = tasks.find(t => t.id === taskId);
            if (targetTask && targetTask.status !== newStatus) {
                targetTask.status = newStatus;
                addActivity('moved task', `“${targetTask.title}”`, `to ${newStatus.toUpperCase()}`, 'fa-arrow-right');
                saveState();
                showToast(`Moved to ${newStatus.toUpperCase()}`, 'success');
                refreshAllUI();
            }
        }
    });

    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const label = item.querySelector('span')?.textContent.trim();
            if (label === 'My Tasks') {
                const curUser = getCurrentUser();
                const activeId = curUser ? curUser.id : (Object.keys(members)[0] || 'admin');
                currentFilters.assignee = activeId;
                const filterAssignee = document.getElementById('filter-assignee');
                if (filterAssignee) filterAssignee.value = activeId;
            } else {
                currentFilters.assignee = '';
                const filterAssignee = document.getElementById('filter-assignee');
                if (filterAssignee) filterAssignee.value = '';
            }
            applyActiveFilters();
        });
    });
}

function initDeleteConfirmationModal() {
    const confirmModal = document.getElementById('confirm-delete-modal');
    const cancelBtn = document.getElementById('btn-cancel-delete');
    const confirmBtn = document.getElementById('btn-confirm-delete');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            confirmModal?.classList.remove('active');
            taskToDeleteId = null;
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (taskToDeleteId) {
                deleteTask(taskToDeleteId);
                confirmModal?.classList.remove('active');
                taskToDeleteId = null;
                showToast('Task deleted successfully', 'warning');
                refreshAllUI();
            }
        });
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('desktop-search');
            if (searchInput) searchInput.focus();
        }
    });
}

function initMemberAndProjectModals() {
    const addMemberModal = document.getElementById('add-member-modal');
    const closeMemberBtn = document.getElementById('btn-close-member-modal');
    const cancelMemberBtn = document.getElementById('btn-cancel-member-modal');
    const addMemberForm = document.getElementById('add-member-form');

    const addProjectModal = document.getElementById('add-project-modal');
    const closeProjectBtn = document.getElementById('btn-close-project-modal');
    const cancelProjectBtn = document.getElementById('btn-cancel-project-modal');
    const addProjectForm = document.getElementById('add-project-form');

    const inviteBtn = document.querySelector('.btn-invite-members');
    const teamAddBtn = document.querySelectorAll('.sidebar-section')[1]?.querySelector('.btn-section-add');

    if (inviteBtn) inviteBtn.addEventListener('click', () => addMemberModal?.classList.add('active'));
    if (teamAddBtn) teamAddBtn.addEventListener('click', () => addMemberModal?.classList.add('active'));
    if (closeMemberBtn) closeMemberBtn.addEventListener('click', () => addMemberModal?.classList.remove('active'));
    if (cancelMemberBtn) cancelMemberBtn.addEventListener('click', () => addMemberModal?.classList.remove('active'));

    if (addMemberForm) {
        addMemberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('member-name-input')?.value.trim();
            const roleVal = document.getElementById('member-role-input')?.value.trim();
            
            if (nameVal && roleVal) {
                addMember(nameVal, roleVal);
                showToast(`Added team member: ${nameVal}`, 'success');
                refreshAllUI();
                addMemberForm.reset();
                addMemberModal?.classList.remove('active');
            }
        });
    }

    const projAddBtn = document.querySelectorAll('.sidebar-section')[0]?.querySelector('.btn-section-add');
    if (projAddBtn) projAddBtn.addEventListener('click', () => addProjectModal?.classList.add('active'));
    if (closeProjectBtn) closeProjectBtn.addEventListener('click', () => addProjectModal?.classList.remove('active'));
    if (cancelProjectBtn) cancelProjectBtn.addEventListener('click', () => addProjectModal?.classList.remove('active'));

    if (addProjectForm) {
        addProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('project-name-input')?.value.trim();
            const colorVal = document.getElementById('project-color-select')?.value;
            
            if (nameVal) {
                const newProj = addProject(nameVal, colorVal);
                showToast(`Project "${nameVal}" created`, 'success');
                renderSidebarProjects();
                const headerTitle = document.getElementById('desktop-project-title');
                if (headerTitle) headerTitle.textContent = newProj.name;
                addProjectForm.reset();
                addProjectModal?.classList.remove('active');
                refreshAllUI();
            }
        });
    }
}

function openTaskModalForEdit(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const taskModalOverlay = document.getElementById('add-task-modal');
    const modalHeading = document.getElementById('modal-heading');
    const submitBtn = document.getElementById('btn-submit-task');

    document.getElementById('task-edit-id').value = task.id;
    document.getElementById('task-title-input').value = task.title;
    document.getElementById('task-desc-input').value = task.desc || '';
    document.getElementById('task-assignee').value = task.assignees[0] || '';
    document.getElementById('task-priority').value = task.priority || 'Medium';
    document.getElementById('task-tag-select').value = task.tag || 'development';
    document.getElementById('task-status-select').value = task.status || 'todo';
    document.getElementById('task-due-date').value = task.dueDate || '';

    if (modalHeading) modalHeading.textContent = 'Edit Task';
    if (submitBtn) submitBtn.textContent = 'Update Task';
    if (taskModalOverlay) taskModalOverlay.classList.add('active');
}

function initModalEventListeners() {
    const taskModalOverlay = document.getElementById('add-task-modal');
    const modalCloseButton = document.getElementById('btn-close-modal');
    const modalCancelButton = document.getElementById('btn-cancel-modal');
    const taskCreationFormDom = document.getElementById('add-task-form');
    const taskDueDateInputField = document.getElementById('task-due-date');
    const modalHeading = document.getElementById('modal-heading');
    const submitBtn = document.getElementById('btn-submit-task');

    const titleErrorLabel = document.getElementById('title-error-msg');
    const dateErrorLabel = document.getElementById('date-error-msg');

    const openTaskModalForCreate = (colId = 'todo') => {
        if (!taskModalOverlay) return;
        targetColumnId = colId;
        document.getElementById('task-edit-id').value = '';
        taskCreationFormDom.reset();
        document.getElementById('task-status-select').value = colId;
        const curUser = getCurrentUser();
        if (curUser) {
            document.getElementById('task-assignee').value = curUser.id;
        }
        if (modalHeading) modalHeading.textContent = 'Create New Task';
        if (submitBtn) submitBtn.textContent = 'Create Task';
        taskModalOverlay.classList.add('active');
    };

    const closeTaskModal = () => {
        if (!taskModalOverlay) return;
        taskModalOverlay.classList.remove('active');
        if (taskCreationFormDom) taskCreationFormDom.reset();
        document.getElementById('task-edit-id').value = '';
        if (titleErrorLabel) titleErrorLabel.classList.remove('visible');
        if (dateErrorLabel) dateErrorLabel.classList.remove('visible');
    };

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.btn-add-task-trigger') || e.target.closest('.btn-column-add-task');
        if (trigger) {
            const columnWrapper = trigger.closest('.board-column');
            const colId = columnWrapper ? columnWrapper.getAttribute('data-status') : 'todo';
            openTaskModalForCreate(colId);
        }
    });

    if (modalCloseButton) modalCloseButton.addEventListener('click', closeTaskModal);
    if (modalCancelButton) modalCancelButton.addEventListener('click', closeTaskModal);
    
    if (taskModalOverlay) {
        taskModalOverlay.addEventListener('click', (e) => {
            if (e.target === taskModalOverlay) closeTaskModal();
        });
    }

    if (taskCreationFormDom) {
        taskCreationFormDom.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const editIdVal = document.getElementById('task-edit-id')?.value;
            const titleValue = document.getElementById('task-title-input')?.value.trim();
            const descValue = document.getElementById('task-desc-input')?.value.trim();
            const assigneeValue = document.getElementById('task-assignee')?.value;
            const priorityValue = document.getElementById('task-priority')?.value;
            const tagValue = document.getElementById('task-tag-select')?.value;
            const statusValue = document.getElementById('task-status-select')?.value;
            const dateValue = taskDueDateInputField?.value;

            let isInputValid = true;

            if (!titleValue) {
                titleErrorLabel?.classList.add('visible');
                isInputValid = false;
            } else {
                titleErrorLabel?.classList.remove('visible');
            }

            if (!dateValue) {
                dateErrorLabel?.classList.add('visible');
                isInputValid = false;
            } else {
                dateErrorLabel?.classList.remove('visible');
            }

            if (isInputValid) {
                const formattedDisplayDate = formatDisplayDate(dateValue);
                const curUser = getCurrentUser();
                const defaultUser = curUser ? curUser.id : (Object.keys(members)[0] || 'admin');

                if (editIdVal) {
                    const taskIdNum = parseInt(editIdVal, 10);
                    updateTask({
                        id: taskIdNum,
                        title: titleValue,
                        desc: descValue || 'No description provided.',
                        tag: tagValue || 'development',
                        assignees: assigneeValue ? [assigneeValue] : [defaultUser],
                        dueDate: dateValue,
                        date: formattedDisplayDate,
                        status: statusValue || 'todo',
                        priority: priorityValue
                    });
                    showToast('Task updated successfully', 'success');
                } else {
                    const generatedNewTaskObj = {
                        id: Date.now(),
                        projectId: activeProjectId,
                        title: titleValue,
                        desc: descValue || 'No description provided.',
                        tag: tagValue || 'development',
                        assignees: assigneeValue ? [assigneeValue] : [defaultUser],
                        dueDate: dateValue,
                        date: formattedDisplayDate,
                        status: statusValue || targetColumnId || 'todo',
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
                    showToast('Task created successfully', 'success');
                }

                refreshAllUI();
                closeTaskModal();
            }
        });
    }
}