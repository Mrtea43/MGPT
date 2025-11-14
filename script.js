// ==================== //
// State Management
// ==================== //

const state = {
    apiKey: '',
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    conversationHistory: [],
    isInChat: false
};

// ==================== //
// DOM Elements
// ==================== //

const elements = {
    // Navigation
    newChatBtn: document.getElementById('newChatBtn'),
    settingsBtn: document.getElementById('settingsBtn'),

    // Views
    welcomeScreen: document.getElementById('welcomeScreen'),
    chatView: document.getElementById('chatView'),
    welcomeInput: document.getElementById('welcomeInput'),

    // Modal elements
    settingsModal: document.getElementById('settingsModal'),
    closeModal: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    saveBtn: document.getElementById('saveBtn'),

    // Form elements
    apiKeyInput: document.getElementById('apiKey'),
    apiEndpointInput: document.getElementById('apiEndpoint'),
    modelSelect: document.getElementById('modelSelect'),
    toggleApiKeyBtn: document.getElementById('toggleApiKey'),

    // Chat elements
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn')
};

// ==================== //
// Initialization
// ==================== //

function init() {
    loadSettings();
    attachEventListeners();
    autoResizeTextarea();
}

// ==================== //
// Local Storage
// ==================== //

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('mertgpt_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            state.apiKey = settings.apiKey || '';
            state.apiEndpoint = settings.apiEndpoint || state.apiEndpoint;
            state.model = settings.model || state.model;

            // Update UI
            elements.apiKeyInput.value = state.apiKey;
            elements.apiEndpointInput.value = state.apiEndpoint;
            elements.modelSelect.value = state.model;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function saveSettings() {
    try {
        const settings = {
            apiKey: elements.apiKeyInput.value.trim(),
            apiEndpoint: elements.apiEndpointInput.value.trim(),
            model: elements.modelSelect.value
        };

        // Validate
        if (!settings.apiKey) {
            showNotification('API Key is required', 'error');
            return false;
        }

        if (!settings.apiEndpoint) {
            showNotification('API Endpoint is required', 'error');
            return false;
        }

        // Save to state and localStorage
        state.apiKey = settings.apiKey;
        state.apiEndpoint = settings.apiEndpoint;
        state.model = settings.model;

        localStorage.setItem('mertgpt_settings', JSON.stringify(settings));
        showNotification('Settings saved successfully!', 'success');
        closeSettingsModal();

        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Failed to save settings', 'error');
        return false;
    }
}

// ==================== //
// Event Listeners
// ==================== //

function attachEventListeners() {
    // Navigation events
    elements.newChatBtn.addEventListener('click', startNewChat);
    elements.settingsBtn.addEventListener('click', openSettingsModal);

    // Modal events
    elements.closeModal.addEventListener('click', closeSettingsModal);
    elements.cancelBtn.addEventListener('click', closeSettingsModal);
    elements.saveBtn.addEventListener('click', saveSettings);

    // Close modal on outside click
    elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) {
            closeSettingsModal();
        }
    });

    // Toggle API key visibility
    elements.toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);

    // Welcome input
    elements.welcomeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendInitialMessage();
        }
    });

    // Chat events
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keydown', handleKeyPress);
    elements.messageInput.addEventListener('input', autoResizeTextarea);
}

// ==================== //
// View Management
// ==================== //

function switchToChatView() {
    elements.welcomeScreen.classList.add('hidden');
    elements.chatView.classList.remove('hidden');
    state.isInChat = true;
    elements.messageInput.focus();
}

function switchToWelcomeView() {
    elements.chatView.classList.add('hidden');
    elements.welcomeScreen.classList.remove('hidden');
    state.isInChat = false;
    elements.welcomeInput.focus();
}

function startNewChat() {
    state.conversationHistory = [];
    elements.chatMessages.innerHTML = '';
    switchToWelcomeView();
    elements.welcomeInput.value = '';
}

// ==================== //
// Modal Functions
// ==================== //

