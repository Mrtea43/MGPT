# MGPT - Modern AI Chat Interface

A clean, modern, and responsive chat interface with API key integration for AI conversations. Features a beautiful dark theme design with smooth animations and an intuitive user experience.

## Features

### Core Functionality
- **Real-time Chat Interface** - Seamless conversation experience with instant message updates
- **API Integration** - Connect to OpenAI, Claude, or any compatible AI API endpoint
- **Conversation History** - Maintains context throughout the conversation
- **Secure API Key Storage** - API keys stored locally in browser storage, never transmitted to third parties

### User Interface
- **Modern Dark Theme** - Eye-friendly dark mode with gradient accents
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations** - Polished transitions and micro-interactions
- **Typing Indicators** - Visual feedback while AI is generating responses
- **Auto-resizing Input** - Text area adapts to content size

### Settings & Configuration
- **Customizable API Endpoint** - Support for multiple AI providers
- **Model Selection** - Choose between different AI models
- **Secure Password Fields** - Toggle visibility for API keys
- **Persistent Settings** - Preferences saved across sessions

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- API key from an AI provider (OpenAI, Anthropic, etc.)

### Installation

1. **Clone or download** this repository to your local machine

2. **Open the application**
   - Simply open `index.html` in your web browser
   - No build process or dependencies required!

3. **Configure your API key**
   - Click the settings icon (⚙️) in the top right corner
   - Enter your API key
   - Configure the API endpoint (default: OpenAI)
   - Select your preferred model
   - Click "Save Settings"

### API Configuration

#### OpenAI
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model Options**: `gpt-4`, `gpt-3.5-turbo`
- **Get API Key**: [OpenAI Platform](https://platform.openai.com/api-keys)

#### Anthropic Claude
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Model Options**: `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`
- **Get API Key**: [Anthropic Console](https://console.anthropic.com/)

#### Custom API
The application supports any API that follows the OpenAI chat completion format.

## Usage

1. **Start Chatting**
   - Type your message in the input field at the bottom
   - Press `Enter` to send (or `Shift + Enter` for new line)
   - Click the send button (➤) to submit

2. **View Responses**
   - AI responses appear with a bot avatar
   - Your messages appear with a user avatar
   - Timestamps show when messages were sent

3. **Manage Settings**
   - Click the settings icon to update configuration
   - Changes are saved automatically to local storage
   - Settings persist across browser sessions

## File Structure

```
MertGPT/
│
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling & animations
├── script.js           # JavaScript functionality & API integration
└── README.md          # Documentation (this file)
```

## Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables, flexbox, animations
- **Vanilla JavaScript** - No frameworks, pure ES6+ JavaScript
- **LocalStorage API** - Persistent settings storage
- **Fetch API** - HTTP requests to AI endpoints

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Security Features
- API keys stored only in browser's local storage
- Password-type input fields for sensitive data
- No third-party analytics or tracking
- All communication directly with configured API endpoint

## Customization

### Changing the Color Scheme

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;      /* Main accent color */
    --secondary-color: #8b5cf6;    /* Secondary accent */
    --background: #0f1117;         /* Main background */
    --surface: #1a1b26;            /* Card/surface background */
    /* ... more variables ... */
}
```

### Adding New AI Models

Update the model select options in `index.html`:

```html
<select id="modelSelect">
    <option value="your-model">Your Model Name</option>
</select>
```

### Modifying API Request Format

Edit the `callAPI` function in `script.js` to customize the request payload:

```javascript
body: JSON.stringify({
    model: state.model,
    messages: messages,
    temperature: 0.7,
    max_tokens: 1000,
    // Add your custom parameters here
})
```

## Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line in message
- `Esc` - Close settings modal (when open)

## Troubleshooting

### "Please configure your API key" error
- Make sure you've entered a valid API key in settings
- Check that the API key has proper permissions
- Verify the API endpoint URL is correct

### Messages not sending
- Check browser console for errors (F12)
- Verify your internet connection
- Ensure API endpoint is accessible
- Confirm API key has sufficient credits/quota

### Styling issues
- Clear browser cache and reload
- Ensure all files are in the same directory
- Check browser compatibility

## Privacy & Data

- **No data collection** - This application doesn't collect any user data
- **Local storage only** - Settings and API keys stored in your browser
- **Direct API calls** - Communication only between your browser and configured API
- **No server** - Entirely client-side application

## License

This project is open source and available for personal and commercial use.

## Contributing

Feel free to fork, modify, and enhance this project! Some ideas for contributions:
- Add support for more AI providers
- Implement message export functionality
- Add code syntax highlighting
- Create light theme option
- Add voice input support

## Support

For issues, questions, or suggestions:
1. Check the troubleshooting section
2. Review browser console for error messages
3. Verify API key and endpoint configuration

## Credits

Created with modern web technologies and a focus on user experience.

---

**Enjoy chatting with MGPT!** 🤖✨
