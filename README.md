# Voxtype

> Control the Voxtype push-to-talk voice-to-text daemon: start/stop/toggle recording and view live status

## 🎯 Features

- Live recording status (idle/recording), model, device and backend
- Start, stop (transcribe), cancel or toggle recording from the launcher
- Dedicated hotkey-friendly "Toggle Recording" command

## 🚀 Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/) (recommended version 24 or higher)
- [Voxtype](https://voxtype.io) installed, with its daemon (`voxtype daemon`) running

### Installation

This extension is not yet published to the Vicinae Store. Install it by building from source below.

### Build From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/brpaz/vicinae-voxtype.git
2. Navigate to the project directory:
   ```bash
   cd voxtype
3. Install dependencies:
   ```bash
   npm i
4. Build the project:
   ```bash
   npm run build
   ```

This will install the extension in `~/.local/share/vicinae/extensions`, and will be available immediately on your Vicinae app.

## Development

In development, you can use the following command to watch for changes and rebuild your extension automatically:

```bash
npm run dev
```

## 🧰 Usage

The extension adds two commands to Vicinae:

- **Voxtype Status** — shows whether Voxtype is idle or recording (model, device, backend), with actions to start, stop and transcribe, cancel, or toggle recording
- **Toggle Recording** — instant start/stop, bind it to a global hotkey for mouse-driven push-to-talk

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.