# Pulse Photon Website

A modern landing page for Pulse Photon featuring an elegant contour-style background design, perfect for GitHub Pages hosting.

## Features

- 🎨 Dynamic contour background with flowing lines
- ✨ Animated golden shimmer effect on the title
- 👑 Elegant crown icon with glow effect
- 📱 Fully responsive design
- 🚀 Optimized for GitHub Pages

## Setup Instructions

### Option 1: GitHub Pages from Repository

1. Fork or create a new repository with this code
2. Go to your repository Settings
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 2: GitHub Pages User/Organization Site

1. Create a repository named `yourusername.github.io`
2. Upload these files to the repository
3. Your site will automatically be available at `https://yourusername.github.io`

## File Structure

```
├── index.html          # Main landing page
├── style.css           # Styling and animations
├── _config.yml         # GitHub Pages configuration
└── README.md           # This file
```

## Customization

### Changing the Title
Edit the `<h1>` tag in `index.html`:
```html
<h1 class="title">YOUR TITLE HERE</h1>
```

### Modifying the Subtitle
Edit the `<p>` tag in `index.html`:
```html
<p class="subtitle">Your Subtitle Here</p>
```

### Adjusting Colors
The main colors can be modified in `style.css`:
- Background: `#0a0a0a` (dark)
- Contour lines: `rgba(255, 193, 7, 0.3)` (golden)
- Text gradient: `#ffffff` to `#ffd700`

### Contour Animation
The contour lines have subtle floating animations with different delays to create organic movement. You can adjust the animation duration by modifying the `animation` property in the `.contour-line` class.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the [MIT License](LICENSE). 