function openSettingsModal() {
    elements.settingsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSettingsModal() {
    elements.settingsModal.classList.remove('active');
    document.body.style.overflow = '';
    loadSettings();
}

function toggleApiKeyVisibility() {
    const input = elements.apiKeyInput;
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// ==================== //
// Chat Functions
// ==================== //

function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea() {
    const textarea = elements.messageInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

async function sendInitialMessage() {
    const message = elements.welcomeInput.value.trim();

    if (!message) return;

    if (!state.apiKey) {
        showNotification('Please configure your API key first', 'error');
        openSettingsModal();
        return;
    }

    // Switch to chat view
    switchToChatView();

    // Add user message
    addMessage(message, 'user');

    // Add to conversation history
    state.conversationHistory.push({
        role: 'user',
        content: message
    });

    // Clear welcome input
    elements.welcomeInput.value = '';

    // Disable send button
    elements.sendBtn.disabled = true;

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        // Send to API
        const response = await callAPI();

        // Remove typing indicator
        typingIndicator.remove();

        // Add assistant response
        if (response && response.content) {
            addMessage(response.content, 'assistant');

            // Add to conversation history
            state.conversationHistory.push({
                role: 'assistant',
                content: response.content
            });
        }
    } catch (error) {
        // Remove typing indicator
        typingIndicator.remove();

        // Show error message
        addMessage(
            `Error: ${error.message}. Please check your API key and endpoint settings.`,
            'assistant',
            true
        );
    } finally {
        // Re-enable send button
        elements.sendBtn.disabled = false;
    }
}

async function sendMessage() {
    const message = elements.messageInput.value.trim();

    if (!message) return;

    if (!state.apiKey) {
        showNotification('Please configure your API key first', 'error');
        openSettingsModal();
        return;
    }

    // Clear input
    elements.messageInput.value = '';
    autoResizeTextarea();

    // Add user message to UI
    addMessage(message, 'user');

    // Add to conversation history
    state.conversationHistory.push({
        role: 'user',
        content: message
    });

    // Disable send button
    elements.sendBtn.disabled = true;

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        // Send to API
        const response = await callAPI();

        // Remove typing indicator
        typingIndicator.remove();

        // Add assistant response
        if (response && response.content) {
            addMessage(response.content, 'assistant');

            // Add to conversation history
            state.conversationHistory.push({
                role: 'assistant',
                content: response.content
            });
        }
    } catch (error) {
        // Remove typing indicator
        typingIndicator.remove();

        // Show error message
        addMessage(
            `Error: ${error.message}. Please check your API key and endpoint settings.`,
            'assistant',
            true
        );
    } finally {
        // Re-enable send button
        elements.sendBtn.disabled = false;
    }
}

async function callAPI() {
    try {
        // Prepare messages array for API
        const messages = [
            {
                role: 'system',
                content: 'You are MGPT, a helpful AI assistant. Provide clear, concise, and accurate responses.'
            },
            ...state.conversationHistory
        ];

        // Make API request
        const response = await fetch(state.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.apiKey}`
            },
            body: JSON.stringify({
                model: state.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error?.message ||
                `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();

        // Extract response
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return {
                content: data.choices[0].message.content
            };
        } else {
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

function addMessage(content, sender = 'assistant', isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    if (isError) {
        messageText.style.color = 'var(--error)';
    }

    // Convert markdown-like formatting to HTML
    messageText.innerHTML = formatMessage(content);

    messageDiv.appendChild(messageText);

    elements.chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message';
    messageDiv.id = 'typing-indicator';

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    messageDiv.appendChild(typingIndicator);
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

    return messageDiv;
}

function formatMessage(text) {
    // Basic formatting: convert newlines to <br>, preserve paragraphs
    return text
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

// ==================== //
// Notifications
// ==================== //

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : '#f59e0b'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 500;
        font-size: 0.9rem;
    `;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== //
// Start Application
// ==================== //

document.addEventListener('DOMContentLoaded', init);
