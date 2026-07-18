// Wait for the DOM contents to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // DOM ELEMENTS SELECTORS
    // ----------------------------------------------------
    
    // Select the task creation modal overlay and its triggers
    const taskModal = document.getElementById('add-task-modal');
    const modalOpenBtns = document.querySelectorAll('.btn-add-task-trigger, .btn-column-add-task');
    const modalCloseBtn = document.getElementById('btn-close-modal');
    const modalCancelBtn = document.getElementById('btn-cancel-modal');
    
    // Select the task creation form and its validation elements
    const addTaskForm = document.getElementById('add-task-form');
    const taskTitleInput = document.getElementById('task-title-input');
    const taskDateInput = document.getElementById('task-due-date');
    const titleErrorMsg = document.getElementById('title-error-msg');
    const dateErrorMsg = document.getElementById('date-error-msg');
    
    // Select mobile layout column tabs and task list containers
    const mobileTabs = document.querySelectorAll('.mobile-column-tab');
    const mobileTaskLists = document.querySelectorAll('.mobile-task-list');
    const mobileColumnTitle = document.getElementById('mobile-current-column-title');
    const mobileColumnCount = document.getElementById('mobile-current-column-count');
    
    // ----------------------------------------------------
    // ADD TASK MODAL LOGIC
    // ----------------------------------------------------
    
    // Helper function to open the task creation modal popup
    function openModal() {
        taskModal.classList.add('active');
        // Set default minimum date to today so users cannot pick past dates easily
        const today = new Date().toISOString().split('T')[0];
        taskDateInput.min = today;
    }
    
    // Helper function to close the task creation modal popup
    function closeModal() {
        taskModal.classList.remove('active');
        // Reset the form fields and hide any visible error alerts
        addTaskForm.reset();
        titleErrorMsg.classList.remove('visible');
        dateErrorMsg.classList.remove('visible');
    }
    
    // Event listeners to show the modal when clicking create buttons
    modalOpenBtns.forEach(btn => btn.addEventListener('click', openModal));
    
    // Event listeners to close the modal when clicking cancel or close buttons
    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    
    // Close the modal if clicking outside the modal box on the background overlay
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeModal();
        }
    });
    
    // ----------------------------------------------------
    // FORM VALIDATION & SUBMISSION
    // ----------------------------------------------------
    
    // Form submission validation handler
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop default page refresh submit
        
        let isValid = true;
        const selectedDate = new Date(taskDateInput.value);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0); // Reset time to compare date only
        
        // Validation check: Title cannot be blank or empty
        if (!taskTitleInput.value.trim()) {
            titleErrorMsg.classList.add('visible');
            isValid = false;
        } else {
            titleErrorMsg.classList.remove('visible');
        }
        
        // Validation check: Selected due date cannot be in the past
        if (selectedDate < todayDate) {
            dateErrorMsg.classList.add('visible');
            isValid = false;
        } else {
            dateErrorMsg.classList.remove('visible');
        }
        
        // If validation succeeds, close modal and mock success (mock UI only)
        if (isValid) {
            alert(`Task "${taskTitleInput.value}" created successfully! (Mock Action)`);
            closeModal();
        }
    });
    
    // ----------------------------------------------------
    // MOBILE COLUMN TAB SWITCHING
    // ----------------------------------------------------
    
    // Dictionary mapping column IDs to their display names and task counts
    const columnMeta = {
        backlog: { title: 'Backlog', count: '5 tasks' },
        todo: { title: 'To Do', count: '4 tasks' },
        inprogress: { title: 'In Progress', count: '3 tasks' },
        review: { title: 'Review', count: '2 tasks' },
        done: { title: 'Done', count: '4 tasks' }
    };
    
    // Add click listeners to each mobile category tab
    mobileTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            
            // Remove active states from all tabs and activate current tab
            mobileTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Get the category ID linked to the clicked tab
            const targetStatus = tab.getAttribute('data-target');
            
            // Hide all mobile list displays
            mobileTaskLists.forEach(list => list.style.display = 'none');
            
            // Display the specific mobile list linked to the clicked tab
            const targetList = document.getElementById(`mobile-list-${targetStatus}`);
            if (targetList) {
                targetList.style.display = 'flex';
            }
            
            // Dynamically update Workspace Header Title and Task Count badge
            if (columnMeta[targetStatus]) {
                mobileColumnTitle.textContent = columnMeta[targetStatus].title;
                mobileColumnCount.textContent = columnMeta[targetStatus].count;
            }
        });
    });
    
    // ----------------------------------------------------
    // DRAG AND DROP VISUAL HIGHLIGHT FEEDBACK (MOCKED)
    // ----------------------------------------------------
    
    const dragColumns = document.querySelectorAll('.board-column');
    
    // Add hover highlight classes when dragging files/items over columns
    dragColumns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault(); // Required to allow drop action
            column.style.backgroundColor = '#e2e8f0'; // Subtle darker grey highlight
        });
        
        column.addEventListener('dragleave', () => {
            column.style.backgroundColor = '#f1f5f9'; // Restore base color
        });
        
        column.addEventListener('drop', () => {
            column.style.backgroundColor = '#f1f5f9'; // Restore base color
        });
    });
});
