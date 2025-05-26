// Sample rewards data
const rewardsData = [
    {
        id: 1,
        name: "กาแฟฟรี 1 แก้ว",
        points: 500,
        description: "รับกาแฟเมนูยอดนิยมฟรี 1 แก้ว (ไม่รวมเมนูพิเศษ)",
        available: true
    },
    {
        id: 2,
        name: "เค้กชิ้นโปรด",
        points: 750,
        description: "เลือกเค้กชิ้นโปรดได้ 1 ชิ้น จากเมนูทั้งหมด",
        available: true
    },
    {
        id: 3,
        name: "ส่วนลด 20%",
        points: 1000,
        description: "รับส่วนลด 20% สำหรับการสั่งซื้อครั้งถัดไป (ขั้นต่ำ 500 บาท)",
        available: true
    },
    {
        id: 4,
        name: "เซ็ตอาหารว่าง",
        points: 1200,
        description: "เซ็ตอาหารว่าง 2 ชิ้น พร้อมเครื่องดื่มร้อน 1 แก้ว",
        available: false
    },
    {
        id: 5,
        name: "ส่วนลด 50%",
        points: 2000,
        description: "รับส่วนลด 50% สำหรับการสั่งซื้อครั้งถัดไป (ขั้นต่ำ 1000 บาท)",
        available: true
    },
    {
        id: 6,
        name: "อาหารฟรี 1 จาน",
        points: 1500,
        description: "เลือกอาหารจานโปรดได้ 1 จาน (ไม่เกิน 300 บาท)",
        available: false
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('PTT Élan Café Profile page loaded successfully!');
    loadRewards();
    updateUserInterface();
    addSuccessMessages();
});

// Add success message elements to the DOM
function addSuccessMessages() {
    // Add success message for profile form
    const profileCard = document.querySelector('.settings-card');
    if (profileCard && !document.getElementById('profileSuccessMessage')) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.id = 'profileSuccessMessage';
        successDiv.textContent = 'บันทึกข้อมูลสำเร็จแล้ว!';
        
        const titleElement = profileCard.querySelector('.section-title');
        titleElement.parentNode.insertBefore(successDiv, titleElement.nextSibling);
    }
    
    // Add success message for password form
    const passwordCard = document.querySelectorAll('.settings-card')[1];
    if (passwordCard && !document.getElementById('passwordSuccessMessage')) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.id = 'passwordSuccessMessage';
        successDiv.textContent = 'เปลี่ยนรหัสผ่านสำเร็จแล้ว!';
        
        const titleElement = passwordCard.querySelector('.section-title');
        titleElement.parentNode.insertBefore(successDiv, titleElement.nextSibling);
    }
}

// Load rewards into the grid
function loadRewards() {
    const rewardsGrid = document.getElementById('rewardsGrid');
    if (!rewardsGrid) return;
    
    const userPointsText = document.getElementById('userPoints').textContent;
    const userPoints = parseInt(userPointsText.replace(/,/g, ''));
    
    rewardsGrid.innerHTML = '';
    
    rewardsData.forEach(reward => {
        const canRedeem = userPoints >= reward.points && reward.available;
        
        const rewardCard = document.createElement('div');
        rewardCard.className = 'reward-card';
        rewardCard.innerHTML = `
            <div class="reward-header">
                <div class="reward-name">${reward.name}</div>
                <div class="reward-points">${reward.points.toLocaleString()} คะแนน</div>
            </div>
            <div class="reward-description">${reward.description}</div>
            <button class="redeem-btn" ${!canRedeem ? 'disabled' : ''} onclick="redeemReward(${reward.id}, ${reward.points})">
                ${!reward.available ? 'สินค้าหมด' : 
                  userPoints < reward.points ? 'คะแนนไม่เพียงพอ' : 'แลกรางวัล'}
            </button>
        `;
        
        rewardsGrid.appendChild(rewardCard);
    });
}

// Redeem reward function
function redeemReward(rewardId, pointsCost) {
    const userPointsElement = document.getElementById('userPoints');
    const currentPointsText = userPointsElement.textContent;
    const currentPoints = parseInt(currentPointsText.replace(/,/g, ''));
    
    if (currentPoints >= pointsCost) {
        const newPoints = currentPoints - pointsCost;
        userPointsElement.textContent = newPoints.toLocaleString();
        
        const reward = rewardsData.find(r => r.id === rewardId);
        alert(`🎉 แลกรางวัล "${reward.name}" สำเร็จแล้ว!\n\nคะแนนคงเหลือ: ${newPoints.toLocaleString()} คะแนน\n\nกรุณาแสดงหน้าจอนี้ที่ร้านเพื่อรับรางวัล`);
        
        // Reload rewards to update availability
        loadRewards();
        
        // Update avatar if needed
        updateAvatarFromName();
    }
}

