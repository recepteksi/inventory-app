# Atolyen Envanter Yönetim Sistemi

A React + Vite based inventory management application for efficient warehouse and inventory operations.

## 🚀 Özellikler (Features)

- **Modern Stack**: Built with React 18.3.1 and Vite for lightning-fast development
- **Responsive Design**: Mobile-friendly interface for seamless user experience
- **Real-time Updates**: Quick and efficient state management
- **Performance**: Optimized build process for production deployments

## 📋 İçindekiler (Table of Contents)

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/atolyen/atolyen-inventory-app.git
cd atolyen-inventory-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## ⚡ Quick Start

1. **Development Mode**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (default Vite port)

2. **Production Build**:
   ```bash
   npm run build
   ```
   Creates optimized build in the `dist/` directory

3. **Preview Build**:
   ```bash
   npm run preview
   ```
   Preview the production build locally

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |

## 📁 Project Structure

```
atolyen-inventory-app/
├── src/                    # Source files
│   ├── components/         # React components
│   ├── pages/              # Page components
│   └── App.jsx             # Main app component
├── dist/                   # Production build output
├── public/                 # Static assets
├── index.html              # Entry HTML file
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Technologies

### Core
- **React** (^18.3.1) - UI library
- **Vite** (^5.4.0) - Build tool and dev server
- **React DOM** (^18.3.1) - React DOM rendering

### Development
- **@vitejs/plugin-react** (^4.3.1) - React plugin for Vite

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🎉**
