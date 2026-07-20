// =========================================================================
// NexBoard - Native HTML5 Drag and Drop Engine Module
// =========================================================================

import { tasks, activities, members } from './state.js';
import { renderDesktopBoard, renderStats } from '../components/board.js';

/**
 * Initializes Drag and Drop capabilities across all active columns and cards
 */
export function initDragAndDrop() {
    const cards = document.querySelectorAll('.task-card');
    const lists = document.querySelectorAll('.task-list');

    // 1. Attach drag start/end listeners to all individual cards
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    // 2. Attach column area boundary tracking configurations
    lists.forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('dragenter', handleDragEnter);
        list.addEventListener('dragleave', handleDragLeave);
        list.addEventListener('drop', handleDrop);
    });
}

/**
 * Captures structural parameters when an individual card is picked up
 */
function handleDragStart(e) {
    this.classList.add('dragging');
    // Store the database ID of the card being dragged inside the dataTransfer container
    e.dataTransfer.setData('text/plain', this.getAttribute('data-task-id'));
    e.dataTransfer.effectAllowed = 'move';
}

/**
 * Clean up layout highlights as soon as the card is released
 */
function handleDragEnd() {
    this.classList.remove('dragging');
    
    // Clear out residual hover color modifications from all columns
    document.querySelectorAll('.board-column').forEach(column => {
        column.style.backgroundColor = '#f1f5f9';
    });
}

/**
 * Standard override rules configuration to enable dropping cards inside targeted blocks
 */
function handleDragOver(e) {
    e.preventDefault();
    return false;
}

/**
 * Toggles column background tints dynamically when a card moves over an active area
 */
function handleDragEnter(e) {
    const parentColumn = this.closest('.board-column');
    if (parentColumn) {
        parentColumn.style.backgroundColor = '#e2e8f0'; // Visual highlight accent matching styles rules
    }
}

/**
 * Reverts background styling transitions when elements exit active drop fields boundaries
 */
function handleDragLeave(e) {
    const parentColumn = this.closest('.board-column');
    // Only remove color highlights if moving completely away from the parent target wrapper
    if (parentColumn && !parentColumn.contains(e.relatedTarget)) {
        parentColumn.style.backgroundColor = '#f1f5f9';
    }
}

/**
 * Main engine handler matching drops onto target lists, updating state mutations
 */
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const parentColumn = this.closest('.board-column');
    if (!parentColumn) return;

    // Retrieve the target information variables
    const newStatusId = parentColumn.getAttribute('data-status');
    const taskIdStr = e.dataTransfer.getData('text/plain');
    const taskId = parseInt(taskIdStr, 10);

    // Locate matching elements targets structures within state array models
    const targetTask = tasks.find(t => t.id === taskId);
    
    if (targetTask && targetTask.status !== newStatusId) {
        const oldStatus = targetTask.status.toUpperCase();
        
        // 1. Mutate state parameters seamlessly 
        targetTask.status = newStatusId;

        // 2. Construct and prepend activity notification logs entries dynamically
        // Using active assignee profile or default administrator account configuration
        const actingUserId = targetTask.assignees[0] || 'arjun'; 
        
        activities.unshift({
            id: activities.length + 1,
            userId: actingUserId,
            action: 'moved',
            target: `“${targetTask.title}”`,
            extra: `from ${oldStatus} to ${newStatusId.toUpperCase()}`,
            time: 'Just now',
            icon: 'fa-arrow-right'
        });

        // 3. Trigger global render updates cycles smoothly across workspace segments
        renderDesktopBoard();
        renderStats();
        
        // Re-inject the right sidebar logs component updates cleanly
        const activityListContainer = document.getElementById('desktop-activity-list');
        if (activityListContainer) {
            activityListContainer.innerHTML = activities.map(act => {
                const m = members[act.userId];
                return m ? `
                    <li class="activity-item" data-activity-id="${act.id}">
                        <img src="${m.avatar}" alt="${m.name}" class="activity-user-avatar">
                        <div class="activity-details">
                            <p class="activity-text">
                                <span class="act-name">${m.name}</span> ${act.action} <span class="act-target">${act.target}</span> ${act.extra}
                            </p>
                            <span class="activity-time">${act.time}</span>
                        </div>
                    </li>
                ` : '';
            }).join('');
        }

        // 4. Re-initialize listeners hooks loops to connect newly constructed items fields targets
        initDragAndDrop();
    }
}