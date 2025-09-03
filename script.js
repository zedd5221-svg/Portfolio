let messageCount = 0;

// MATRIX RAIN EFFECT (kept intact)
function createMatrixRain() {
    const matrixContainer = document.getElementById('matrixRain');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    
    function createColumn() {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        column.style.animationDelay = Math.random() * 2 + 's';
        
        let text = '';
        const height = Math.random() * 20 + 10;
        for (let i = 0; i < height; i++) {
            text += chars[Math.floor(Math.random() * chars.length)] + '\n';
        }
        column.textContent = text;
        matrixContainer.appendChild(column);
        
        setTimeout(() => {
            column.remove();
        }, 8000);
    }
    
    for (let i = 0; i < 15; i++) setTimeout(createColumn, Math.random() * 2000);
    setInterval(createColumn, 500);
}

// ESCAPE HTML (kept intact)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// CLOSE CONFIRMATION (kept intact)
function closeConfirmation() {
    document.getElementById('sentConfirmation').style.display = 'none';
}

// GLOBAL SEND MESSAGE FUNCTION (merged EmailJS + terminal log)
function sendMessage() {
    const input = document.getElementById("messageInput");
    const messagesContainer = document.getElementById("messagesContainer");
    const messageCountEl = document.getElementById("messageCount");
    const sentConfirmation = document.getElementById("sentConfirmation");
    const messageIdEl = document.getElementById("messageId");
    
    const message = input.value.trim();
    if (!message) {
        alert("Please type a message before sending!");
        return;
    }
    
    // Generate message ID
    const messageId = 'MSG_' + Date.now().toString(36).toUpperCase();
    messageIdEl.textContent = messageId;
    
    // Append message to terminal log
    const timestamp = new Date().toLocaleString();
    const anonymousId = 'anon_' + Math.random().toString(36).substr(2, 6);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <div class="message-header">[${timestamp}] From: ${anonymousId} | ID: ${messageId}</div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    
    // Update count
    messageCount++;
    messageCountEl.textContent = messageCount;
    
    // Clear input and scroll
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show confirmation modal
    sentConfirmation.style.display = 'block';
    
    // Send message via EmailJS
    emailjs.send("service_vevszde", "template_idrsz0a", {
        from_name: "Anonymous User",
        message: message,
        reply_to: "anonymous@nowhere.com"
    }).then(function(response) {
        console.log("EmailJS SUCCESS!", response.status, response.text);
    }, function(error) {
        console.error("EmailJS FAILED...", error);
        alert("Message failed to send.");
    });
    
    // Add system confirmation message after 1s
    setTimeout(() => {
        const systemMsg = document.createElement('div');
        systemMsg.className = 'message';
        systemMsg.innerHTML = `
            <div class="message-header" style="color: #ffff00;">[SYSTEM] Message ${messageId} logged successfully</div>
            <div class="message-content" style="color: #ffff00;">Anonymous transmission completed. Message delivered to Sarcon.</div>
        `;
        messagesContainer.appendChild(systemMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

// CTRL+ENTER handler (kept intact)
document.getElementById('messageInput').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize matrix on load (kept intact)
window.addEventListener('load', () => {
    createMatrixRain();
});

// Typing cursor effect (kept intact)
setInterval(() => {
    const cursor = document.querySelector('.cursor');
    if (cursor) cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
}, 500);