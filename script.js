// javascript code:
        // Main Application Object
        const NeuraChat = {
            // Configuration
            config: {
                storageKey: 'neurachat_conversations',
                maxMessages: 100, // Limit to prevent memory issues
                typingDelay: 800, // Simulate AI thinking time (ms)
                aiName: 'Neura Assistant',
                userName: 'You'
            },
            
            // State
            state: {
                messages: [],
                isDarkMode: false,
                isTyping: false
            },
            
            // Initialize the application
            init: function() {
                this.loadState();
                this.setupEventListeners();
                this.renderMessages();
                this.updateMemoryStatus();
                
                // Set focus to input field
                document.getElementById('messageInput').focus();
            },
            
            // Load saved state from localStorage
            loadState: function() {
                // Load theme preference
                const savedTheme = localStorage.getItem('neurachat_theme');
                this.state.isDarkMode = savedTheme === 'dark';
                
                // Apply theme
                if (this.state.isDarkMode) {
                    document.body.classList.add('dark-mode');
                }
                
                // Load messages
                const savedMessages = localStorage.getItem(this.config.storageKey);
                if (savedMessages) {
                    try {
                        this.state.messages = JSON.parse(savedMessages);
                    } catch (e) {
                        console.error('Failed to parse saved messages:', e);
                        this.state.messages = [];
                    }
                }
            },
            
            // Save state to localStorage
            saveState: function() {
                // Save theme preference
                localStorage.setItem('neurachat_theme', this.state.isDarkMode ? 'dark' : 'light');
                
                // Save messages (limit to maxMessages)
                const messagesToSave = this.state.messages.slice(-this.config.maxMessages);
                localStorage.setItem(this.config.storageKey, JSON.stringify(messagesToSave));
                
                // Update memory status
                this.updateMemoryStatus();
            },
            
            // Set up event listeners
            setupEventListeners: function() {
                const self = this;
                
                // Send button click
                document.getElementById('sendButton').addEventListener('click', function() {
                    self.sendMessage();
                });
                
                // Input field enter key press
                document.getElementById('messageInput').addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        self.sendMessage();
                    }
                    
                    // Auto-resize textarea
                    setTimeout(() => {
                        this.style.height = 'auto';
                        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
                    }, 0);
                });
                
                // Clear chat button
                document.getElementById('clearChatBtn').addEventListener('click', function() {
                    self.clearChat();
                });
                
                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', function() {
                    self.toggleTheme();
                });
            },
            
            // Send a new message
            sendMessage: function() {
                const inputField = document.getElementById('messageInput');
                const messageText = inputField.value.trim();
                
                if (!messageText || this.state.isTyping) return;
                
                // Create user message
                const userMessage = {
                    id: Date.now(),
                    sender: 'user',
                    content: messageText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                
                // Add to messages and render
                this.state.messages.push(userMessage);
                this.renderMessages();
                
                // Clear input field and reset height
                inputField.value = '';
                inputField.style.height = 'auto';
                
                // Save state
                this.saveState();
                
                // Simulate AI response after a delay
                this.simulateAIResponse(messageText);
            },
            
            // Simulate AI response
            simulateAIResponse: function(userMessage) {
                const self = this;
                
                // Show typing indicator
                this.state.isTyping = true;
                document.getElementById('typingIndicator').style.display = 'flex';
                
                // Scroll to bottom
                this.scrollToBottom();
                
                // Simulate thinking delay
                setTimeout(function() {
                    // Hide typing indicator
                    self.state.isTyping = false;
                    document.getElementById('typingIndicator').style.display = 'none';
                    
                    // Generate AI response
                    const aiResponse = self.generateAIResponse(userMessage);
                    
                    // Create AI message object
                    const aiMessage = {
                        id: Date.now() + 1,
                        sender: 'ai',
                        content: aiResponse,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    
                    // Add to messages and render
                    self.state.messages.push(aiMessage);
                    self.renderMessages();
                    
                    // Save state
                    self.saveState();
                }, this.config.typingDelay);
            },
            
            // Generate AI response based on user input
            generateAIResponse: function(userMessage) {
                // Convert to lowercase for easier matching
                const message = userMessage.toLowerCase();
                
                // Predefined responses for common topics
                const responses = {
                    greeting: [
                        "Hello! I'm Neura, your AI assistant. How can I help you today?",
                        "Hi there! I'm here to assist you with any questions you might have.",
                        "Greetings! I'm ready to help you explore ideas and answer questions."
                    ],
                    technology: [
                        "Technology is evolving at an incredible pace. AI, quantum computing, and biotechnology are pushing the boundaries of what's possible.",
                        "The current trends in technology include edge computing, AI democratization, and sustainable tech solutions.",
                        "Technology should aim to solve human problems while being mindful of ethical considerations and accessibility."
                    ],
                    science: [
                        "Science helps us understand the universe from quantum particles to galactic superclusters.",
                        "Recent scientific breakthroughs include CRISPR gene editing, gravitational wave detection, and advancements in fusion energy.",
                        "The scientific method remains our most reliable tool for discovering truth about the natural world."
                    ],
                    help: [
                        "I can help with explanations, brainstorming, answering questions, and discussing various topics.",
                        "You can ask me about technology, science, general knowledge, or request help with problem-solving.",
                        "Try asking specific questions or request explanations on topics you're curious about."
                    ],
                    default: [
                        "That's an interesting point. Could you tell me more about what you're thinking?",
                        "I understand. Let me think about that for a moment...",
                        "Thanks for sharing. From my perspective, this topic raises several interesting considerations.",
                        "I'd be happy to explore that idea with you. What aspect are you most curious about?",
                        "That's a thoughtful question. Let me provide some insights based on available information."
                    ]
                };
                
                // Determine which category the message falls into
                let category = 'default';
                
                if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
                    category = 'greeting';
                } else if (message.includes('tech') || message.includes('computer') || message.includes('ai') || message.includes('software')) {
                    category = 'technology';
                } else if (message.includes('science') || message.includes('physics') || message.includes('biology') || message.includes('chemistry')) {
                    category = 'science';
                } else if (message.includes('help') || message.includes('what can you do') || message.includes('capabilities')) {
                    category = 'help';
                }
                
                // Select a random response from the appropriate category
                const categoryResponses = responses[category];
                const randomIndex = Math.floor(Math.random() * categoryResponses.length);
                
                return categoryResponses[randomIndex];
            },
            
            // Render all messages
            renderMessages: function() {
                const messagesContainer = document.getElementById('messagesContainer');
                const emptyState = document.getElementById('emptyState');
                
                // Show/hide empty state
                if (this.state.messages.length === 0) {
                    emptyState.style.display = 'flex';
                    messagesContainer.innerHTML = '<div class="empty-state" id="emptyState"><i class="fas fa-comments empty-icon"></i><h3>Start a conversation</h3><p>Send a message to begin chatting with your AI assistant.</p><p>Try asking about technology, science, or general knowledge.</p></div>';
                    return;
                } else {
                    emptyState.style.display = 'none';
                }
                
                // Clear container
                messagesContainer.innerHTML = '';
                
                // Render each message
                this.state.messages.forEach(message => {
                    const messageElement = this.createMessageElement(message);
                    messagesContainer.appendChild(messageElement);
                });
                
                // Scroll to bottom
                this.scrollToBottom();
            },
            
            // Create a message element
            createMessageElement: function(message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${message.sender}-message`;
                
                // Determine sender info
                const senderName = message.sender === 'user' ? this.config.userName : this.config.aiName;
                const senderIcon = message.sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
                
                // Create message HTML
                messageDiv.innerHTML = `
                    <div class="message-header">
                        <div class="${message.sender}-icon">
                            <i class="${senderIcon}"></i>
                        </div>
                        <div class="message-sender">${senderName}</div>
                        <div class="message-time">${message.timestamp}</div>
                    </div>
                    <div class="message-content">${this.formatMessageContent(message.content)}</div>
                `;
                
                return messageDiv;
            },
            
            // Format message content (basic formatting)
            formatMessageContent: function(content) {
                // Convert line breaks to <br> tags
                return content.replace(/\n/g, '<br>');
            },
            
            // Clear all chat messages
            clearChat: function() {
                if (this.state.messages.length === 0) return;
                
                if (confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
                    this.state.messages = [];
                    localStorage.removeItem(this.config.storageKey);
                    this.renderMessages();
                    this.updateMemoryStatus();
                    
                    // Show confirmation message
                    this.showNotification('Chat cleared successfully');
                }
            },
            
            // Toggle dark/light theme
            toggleTheme: function() {
                this.state.isDarkMode = !this.state.isDarkMode;
                document.body.classList.toggle('dark-mode', this.state.isDarkMode);
                this.saveState();
                
                // Update toggle button icon
                const toggleIcon = document.querySelector('.toggle-icon');
                toggleIcon.className = this.state.isDarkMode ? 'fas fa-sun toggle-icon' : 'fas fa-moon toggle-icon';
            },
            
            // Scroll to bottom of messages
            scrollToBottom: function() {
                const messagesContainer = document.getElementById('messagesContainer');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            },
            
            // Update memory status display
            updateMemoryStatus: function() {
                const statusElement = document.getElementById('memoryStatus');
                const messageCount = this.state.messages.length;
                
                if (messageCount === 0) {
                    statusElement.textContent = 'Empty';
                    statusElement.style.color = 'var(--text-secondary)';
                } else if (messageCount < 20) {
                    statusElement.textContent = 'Optimized';
                    statusElement.style.color = 'var(--success-color)';
                } else if (messageCount < 50) {
                    statusElement.textContent = 'Moderate';
                    statusElement.style.color = 'orange';
                } else {
                    statusElement.textContent = 'High';
                    statusElement.style.color = 'var(--warning-color)';
                }
            },
            
            // Show a temporary notification
            showNotification: function(message) {
                // Create notification element
                const notification = document.createElement('div');
                notification.textContent = message;
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--primary-color);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 1000;
                    animation: fadeInUp 0.3s ease-out;
                    max-width: 300px;
                `;
                
                // Add to body
                document.body.appendChild(notification);
                
                // Remove after 3 seconds
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.3s';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);
            }
        };
        
        // Initialize the app when the page loads
        window.addEventListener('DOMContentLoaded', function() {
            NeuraChat.init();
        });
