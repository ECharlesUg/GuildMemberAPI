const apiBase = '/api/members';
const membersTableBody = document.querySelector('#membersTable tbody');
const memberForm = document.getElementById('memberForm');
const messageDiv = document.getElementById('message');
const formTitle = document.getElementById('formTitle');
let isEditMode = false;

async function fetchMembers() {
    try {
        const response = await fetch(apiBase);
        const members = await response.json();
        populateTable(members);
    } catch (error) {
        showMessage('Error fetching members.', 'error');
    }
}

function populateTable(members) {
    membersTableBody.innerHTML = '';
    members.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.role}</td>
            <td>${member.contributionPoints}</td>
            <td class="actions">
                <button class="edit-btn" onclick="editMember(${member.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMember(${member.id})">Delete</button>
            </td>
        `;
        membersTableBody.appendChild(row);
    });
}

function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

memberForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('memberId').value;
    const name = document.getElementById('name').value.trim();
    const role = document.getElementById('role').value;
    const contributionPoints = parseInt(document.getElementById('contributionPoints').value);

    if (!name || !role || isNaN(contributionPoints)) {
        showMessage('Please fill in all fields correctly.', 'error');
        return;
    }

    const memberData = { name, role, contributionPoints };

    try {
        if (isEditMode) {
            const response = await fetch(`${apiBase}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            if (response.ok) {
                showMessage('Member updated successfully!', 'success');
                resetForm();
                fetchMembers();
            }
        } else {
            const response = await fetch(apiBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            if (response.ok) {
                showMessage('Member added successfully!', 'success');
                memberForm.reset();
                fetchMembers();
            }
        }
    } catch (error) {
        showMessage('An unexpected error occurred.', 'error');
    }
});

async function editMember(id) {
    try {
        const response = await fetch(`${apiBase}/${id}`);
        if (response.ok) {
            const member = await response.json();
            document.getElementById('memberId').value = member.id;
            document.getElementById('name').value = member.name;
            document.getElementById('role').value = member.role;
            document.getElementById('contributionPoints').value = member.contributionPoints;
            isEditMode = true;
            formTitle.textContent = 'Edit Member';
        }
    } catch (error) {
        showMessage('Error fetching member details.', 'error');
    }
}

async function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
        const response = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('Member deleted successfully!', 'success');
            fetchMembers();
        }
    } catch (error) {
        showMessage('Error deleting member.', 'error');
    }
}

function resetForm() {
    memberForm.reset();
    document.getElementById('memberId').value = '';
    isEditMode = false;
    formTitle.textContent = 'Add New Member';
}

fetchMembers();
