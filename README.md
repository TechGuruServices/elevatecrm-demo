# ElevateCRM Demo

A professional static demo showcasing ElevateCRM's capabilities for Transportation Solutions & Lighting (TSL). This demo simulates a complete customer relationship management system with features tailored for TSL's business needs.

## Features

- **Dashboard Overview**: Real-time metrics and activity tracking
- **Lead Management**: Visual lead flow with promotion capabilities
- **Inventory Management**: Stock tracking for TSL products including Blue Light Towers, K5 Security Robots, Traffic Systems, and Solar Lighting
- **Order Processing**: Complete order lifecycle management
- **Barcode/QR Scanner**: Simulated scanning functionality for inventory management

## Demo Highlights

- Interactive lead promotion through sales stages
- Stock reservation and inventory tracking
- Order creation and status management
- Barcode scanning simulation
- TSL-specific product catalog integration
- Professional UI with company branding

## Local Testing

### Option 1: VS Code Live Server (Recommended)
1. Install the "Live Server" extension in VS Code
2. Open the project folder in VS Code
3. Right-click on `docs/index.html`
4. Select "Open with Live Server"
5. The demo will open in your browser at `http://localhost:5500/docs/`

### Option 2: Python HTTP Server
```bash
cd elevatecrm-demo/docs
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Node.js HTTP Server
```bash
cd elevatecrm-demo/docs
npx http-server
```

## Screenshot Automation

This project includes automated screenshot capture using Puppeteer for documentation and demo purposes.

### Installation

```bash
npm install
```

### Usage

#### Basic Usage
```bash
BASE_URL=https://username.github.io/elevatecrm-demo/ npm run screenshot
```

#### With Login Credentials
```bash
BASE_URL=https://your-demo-site.com USERNAME=demo@techguru.local PASSWORD=TempDemo!2025 npm run screenshot
```

#### Headful Mode (See Browser)
```bash
HEADLESS=false BASE_URL=https://username.github.io/elevatecrm-demo/ npm run screenshot
```

#### Custom Output Directory
```bash
OUT_DIR=./my-screenshots BASE_URL=https://username.github.io/elevatecrm-demo/ npm run screenshot
```

#### Direct Script Execution
```bash
# Basic
BASE_URL=https://5a38f2f6a0f4.ngrok-free.app/ node scripts/screenshot.js

# With credentials
BASE_URL=https://your-demo.com USERNAME=demo@techguru.local PASSWORD=TempDemo!2025 node scripts/screenshot.js

# Headful mode
HEADLESS=false BASE_URL=https://your-demo.com node scripts/screenshot.js
```

### Environment Variables

- `BASE_URL` (required) - The demo root URL
- `USERNAME` (optional) - Login username if authentication required
- `PASSWORD` (optional) - Login password if authentication required
- `OUT_DIR` (optional) - Output directory for screenshots (default: `./screenshots`)
- `HEADLESS` (optional) - Set to `false` to see browser during automation (default: `true`)

### Generated Screenshots

The automation will capture the following screenshots:

1. `01_Dashboard.png` - Dashboard overview
2. `02_LeadFlow.png` - Lead management flow
3. `03_Inventory_Item.png` - Inventory management
4. `04_Order_Flow.png` - Order processing
5. `05_Barcode_QR_Scan.png` - Barcode/QR scanner
6. `06_Mobile_Scan_Phone.png` - Mobile view of scanner
7. `07_SOP_OnePager.png` - SOP documentation (if available)

Screenshots are saved to `./screenshots/` directory by default.

## GitHub Pages Deployment

### Using GitHub Website:
1. Push your code to GitHub
2. Go to your repository settings
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/docs" folder
6. Click "Save"
7. Your site will be available at `https://[username].github.io/elevatecrm-demo/`

### Using GitHub CLI:
```bash
# Enable GitHub Pages with docs folder
gh repo edit --enable-pages --pages-branch main --pages-path docs
```

## Project Structure

```
elevatecrm-demo/
├── docs/
│   ├── index.html      # Main demo page
│   ├── styles.css      # Professional styling
│   └── demo.js         # Interactive functionality
├── scripts/
│   └── screenshot.js   # Automated screenshot capture
├── screenshots/        # Generated screenshots (created by automation)
├── package.json        # Node.js dependencies
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox/grid
- **Vanilla JavaScript**: No dependencies, pure client-side
- **SVG Graphics**: Scalable company logo integration
- **Node.js + Puppeteer**: Automated screenshot generation

## Customization

The demo is designed to be easily customizable:
- Update product data in the HTML inventory section
- Modify company branding in the header
- Adjust color scheme in CSS variables
- Add new interactive features in JavaScript
- Customize screenshot automation in `scripts/screenshot.js`

## Browser Compatibility

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (responsive design)

## License

MIT License - see LICENSE file for details.
