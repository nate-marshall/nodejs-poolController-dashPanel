# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript/JavaScript web dashboard panel for pool controllers that communicates with a [nodejs-poolController](https://github.com/tagyoureit/nodejs-poolController) backend server. The project serves as a frontend dashboard for managing pool equipment like pumps, heaters, circuits, lights, and chemistry systems.

## Build and Development Commands

- `npm run build` - Compile TypeScript to JavaScript in the `dist/` directory
- `npm run watch` - Run TypeScript compiler in watch mode for development
- `npm start` - Build and run the application
- `npm run start:cached` - Run without building (uses existing `dist/` files)

The application starts on port 5150 by default (configurable in `config.json`).

## Architecture Overview

### Server Architecture (TypeScript)
- **Entry Point**: `app.ts` - Initializes config, logger, web server, and message queues
- **Web Server**: `server/Server.ts` - Express-based HTTP/HTTPS server with Socket.IO integration
- **Configuration**: `server/config/Config.ts` - Manages config.json with defaultConfig.json fallback
- **API Routes**: `server/api/` - REST endpoints for configuration and messages
- **Message Relay**: `server/relay/relayRoute.ts` - Handles communication with nodejs-poolController backend
- **Upload Handling**: `server/upload/upload.ts` - File upload functionality
- **Logging**: `server/logger/Logger.ts` - Winston-based logging system

### Client Architecture (JavaScript/jQuery)
- **Dashboard**: `scripts/dashboard.js` - Main dashboard using jQuery UI widgets
- **Configuration**: `scripts/configPage.js` - Pool equipment configuration interface
- **Component Scripts**: `scripts/` contains individual modules for bodies, circuits, pumps, chemistry, schedules, etc.
- **Message Manager**: `scripts/messages/` - RS485 message inspection and debugging tools

### Frontend Structure
- **Pages**: `pages/index.html` (dashboard), `pages/messageManager.html` (message debugging)
- **Themes**: `themes/` contains multiple visual themes (default, bootstrap, materia, nurple, purple, sketchy)
- **Styling**: SCSS-based theming system with responsive design

## Configuration System

The app uses a layered configuration approach:
1. `defaultConfig.json` - Base configuration defaults
2. `config.json` - User-specific overrides (auto-generated if missing)
3. Environment variables can override config values

Key configuration sections:
- `web.servers` - HTTP/HTTPS server settings
- `web.services` - nodejs-poolController backend connection settings
- `dashboard` - Frontend display options
- `log` - Logging configuration

## Communication Architecture

- **Backend Communication**: WebSocket connection to nodejs-poolController server
- **Frontend Communication**: Socket.IO for real-time updates between server and dashboard
- **Message Relay**: Acts as a proxy/relay between the dashboard frontend and nodejs-poolController backend
- **API Endpoints**: RESTful APIs for configuration management and message handling

## Key Development Notes

- TypeScript source in `server/` compiles to `dist/`
- Frontend uses jQuery UI widget system for modular components
- Themes are SCSS-based with CSS compilation
- Real-time updates use Socket.IO for dashboard reactivity
- Message debugging tools help troubleshoot RS485 pool equipment communication
- The system supports multiple pool controller types (IntelliCenter, IntelliTouch, EasyTouch)

## File Upload System

The application includes file upload capabilities primarily for log file analysis and configuration import/export functionality located in `server/upload/`.