// Toggle edit mode for profile
function toggleEditMode() {
    const inputs = document.querySelectorAll('#profileForm input');
    const saveBtn = document.getElementById('saveProfileBtn');
    const editBtn = document.querySelector('.edit-profile-btn');
    
    if (!inputs.length || !saveBtn || !editBtn) return;
    
    const isEditing = !inputs[0].disabled;
    
    inputs.forEach(input => {
        input.disabled = isEditing;
    });
    
    saveBtn.disabled = isEditing;
    editBtn.textContent = isEditing ? 'แก้ไขข้อมูล' : 'ยกเลิก';
    
    // Focus on first input when entering edit mode
    if (!isEditing) {
        setTimeout(() => inputs[0].focus(), 100);
    }
}

// Save profile function
function saveProfile() {
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');
    const phoneInput = document.getElementById('editPhone');
    
    if (!nameInput || !emailInput || !phoneInput) return;
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    
    // Validate inputs
    if (!name || !email || !phone) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('รูปแบบอีเมลไม่ถูกต้อง');
        return;
    }
    
    // Phone validation (basic Thai phone number format)
    const phoneRegex = /^[0-9-+\s()]+$/;
    if (!phoneRegex.test(phone)) {
        alert('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
        return;
    }
    
    // Update display elements
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userNameElement) userNameElement.textContent = name;
    if (userEmailElement) userEmailElement.textContent = email;
    
    // Update avatar
    updateAvatarFromName(name);
    
    // Show success message
    showSuccessMessage('profileSuccessMessage');
    
    // Exit edit mode
    toggleEditMode();
}

// Update avatar based on name
function updateAvatarFromName(name) {
    const userNameElement = document.getElementById('userName');
    const avatarElement = document.getElementById('userAvatar');
    
    if (!avatarElement) return;
    
    const nameToUse = name || (userNameElement ? userNameElement.textContent : 'User');
    const nameParts = nameToUse.split(' ').filter(part => part.length > 0);
    
    let initials = '';
    if (nameParts.length >= 2) {
        initials = nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    } else if (nameParts.length === 1) {
        initials = nameParts[0].substring(0, 2).toUpperCase();
    } else {
        initials = 'U';
    }
    
    avatarElement.textContent = initials;
}

// Change password function
function changePassword() {
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) return;
    
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('กรุณากรอกรหัสผ่านให้ครบถ้วน');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
        return;
    }
    
    if (currentPassword === newPassword) {
        alert('รหัสผ่านใหม่ต้องไม่เหมือนกับรหัสผ่านเดิม');
        return;
    }
    
    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    
    if (newPassword.length >= 8 && (!hasUpperCase || !hasLowerCase || !hasNumbers)) {
        const confirmWeakPassword = confirm('รหัสผ่านของคุณอาจไม่ปลอดภัยเพียงพอ\nแนะนำให้มีตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข\n\nต้องการดำเนินการต่อหรือไม่?');
        if (!confirmWeakPassword) return;
    }
    
    // Show success message
    showSuccessMessage('passwordSuccessMessage');
    
    // Clear form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.reset();
    }
}

// Show success message helper function
function showSuccessMessage(messageId) {
    const successMessage = document.getElementById(messageId);
    if (successMessage) {
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

// Go back to home page
function goHome() {
    if (confirm('คุณต้องการกลับสู่หน้าหลักหรือไม่?')) {
        // In a real application, this would navigate to the home page
        // window.location.href = 'index.html';
        alert('กำลังกลับสู่หน้าหลัก...');
    }
}

// Update user interface based on user data
function updateUserInterface() {
    // Initialize avatar based on current name
    updateAvatarFromName();
    
    // Add event listeners for form validation
    addFormValidationListeners();
    
    console.log('User interface updated');
}

// Add real-time form validation
function addFormValidationListeners() {
    const emailInput = document.getElementById('editEmail');
    const phoneInput = document.getElementById('editPhone');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Email validation on blur
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !this.disabled) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.style.borderColor = '#ff4444';
                } else {
                    this.style.borderColor = '#4CAF50';
                }
            }
        });
        
        emailInput.addEventListener('focus', function() {
            this.style.borderColor = '#b85c38';
        });
    }
    
    // Phone validation on blur
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !this.disabled) {
                const phoneRegex = /^[0-9-+\s()]+$/;
                if (!phoneRegex.test(this.value)) {
                    this.style.borderColor = '#ff4444';
                } else {
                    this.style.borderColor = '#4CAF50';
                }
            }
        });
        
        phoneInput.addEventListener('focus', function() {
            this.style.borderColor = '#b85c38';
        });
    }
    
    // Password confirmation validation
    if (confirmPasswordInput && newPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            if (this.value && newPasswordInput.value) {
                if (this.value !== newPasswordInput.value) {
                    this.style.borderColor = '#ff4444';
                } else {
                    this.style.borderColor = '#4CAF50';
                }
            }
        });
        
        confirmPasswordInput.addEventListener('focus', function() {
            this.style.borderColor = '#b85c38';
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save profile when in edit mode
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveBtn = document.getElementById('saveProfileBtn');
        if (saveBtn && !saveBtn.disabled) {
            saveProfile();
        }
    }
    
    // Escape key to cancel edit mode
    if (e.key === 'Escape') {
        const editBtn = document.querySelector('.edit-profile-btn');
        const firstInput = document.querySelector('#profileForm input');
        if (editBtn && firstInput && !firstInput.disabled) {
            toggleEditMode();
        }
    }
});