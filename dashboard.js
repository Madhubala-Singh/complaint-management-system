// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('#complaintsTableBody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

// Filter functionality
function filterStatus(status) {
    const tableRows = document.querySelectorAll('#complaintsTableBody tr');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === status) {
            btn.classList.add('active');
        }
    });
    
    // Filter table rows
    tableRows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const rowStatus = row.getAttribute('data-status');
            if (rowStatus === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// View complaint details
function viewComplaint(id) {
    showNotification(`Loading complaint ${id}...`, 'info');
    
    // Simulate loading data
    setTimeout(() => {
        openComplaintModal(id);
    }, 300);
}

// Open complaint modal
function openComplaintModal(id) {
    const modal = document.getElementById('complaintModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    // Sample complaint data (in real app, this would come from API)
    const complaintData = {
        'CMP-001': {
            subject: 'Product Quality Issue',
            category: 'Product',
            priority: 'High',
            status: 'In Progress',
            date: 'May 4, 2026',
            description: 'The product received does not match the quality standards advertised. Multiple defects were found upon inspection.',
            assignedTo: 'John Smith',
            updates: [
                { date: 'May 4, 2026 10:30 AM', message: 'Complaint received and assigned to quality team' },
                { date: 'May 4, 2026 2:15 PM', message: 'Investigation in progress' }
            ]
        },
        'CMP-002': {
            subject: 'Billing Discrepancy',
            category: 'Billing',
            priority: 'Medium',
            status: 'Pending',
            date: 'May 3, 2026',
            description: 'Incorrect charges applied to my account. The invoice shows $150 but should be $100.',
            assignedTo: 'Sarah Johnson',
            updates: [
                { date: 'May 3, 2026 3:45 PM', message: 'Complaint registered, awaiting review' }
            ]
        },
        'CMP-003': {
            subject: 'Delivery Delay',
            category: 'Delivery',
            priority: 'Low',
            status: 'Resolved',
            date: 'May 2, 2026',
            description: 'Package was delivered 3 days late without prior notification.',
            assignedTo: 'Mike Davis',
            updates: [
                { date: 'May 2, 2026 9:00 AM', message: 'Complaint received' },
                { date: 'May 2, 2026 11:30 AM', message: 'Contacted delivery partner' },
                { date: 'May 2, 2026 4:00 PM', message: 'Issue resolved, compensation provided' }
            ]
        },
        'CMP-004': {
            subject: 'Technical Support Request',
            category: 'Technical',
            priority: 'High',
            status: 'In Progress',
            date: 'May 1, 2026',
            description: 'Unable to access account dashboard. Error 500 appears when trying to log in.',
            assignedTo: 'Tech Support Team',
            updates: [
                { date: 'May 1, 2026 1:20 PM', message: 'Technical team investigating' },
                { date: 'May 1, 2026 5:00 PM', message: 'Root cause identified, fix in progress' }
            ]
        },
        'CMP-005': {
            subject: 'Staff Behavior Complaint',
            category: 'Staff',
            priority: 'Medium',
            status: 'Pending',
            date: 'Apr 30, 2026',
            description: 'Customer service representative was rude and unhelpful during phone call.',
            assignedTo: 'HR Department',
            updates: [
                { date: 'Apr 30, 2026 4:30 PM', message: 'Complaint forwarded to HR for review' }
            ]
        }
    };
    
    const complaint = complaintData[id] || {
        subject: 'Complaint Details',
        category: 'General',
        priority: 'Medium',
        status: 'Pending',
        date: 'N/A',
        description: 'No additional details available.',
        assignedTo: 'Support Team',
        updates: []
    };
    
    // Set modal title
    modalTitle.innerHTML = `<i class="fas fa-file-alt"></i> Complaint ${id}`;
    
    // Build modal content
    modalBody.innerHTML = `
        <div class="modal-info-grid">
            <div class="modal-info-item">
                <label><i class="fas fa-heading"></i> Subject</label>
                <p>${complaint.subject}</p>
            </div>
            <div class="modal-info-item">
                <label><i class="fas fa-list"></i> Category</label>
                <p><span class="badge badge-blue">${complaint.category}</span></p>
            </div>
            <div class="modal-info-item">
                <label><i class="fas fa-exclamation-circle"></i> Priority</label>
                <p><span class="badge badge-${complaint.priority === 'High' ? 'red' : complaint.priority === 'Medium' ? 'orange' : 'yellow'}">${complaint.priority}</span></p>
            </div>
            <div class="modal-info-item">
                <label><i class="fas fa-info-circle"></i> Status</label>
                <p><span class="status-badge status-${complaint.status === 'Resolved' ? 'resolved' : complaint.status === 'In Progress' ? 'progress' : 'pending'}">${complaint.status}</span></p>
            </div>
            <div class="modal-info-item">
                <label><i class="fas fa-calendar"></i> Date Submitted</label>
                <p>${complaint.date}</p>
            </div>
            <div class="modal-info-item">
                <label><i class="fas fa-user"></i> Assigned To</label>
                <p>${complaint.assignedTo}</p>
            </div>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-align-left"></i> Description</h3>
            <p>${complaint.description}</p>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-history"></i> Timeline</h3>
            <div class="timeline">
                ${complaint.updates.map(update => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <span class="timeline-date">${update.date}</span>
                            <p>${update.message}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close complaint modal
function closeComplaintModal() {
    const modal = document.getElementById('complaintModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('complaintModal');
    if (event.target === modal) {
        closeComplaintModal();
    }
}

console.log('Dashboard loaded successfully ✓');
