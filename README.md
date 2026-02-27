# Docmost Desktop

A native macOS desktop application for [Docmost](https://docmost.com) - the open-source collaborative wiki and documentation software.

![Docmost Desktop](assets/screenshot.png)

## Features

- **Native macOS Experience** - Clean, native window controls and menu bar integration
- **Keyboard Shortcuts** - Full support for Docmost's editor shortcuts via menu bar
- **Configurable URL** - Connect to any self-hosted Docmost instance
- **Persistent Sessions** - Stay logged in between app restarts
- **Dark Mode** - Matches Docmost's dark theme seamlessly

### Menu Bar Integration

| Menu | Features |
|------|----------|
| **Navigate** | Quick Search (`Cmd+K`), Back, Forward, Go Home |
| **Format** | Bold, Italic, Underline, Headings, Lists, Code Blocks, Blockquotes |
| **View** | Reload, Zoom Controls, Fullscreen, DevTools |

### Keyboard Shortcuts

All standard Docmost editor shortcuts work natively:

| Action | Shortcut |
|--------|----------|
| Quick Search | `Cmd+K` |
| Bold | `Cmd+B` |
| Italic | `Cmd+I` |
| Heading 1-3 | `Cmd+Alt+1/2/3` |
| Bullet List | `Cmd+Shift+8` |
| Numbered List | `Cmd+Shift+7` |
| Code Block | `Cmd+Alt+C` |
| Find & Replace | `Cmd+F` |

[View all shortcuts](https://docmost.com/docs/user-guide/editor#keyboard-shortcuts)

## Installation

### Download

Download the latest release from the [Releases](https://github.com/drewling/docmost-wrapper/releases) page.

| File | Architecture | For |
|------|--------------|-----|
| `Docmost-x.x.x-arm64.dmg` | Apple Silicon | M1/M2/M3 Macs |
| `Docmost-x.x.x.dmg` | Intel | Intel-based Macs |

### Requirements

- macOS 10.15 (Catalina) or later
- A Docmost instance (self-hosted or cloud)

### First Run

1. Open the downloaded DMG file
2. Drag **Docmost** to your Applications folder
3. Launch Docmost from Applications
4. Enter your Docmost instance URL when prompted
5. Start documenting!

> **Note**: On first launch, macOS may ask you to confirm opening an app from an unidentified developer. Go to **System Settings → Privacy & Security** and click **Open Anyway**.

## Configuration

### Changing the Instance URL

1. Go to **Docmost → Settings...** (or press `Cmd+,`)
2. Enter your new Docmost URL
3. Click **Save & Reload**

### Config File Location

Settings are stored at:
```
~/Library/Application Support/docmost-wrapper/config.json
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/drewling/docmost-wrapper.git
cd docmost-wrapper

# Install dependencies
npm install

# Run in development
npm start

# Build for macOS
npm run build:mac
```

### Build Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run development app |
| `npm run build:mac` | Build for both architectures |
| `npm run build:mac-arm` | Build for Apple Silicon |
| `npm run build:mac-intel` | Build for Intel |

## Tech Stack

- [Electron](https://www.electronjs.org/) - Cross-platform desktop apps
- [electron-store](https://github.com/sindresorhus/electron-store) - Persistent settings

## Related

- [Docmost](https://github.com/docmost/docmost) - The Docmost project
- [Docmost Documentation](https://docmost.com/docs) - Official docs

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ by [Drewling](https://github.com/drewling)
