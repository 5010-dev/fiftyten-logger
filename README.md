# @fiftyten/logger

A lightweight and flexible logging utility for TypeScript/JavaScript applications with environment-aware features.

## Features

- Namespace-based logging
- Log level support (debug, info, warn, error)
- Production environment detection
- Environment-aware logging control
- TypeScript support
- Zero dependencies
- Tree-shakeable

## Installation

```bash
npm install @indspace/logger
# or
yarn add @indspace/logger
# or
pnpm add @indspace/logger
```

## Usage

### Basic Usage

```typescript
import { createLogger } from '@indspace/logger'

// Create logger with namespace
const logger = createLogger('MyApp')

logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')

// Multiple arguments support
logger.info('User logged in:', { userId: 123, time: new Date() })
```

### Advanced Configuration

```typescript
const logger = createLogger({
	namespace: 'MyApp',
	level: 'warn', // Only outputs warn and error levels
	enabled: true, // Enable/disable logging
	isProd: () => process.env.NODE_ENV === 'production', // Custom production check
})

// Dynamically change log level
logger.setLevel('error') // Now only errors will be logged

// Temporarily disable logging
logger.disable()

// Re-enable logging
logger.enable()
```

## Environment Behavior

### Development

- All log levels are displayed
- Detailed logging with namespace information
- Full debugging capabilities

### Production

- Only error level is logged by default
- Configurable through `isProd` option
- Prevents unnecessary logging in production

## API Reference

### createLogger

```typescript
function createLogger(namespace: string): Logger
function createLogger(config: LoggerConfig): Logger

interface LoggerConfig {
	namespace: string
	level?: 'debug' | 'info' | 'warn' | 'error'
	enabled?: boolean
	isProd?: () => boolean
}

interface Logger {
	debug: (...args: unknown[]) => void
	info: (...args: unknown[]) => void
	warn: (...args: unknown[]) => void
	error: (...args: unknown[]) => void
	setLevel: (level: LogLevel) => void
	enable: () => void
	disable: () => void
}
```

## Environment Detection

By default, the logger checks the following environment variables to detect production mode:

- `process.env.NODE_ENV`
- `import.meta.env.MODE`
- `import.meta.env.PROD`
- `import.meta.env.VITE_APP_ENV`

For custom environment detection, you can provide your own implementation through the `isProd` option.

## Examples

### React Component

```typescript
function UserProfile() {
  const logger = createLogger('UserProfile')

  useEffect(() => {
    logger.debug('Component mounted')
    return () => logger.debug('Component unmounted')
  }, [])

  logger.info('Rendering profile...')
  return <div>User Profile</div>
}
```

### API Service

```typescript
class ApiService {
	private logger = createLogger('ApiService')

	async fetchData() {
		try {
			this.logger.info('Fetching data...')
			// ... fetch logic
		} catch (error) {
			this.logger.error('Failed to fetch data:', error)
			throw error
		}
	}
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
