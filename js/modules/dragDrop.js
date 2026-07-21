// =========================================================================
// NexBoard - Native HTML5 Drag and Drop Engine Module
// =========================================================================

import { tasks, activities, members, saveState } from './state.js';
import { renderDesktopBoard, renderStats } from '../components/board.js';
import { renderMobileBoard } from '../components/mobileBoard.js';

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
    e.dataTransfer.setData('text/plain', this.getAttribute('data-task-id'));
    e.dataTransfer.effectAllowed = 'move';
}

/**
 * Clean up layout highlights as soon as the card is released
 */
function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.board-column').forEach(column => {
        column.style.backgroundColor = '';
    });
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter(e) {
    const parentColumn = this.closest('.board-column');
    if (parentColumn) {
        parentColumn.style.backgroundColor = 'var(--bg-hover)';
    }
}

function handleDragLeave(e) {
    const parentColumn = this.closest('.board-column');
    if (parentColumn && !parentColumn.contains(e.relatedTarget)) {
        parentColumn.style.backgroundColor = '';
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

    const newStatusId = parentColumn.getAttribute('data-status');
    const taskIdStr = e.dataTransfer.getData('text/plain');
    const taskId = parseInt(taskIdStr, 10);

    const targetTask = tasks.find(t => t.id === taskId);
    
    if (targetTask && targetTask.status !== newStatusId) {
        const oldStatus = targetTask.status.toUpperCase();
        targetTask.status = newStatusId;

        const defaultUser = Object.keys(members)[0] || 'admin';
        const actingUserId = (targetTask.assignees && targetTask.assignees[0]) || defaultUser;
        
        activities.unshift({
            id: activities.length + 1,
            userId: actingUserId,
            action: 'moved',
            target: `“${targetTask.title}”`,
            extra: `from ${oldStatus} to ${newStatusId.toUpperCase()}`,
            time: 'Just now',
            icon: 'fa-arrow-right'
        });

        saveState();

        renderDesktopBoard();
        renderStats();
        renderMobileBoard();
    }
}