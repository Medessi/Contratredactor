const ACCESS_CODE = "1234"; // Change this to your desired code

function checkAccess() {
    const code = document.getElementById('accessCode').value;
    if(code === ACCESS_CODE) {
        document.getElementById('loginOverlay').classList.add('hidden');
        document.getElementById('instructionsOverlay').classList.remove('hidden');
        loadSavedContent();
    } else {
        alert("Code d'accès incorrect");
    }
}

function closeInstructions() {
    document.getElementById('instructionsOverlay').classList.add('hidden');
}

function saveContent() {
    const content = {
        editableElements: {},
        inputs: {}
    };
    
    // Save editable content
    document.querySelectorAll('[contenteditable="true"]').forEach((el, index) => {
        content.editableElements[index] = el.innerHTML;
    });
    
    // Save input values
    document.querySelectorAll('input').forEach((input, index) => {
        content.inputs[index] = input.value;
    });
    
    localStorage.setItem('contractContent', JSON.stringify(content));
}

function loadSavedContent() {
    const saved = localStorage.getItem('contractContent');
    if (saved) {
        const content = JSON.parse(saved);
        
        // Restore editable content
        document.querySelectorAll('[contenteditable="true"]').forEach((el, index) => {
            if (content.editableElements[index]) {
                el.innerHTML = content.editableElements[index];
            }
        });
        
        // Restore input values
        document.querySelectorAll('input').forEach((input, index) => {
            if (content.inputs[index]) {
                input.value = content.inputs[index];
            }
        });
    }
}

// Add event listeners to ensure input fields don't exceed their containers
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
});

document.querySelectorAll('.name-input').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.length > 50) {
            this.value = this.value.slice(0, 50);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Auto-save on content changes
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.addEventListener('input', saveContent);
    });
    
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', saveContent);
        input.addEventListener('input', saveContent);
    });

    // Make all text elements editable except buttons and specific classes
    const editableElements = document.querySelectorAll('.document p:not(.download-btn), .document h1, .document h2, .document h3, .document h4, .document li');
    
    editableElements.forEach(element => {
        if (!element.closest('.document-meta') && 
            !element.closest('.watermark') && 
            !element.closest('.stamp') && 
            !element.closest('.additional-stamp') && 
            !element.closest('.small-stamp')) {
            element.setAttribute('contenteditable', 'true');
        }
    });

    // Save changes before printing
    window.addEventListener('beforeprint', function() {
        // Remove contenteditable attributes temporarily
        document.querySelectorAll('[contenteditable]').forEach(el => {
            el.removeAttribute('contenteditable');
        });
    });

    // Restore editability after printing
    window.addEventListener('afterprint', function() {
        editableElements.forEach(element => {
            if (!element.closest('.document-meta') && 
                !element.closest('.watermark') && 
                !element.closest('.stamp') && 
                !element.closest('.additional-stamp') && 
                !element.closest('.small-stamp')) {
                element.setAttribute('contenteditable', 'true');
            }
        });
    });

    loadSavedContent();
});

function downloadPDF() {
    window.print();
}