// Wait for the DOM contents to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // GENERIC DATA STRUCTURES (EASY FOR TEAMMATES TO EDIT)
    // ----------------------------------------------------

    // List of active projects for left sidebar
    const projects = [
        { id: 'redesign', name: 'Website Redesign', color: 'redesign', active: true },
        { id: 'mobile', name: 'Mobile App', color: 'mobile', active: false },
        { id: 'marketing', name: 'Marketing Campaign', color: 'marketing', active: false },
        { id: 'launch', name: 'Product Launch', color: 'launch', active: false }
    ];

    // Team members directory with roles, avatars, and status states
    const members = {
        arjun: { name: 'Arjun Sharma', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', status: 'online' },
        priya: { name: 'Priya Singh', role: 'Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', status: 'online' },
        rohan: { name: 'Rohan Verma', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', status: 'online' },
        sneha: { name: 'Sneha Iyer', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80', status: 'idle' },
        ankit: { name: 'Ankit Patel', role: 'Tester', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80', status: 'offline' }
    };

    // Columns structure and mobile configurations
    const columns = [
        { id: 'backlog', name: 'Backlog', icon: 'fa-briefcase', class: 'bg-backlog', indicator: 'indicator-backlog' },
        { id: 'todo', name: 'To Do', icon: 'fa-inbox', class: 'bg-todo', indicator: 'indicator-todo' },
        { id: 'inprogress', name: 'In Progress', icon: 'fa-circle-notch', class: 'bg-inprogress', indicator: 'indicator-inprogress' },
        { id: 'review', name: 'Review', icon: 'fa-award', class: 'bg-review', indicator: 'indicator-review' },
        { id: 'done', name: 'Done', icon: 'fa-circle-check', class: 'bg-done', indicator: 'indicator-done' }
    ];

    // Primary board tasks collection (generic mockup data)
    let tasks = [
        // Backlog column cards
        { id: 1, title: 'Market Research', desc: 'Analyze competitors and market trends', tag: 'research', assignees: ['arjun', 'priya'], date: 'May 28', status: 'backlog', priority: '' },
        { id: 2, title: 'Brand Guidelines', desc: 'Create brand identity guidelines', tag: 'design', assignees: ['priya'], date: 'May 30', status: 'backlog', priority: '' },
        { id: 3, title: 'Content Strategy', desc: 'Define content plan for the website', tag: 'marketing', assignees: ['arjun'], date: 'Jun 02', status: 'backlog', priority: '' },
        { id: 4, title: 'SEO Audit', desc: 'Audit current website and SEO issues', tag: 'seo', assignees: ['rohan'], date: 'Jun 04', status: 'backlog', priority: '' },
        { id: 5, title: 'Competitor Analysis', desc: 'Gather feature lists of main competitors', tag: 'research', assignees: ['rohan'], date: 'Jun 05', status: 'backlog', priority: '' },
        // To Do column cards
        { id: 6, title: 'Landing Page Design', desc: 'Design the new landing page', tag: 'design', assignees: ['arjun'], date: 'May 24', status: 'todo', priority: 'Medium' },
        { id: 7, title: 'Wireframes', desc: 'Create wireframes for all pages', tag: 'design', assignees: ['priya', 'arjun'], date: 'May 26', status: 'todo', priority: 'High' },
        { id: 8, title: 'Blog Section', desc: 'Design and develop blog section', tag: 'development', assignees: ['arjun'], date: 'May 27', status: 'todo', priority: 'Medium' },
        { id: 9, title: 'Contact Form', desc: 'Create contact form and validation', tag: 'development', assignees: ['priya'], date: 'May 29', status: 'todo', priority: 'Low' },
        // In Progress column cards
        { id: 10, title: 'Homepage Development', desc: 'Develop homepage with responsive design', tag: 'development', assignees: ['arjun', 'rohan'], date: 'May 21', status: 'inprogress', priority: '' },
        { id: 11, title: 'API Integration', desc: 'Integrate backend APIs for the website', tag: 'development', assignees: ['rohan'], date: 'May 23', status: 'inprogress', priority: '' },
        { id: 12, title: 'Mobile Responsiveness', desc: 'Make all pages mobile friendly', tag: 'design', assignees: ['arjun'], date: 'May 25', status: 'inprogress', priority: '' },
        // Review column cards
        { id: 13, title: 'Design System', desc: 'Review design system and components', tag: 'design', assignees: ['priya', 'arjun'], date: 'May 20', status: 'review', priority: '' },
        { id: 14, title: 'Content Review', desc: 'Review all content and copy', tag: 'content', assignees: ['sneha'], date: 'May 22', status: 'review', priority: '' },
        // Done column cards
        { id: 15, title: 'Project Setup', desc: 'Initial project setup and configuration', tag: 'setup', assignees: ['rohan'], date: 'May 15', status: 'done', priority: '' },
        { id: 16, title: 'Team Meeting', desc: 'Project kickoff meeting', tag: 'planning', assignees: ['priya', 'rohan'], date: 'May 16', status: 'done', priority: '' },
        { id: 17, title: 'Requirements Gathering', desc: 'Gather and document requirements', tag: 'planning', assignees: ['sneha'], date: 'May 17', status: 'done', priority: '' },
        { id: 18, title: 'Logo Design', desc: 'Design new logo for brand', tag: 'design', assignees: ['priya'], date: 'May 18', status: 'done', priority: '' }
    ];

    // Live actions list for activity log
    const activities = [
        { id: 1, userId: 'arjun', action: 'moved', target: '“Homepage Development”', extra: 'to In Progress', time: '2 min ago', icon: 'fa-arrow-right' },
        { id: 2, userId: 'priya', action: 'assigned task', target: '“Blog Section”', extra: 'to Rohan Verma', time: '15 min ago', icon: 'fa-user-plus' },
        { id: 3, userId: 'rohan', action: 'updated due date for', target: '“Mobile Responsiveness”', extra: '', time: '1 hour ago', icon: 'fa-calendar-days' },
        { id: 4, userId: 'sneha', action: 'moved', target: '“Contact Form”', extra: 'from To Do to In Progress', time: '2 hours ago', icon: 'fa-arrow-right' },
        { id: 5, userId: 'ankit', action: 'completed', target: '“Project Setup”', extra: 'task', time: '3 hours ago', icon: 'fa-circle-check' }
    ];

    // Track active column selection for mobile mockup
    let activeMobileTab = 'todo';

    // ----------------------------------------------------
    // DYNAMIC RENDERING UTILITIES
    // ----------------------------------------------------

    // Populates project names and team directories in sidebar
    function renderSidebar() {
        const pList = document.getElementById('desktop-project-list');
        const tList = document.getElementById('desktop-team-list');

        // Draw projects list
        pList.innerHTML = projects.map(proj => `
            <li class="${proj.active ? 'active' : ''}">
                <span class="project-bullet ${proj.color}"></span> ${proj.name}
            </li>
        `).join('');

        // Draw team lists
        tList.innerHTML = Object.entries(members).map(([id, m]) => `
            <li>
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

    // Populates assignee select options inside the modal form
    function renderAssigneeDropdown() {
        const select = document.getElementById('task-assignee');
        select.innerHTML = '<option value="">Unassigned</option>' + Object.entries(members).map(([id, m]) => `
            <option value="${id}">${m.name} (${m.role})</option>
        `).join('');
    }

    // Helper to generate task card HTML blocks
    function getTaskCardHtml(task) {
        // Collect assignees details
        const assigneePics = task.assignees.map(userId => {
            const m = members[userId];
            return m ? `<img src="${m.avatar}" alt="${m.name}" title="${m.name}">` : '';
        }).join('');

        // Check date color modifier classes
        let dateClass = '';
        if (task.status === 'todo') dateClass = 'text-warning';
        if (task.status === 'done') dateClass = 'text-success';

        // Check priority element display
        const priorityHtml = task.priority ? `
            <span class="card-priority priority-${task.priority.toLowerCase()}">
                <i class="fa-solid fa-flag"></i> ${task.priority}
            </span>
        ` : '';

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

    // Renders five columns and cards inside desktop workspace
    function renderDesktopBoard() {
        const container = document.getElementById('desktop-board-columns');
        
        container.innerHTML = columns.map(col => {
            // Filter tasks matching current column category
            const colTasks = tasks.filter(t => t.status === col.id);
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

        // Wire up drag-and-drop highlights handlers on columns
        addDragAndDropHandlers();
    }

    // Renders active column cards view and tab updates on mobile phone layout
    function renderMobileBoard() {
        const tabsContainer = document.getElementById('mobile-tabs-bar');
        const listsContainer = document.getElementById('mobile-lists-container');

        // Draw tab buttons
        tabsContainer.innerHTML = columns.map(col => {
            const colTasksCount = tasks.filter(t => t.status === col.id).length;
            const isActive = col.id === activeMobileTab;
            
            return `
                <div class="mobile-column-tab ${isActive ? 'active' : ''}" data-target="${col.id}">
                    <div class="tab-icon ${col.class}"><i class="fa-solid ${col.icon}"></i></div>
                    <span class="tab-name">${col.name}</span>
                    <span class="tab-badge badge-${col.id}">${colTasksCount}</span>
                </div>
            `;
        }).join('');

        // Attach click listeners on mobile tabs
        document.querySelectorAll('.mobile-column-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeMobileTab = tab.getAttribute('data-target');
                renderMobileBoard(); // Redraw UI
            });
        });

        // Filter and update mobile workspace header
        const currentCol = columns.find(c => c.id === activeMobileTab);
        const colTasks = tasks.filter(t => t.status === activeMobileTab);
        
        document.getElementById('mobile-current-column-title').textContent = currentCol.name;
        document.getElementById('mobile-current-column-count').textContent = `${colTasks.length} tasks`;

        // Render card stacks inside mobile list
        listsContainer.innerHTML = `
            <div class="mobile-task-list">
                ${colTasks.map(getTaskCardHtml).join('') || '<p style="text-align:center; padding:30px; color:var(--text-light); font-size:0.82rem;">No tasks here</p>'}
            </div>
        `;
    }

    // Generates stats cards panel content
    function renderStats() {
        const panel = document.getElementById('desktop-stats-panel');
        
        const total = tasks.length;
        const progressCount = tasks.filter(t => t.status === 'inprogress').length;
        const doneCount = tasks.filter(t => t.status === 'done').length;
        const overdueCount = tasks.filter(t => t.status === 'todo').length; // Mock overdue status mapping

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

    // Renders the logs inside right sidebar and mobile widget
    function renderActivities() {
        const list = document.getElementById('desktop-activity-list');
        const mobileWidget = document.getElementById('mobile-recent-activity-card');

        // Draw desktop activities
        list.innerHTML = activities.map(act => {
            const m = members[act.userId];
            return `
                <li class="activity-item">
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

        // Draw mobile widget (show the most recent action)
        const recent = activities[0];
        const m = members[recent.userId];
        
        mobileWidget.innerHTML = `
            <div class="mobile-act-icon-box"><i class="fa-solid ${recent.icon}"></i></div>
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

    // Combined function to update the entire workspace interface
    function updateWorkspace() {
        renderDesktopBoard();
        renderMobileBoard();
        renderStats();
        renderActivities();
    }

    // ----------------------------------------------------
    // MODAL POPUP TRIGGERS
    // ----------------------------------------------------

    const taskModal = document.getElementById('add-task-modal');
    const modalCloseBtn = document.getElementById('btn-close-modal');
    const modalCancelBtn = document.getElementById('btn-cancel-modal');
    const addTaskForm = document.getElementById('add-task-form');
    
    // Inputs in Modal Form
    const taskTitleInput = document.getElementById('task-title-input');
    const taskDescInput = document.getElementById('task-desc-input');
    const taskAssigneeInput = document.getElementById('task-assignee');
    const taskPriorityInput = document.getElementById('task-priority');
    const taskDateInput = document.getElementById('task-due-date');

    // Select validation error indicators
    const titleErrorMsg = document.getElementById('title-error-msg');
    const dateErrorMsg = document.getElementById('date-error-msg');

    // Opens modal and resets boundaries
    function openModal() {
        taskModal.classList.add('active');
        taskDateInput.min = new Date().toISOString().split('T')[0]; // Block past dates
    }

    // Closes modal and resets fields
    function closeModal() {
        taskModal.classList.remove('active');
        addTaskForm.reset();
        titleErrorMsg.classList.remove('visible');
        dateErrorMsg.classList.remove('visible');
    }

    // Delegate modal triggers click events (for dynamic buttons)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-task-trigger') || 
            e.target.classList.contains('btn-column-add-task') || 
            e.target.closest('.btn-add-task-trigger') || 
            e.target.closest('.btn-column-add-task')) {
            openModal();
        }
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    taskModal.addEventListener('click', (e) => { if (e.target === taskModal) closeModal(); });

    // ----------------------------------------------------
    // CREATE AND VALIDATE TASKS
    // ----------------------------------------------------

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const selectedDate = new Date(taskDateInput.value);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        // Validation: Empty check
        if (!taskTitleInput.value.trim()) {
            titleErrorMsg.classList.add('visible');
            isValid = false;
        } else {
            titleErrorMsg.classList.remove('visible');
        }

        // Validation: Date in past check
        if (selectedDate < todayDate) {
            dateErrorMsg.classList.add('visible');
            isValid = false;
        } else {
            dateErrorMsg.classList.remove('visible');
        }

        if (isValid) {
            // Push new task into tasks list data structure
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dateParts = taskDateInput.value.split('-');
            const formattedDate = `${months[parseInt(dateParts[1]) - 1]} ${dateParts[2]}`;

            const newTask = {
                id: tasks.length + 1,
                title: taskTitleInput.value.trim(),
                desc: taskDescInput.value.trim() || 'No description provided.',
                tag: taskPriorityInput.value === 'High' ? 'design' : 'development', // Default tag mapping
                assignees: taskAssigneeInput.value ? [taskAssigneeInput.value] : ['arjun'],
                date: formattedDate,
                status: activeMobileTab, // Defaults status to currently viewed tab
                priority: taskPriorityInput.value
            };

            tasks.push(newTask);

            // Log activity log entry
            activities.unshift({
                id: activities.length + 1,
                userId: newTask.assignees[0],
                action: 'created task',
                target: `“${newTask.title}”`,
                extra: `under ${newTask.status.toUpperCase()}`,
                time: 'Just now',
                icon: 'fa-plus'
            });

            // Redraw whole project UI and close modal
            updateWorkspace();
            closeModal();
        }
    });

    // ----------------------------------------------------
    // DRAG AND DROP HOVER HIGHLIGHTS (MOCKED)
    // ----------------------------------------------------

    function addDragAndDropHandlers() {
        const dragColumns = document.querySelectorAll('.board-column');
        dragColumns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.style.backgroundColor = '#e2e8f0';
            });
            column.addEventListener('dragleave', () => {
                column.style.backgroundColor = '#f1f5f9';
            });
            column.addEventListener('drop', () => {
                column.style.backgroundColor = '#f1f5f9';
            });
        });
    }

    // ----------------------------------------------------
    // INITIALIZATION RUNS
    // ----------------------------------------------------
    
    renderSidebar();
    renderAssigneeDropdown();
    updateWorkspace(); // Initial layout load
});
