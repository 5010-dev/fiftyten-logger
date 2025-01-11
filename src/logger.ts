import type { Logger, LoggerConfig, LogLevel } from './logger.types'

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
}

export const createLogger = (
	configOrNamespace: LoggerConfig | string,
): Logger => {
	const config: LoggerConfig =
		typeof configOrNamespace === 'string'
			? { namespace: configOrNamespace }
			: configOrNamespace

	let currentLevel: LogLevel = config.level || 'debug'
	let isEnabled: boolean = config.enabled ?? true

	// Utility function to check if the environment is production
	const defaultIsProd = (): boolean => {
		try {
			return (
				process.env.NODE_ENV === 'production' ||
				import.meta?.env?.MODE === 'production' ||
				import.meta?.env?.PROD === true ||
				import.meta?.env?.VITE_APP_ENV === 'production'
			)
		} catch {
			return false
		}
	}
	const isProd = config.isProd || defaultIsProd

	const shouldLog = (level: LogLevel): boolean => {
		if (!isEnabled || (isProd() && level !== 'error')) return false
		return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]
	}

	const createLogMethod =
		(level: LogLevel) =>
		(...args: unknown[]) => {
			if (!shouldLog(level)) return

			const consoleMethod = level === 'info' ? 'log' : level
			console[consoleMethod](`[${config.namespace}]`, ...args)
		}

	return {
		debug: createLogMethod('debug'),
		log: createLogMethod('info'),
		warn: createLogMethod('warn'),
		error: createLogMethod('error'),
		setLevel: (level: LogLevel) => {
			currentLevel = level
		},
		enable: () => {
			isEnabled = true
		},
		disable: () => {
			isEnabled = false
		},
	}
}
