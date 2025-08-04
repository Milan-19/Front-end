# Typing Speed Test Game

A modern, interactive typing speed test application built with HTML, CSS, and JavaScript that helps users improve their typing skills while providing real-time feedback.

## Features

- 🎯 Real-time typing speed (WPM) calculation
- ✨ Live accuracy tracking
- ⏱️ Built-in timer
- 🎵 Sound feedback for correct/incorrect typing
- 📝 50+ motivational quotes for practice
- 🎨 Modern dark theme UI
- 📱 Responsive design
- 🔄 Restart functionality

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/typing-test-project.git
```

2. Navigate to the project directory:

```bash
cd typing-test-project
```

3. Open `index.html` in your web browser or use a live server.

## Usage

1. The game starts automatically when the page loads
2. Start typing the displayed text in the input field
3. Real-time feedback shows:
   - Typing speed (Words Per Minute)
   - Accuracy percentage
   - Time elapsed
4. Green highlighting indicates correct typing
5. Red highlighting indicates errors
6. When you complete the text:
   - Your final score is displayed
   - A new text appears after 5 seconds
7. Click the "Restart" button to begin a new session anytime

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Custom sound effects

## Project Structure

```
typing-test-project/
│
├── index.html          # Main HTML file
├── styles.css         # Styling file
├── script.js         # Game logic
├── error.mp3        # Error sound effect
├── success.mp3     # Success sound effect
└── README.md      # Project documentation
```

## Customization

### Adding New Quotes

To add new quotes, modify the `sampleText` array in `script.js`:

```javascript
const sampleText = [
  "Your new quote here",
  // ...more quotes
];
```

### Changing Colors

The color scheme can be modified in `styles.css`. The project uses a dark theme by default.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Motivational quotes curated from various sources
- Font: Poppins from Google Fonts
