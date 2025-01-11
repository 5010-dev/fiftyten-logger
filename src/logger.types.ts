export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LoggerConfig {
	namespace: string
	level?: LogLevel
	enabled?: boolean
	isProd?: () => boolean
}

export interface Logger {
	debug: (...args: unknown[]) => void
	log: (...args: unknown[]) => void
	warn: (...args: unknown[]) => void
	error: (...args: unknown[]) => void
	setLevel: (level: LogLevel) => void
	enable: () => void
	disable: () => void
}
