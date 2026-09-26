# Key Kalimba

**Key Kalimba** is an interactive, web-based 17-key Kalimba trainer and tuner. Play along with falling notes, load custom MIDI songs, and tune your physical instrument with built-in pitch detection—directly in your browser on desktop, tablet, and mobile devices.

👉 **[Play Live Web App](https://keykalimba.netlify.app/)**

---

## Features

- **Falling Notes Visualizer**: Learn songs intuitively with falling note tiles synchronized in real time with high-fidelity acoustic Kalimba audio.
- **Physical Instrument Calibration**: Adjust the scale/zoom so the digital tines perfectly match the physical width of your real Kalimba when placed over your screen.
- **Custom MIDI Support**: Import any `.mid` or `.midi` file and practice at your own pace with adjustable tempo and timeline scrubbing.
- **Integrated Kalimba Tuner**: Tune each tine using your device microphone. Real-time pitch tracking guides you with clear visual feedback (in tune, sharp, flat) and tracks your tuning progress across all 17 keys.
- **Customizable Notation**: Toggle numbered musical notation (`1 2 3`) and octave indicators on the tines, and switch between major and alternate tunings (C Major, G Major, F Major, Bb Major, etc.).
- **Mobile & PWA Ready**: Optimized for touchscreens and landscape orientation, with offline support for practicing anywhere.

---

## Screenshots

| Playing Mode | Tuner Mode |
|:---:|:---:|
| ![Playing Mode](screenshots/main.png?v=2.6.0) | ![Tuning Mode](screenshots/tuning.png?v=2.6.0) |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Local Development
```bash
# Clone the repository
git clone https://github.com/jonashuberts/KeyKalimba.git
cd KeyKalimba

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## Kalimba MIDIs & Support

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Download%20Kalimba%20MIDIs-ff5e5b?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/keykalimba)

Download ready-to-play Kalimba `.mid` files or support the ongoing open-source development.

---

## Tech Stack

- **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) + [PWA Plugin](https://vite-pwa-org.netlify.app/)
- **Audio Engine**: Web Audio API, [soundfont-player](https://github.com/danigb/soundfont-player), [MidiPlayerJS](https://github.com/grimmdude/MidiPlayerJS)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
