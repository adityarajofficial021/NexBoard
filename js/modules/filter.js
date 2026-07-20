// =========================================================================
// NexBoard - Dynamic Search and Multi-Parameter Filtering Engine Module
// =========================================================================

import { tasks } from './state.js';
import { renderDesktopBoard } from '../components/board.js';

export const currentFilters = {
    searchQuery: '',
    assignee: '',
    priority: '',
    dueStatus: ''
};

/**
 * Attaches real-time event listeners to the header inputs and dropdown selections
 */
export function initFilteringSystem() {
    const desktopSearchInput = document.getElementById('desktop-search');
    const filterBtn = document.querySelector('.btn-filter');
    const filterPanel = document.getElementById('filter-panel');
    
    const filterAssignee = document.getElementById('filter-assignee');
    const filterPriority = document.getElementById('filter-priority');
    const filterDue = document.getElementById('filter-due');
    const resetFiltersBtn = document.getElementById('btn-reset-filters');

    // 1. Text Search Input Hook
    if (desktopSearchInput) {
        desktopSearchInput.addEventListener('input', (e) => {
            currentFilters.searchQuery = e.target.value.toLowerCase().trim();
            applyActiveFilters();
        });
    }

    // 2. Toggle Dropdown Menu Open/Closed
    if (filterBtn && filterPanel) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = filterPanel.style.display === 'none';
            filterPanel.style.display = isHidden ? 'flex' : 'none';
        });

        // Close dropdown panel if clicking anywhere outside of it
        document.addEventListener('click', (e) => {
            if (!filterPanel.contains(e.target) && e.target !== filterBtn) {
                filterPanel.style.display = 'none';
            }
        });
    }

    // 3. Dropdown Selection Inputs Listeners
    if (filterAssignee) {
        filterAssignee.addEventListener('change', (e) => {
            currentFilters.assignee = e.target.value;
            applyActiveFilters();
        });
    }

    if (filterPriority) {
        filterPriority.addEventListener('change', (e) => {
            currentFilters.priority = e.target.value;
            applyActiveFilters();
        });
    }

    if (filterDue) {
        filterDue.addEventListener('change', (e) => {
            currentFilters.dueStatus = e.target.value;
            applyActiveFilters();
        });
    }

    // 4. Reset Filters Action Button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            currentFilters.searchQuery = '';
            currentFilters.assignee = '';
            currentFilters.priority = '';
            currentFilters.dueStatus = '';
            
            if (desktopSearchInput) desktopSearchInput.value = '';
            if (filterAssignee) filterAssignee.value = '';
            if (filterPriority) filterPriority.value = '';
            if (filterDue) filterDue.value = '';
            
            applyActiveFilters();
            if (filterPanel) filterPanel.style.display = 'none';
        });
    }
}

/**
 * Filter utility logic comparing all criteria sets down against active task objects
 */
export function getFilteredTasks() {
    return tasks.filter(task => {
        // Condition A: Search query checking
        const matchesSearch = task.title.toLowerCase().includes(currentFilters.searchQuery) ||
                             task.desc.toLowerCase().includes(currentFilters.searchQuery);

        // Condition B: Assignee filtering check
        const matchesAssignee = currentFilters.assignee === '' || 
                                task.assignees.includes(currentFilters.assignee);

        // Condition C: Priority filtering check
        const matchesPriority = currentFilters.priority === '' || 
                                task.priority.toLowerCase() === currentFilters.priority.toLowerCase();

        // Condition D: Due Status / Workflow State check (Mappings matching mock keys)
        const matchesDueStatus = currentFilters.dueStatus === '' || 
                                 task.status.toLowerCase() === currentFilters.dueStatus.toLowerCase() ||
                                 (currentFilters.dueStatus === 'overdue' && task.status === 'todo'); // Overdue mockup mapping rule

        return matchesSearch && matchesAssignee && matchesPriority && matchesDueStatus;
    });
}

export function applyActiveFilters() {
    renderDesktopBoard();
}