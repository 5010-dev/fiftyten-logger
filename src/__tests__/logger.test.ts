import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLogger } from '../logger'
import type { Logger } from '../logger.types'

describe('createLogger', () => {
	let logger: Logger

	beforeEach(() => {
		// Mocking console methods before testing
		vi.spyOn(console, 'debug').mockImplementation(() => {})
		vi.spyOn(console, 'log').mockImplementation(() => {})
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	describe('Base feature', () => {
		beforeEach(() => {
			logger = createLogger('TestNamespace')
		})

		it('Message must be logged with namespace', () => {
			logger.debug('test message')
			expect(console.debug).toHaveBeenCalledWith(
				'[TestNamespace]',
				'test message',
			)
		})

		it('Must be able to handle multiple arguments', () => {
			const obj = { key: 'value' }
			logger.log('test', 123, obj)
			expect(console.log).toHaveBeenCalledWith(
				'[TestNamespace]',
				'test',
				123,
				obj,
			)
		})
	})

	describe('Log levels', () => {
		beforeEach(() => {
			logger = createLogger({ namespace: 'TestNamespace', level: 'warn' })
		})

		it('Logs lower than the set level should not be output', () => {
			logger.debug('debug message')
			logger.log('info message')
			logger.warn('warn message')
			logger.error('error message')

			expect(console.debug).not.toHaveBeenCalled()
			expect(console.log).not.toHaveBeenCalled()
			expect(console.warn).toHaveBeenCalled()
			expect(console.error).toHaveBeenCalled()
		})

		it('Must be able to dynamically change log levels', () => {
			logger.setLevel('error')
			logger.warn('warn message')
			logger.error('error message')

			expect(console.warn).not.toHaveBeenCalled()
			expect(console.error).toHaveBeenCalled()
		})
	})

	describe('Enable/disable', () => {
		beforeEach(() => {
			logger = createLogger('TestNamespace')
		})

		it('If disabled, no logs should be output', () => {
			logger.disable()
			logger.debug('test')
			logger.log('test')
			logger.warn('test')
			logger.error('test')

			expect(console.debug).not.toHaveBeenCalled()
			expect(console.log).not.toHaveBeenCalled()
			expect(console.warn).not.toHaveBeenCalled()
			expect(console.error).not.toHaveBeenCalled()
		})

		it('When re-enabled, logs must be output', () => {
			logger.disable()
			logger.error('not shown')
			expect(console.error).not.toHaveBeenCalled()

			logger.enable()
			logger.error('shown')
			expect(console.error).toHaveBeenCalledWith('[TestNamespace]', 'shown')
		})
	})

	describe('Production environment', () => {
		it('The default production check should only output errors', () => {
			// Production environment simulation
			const logger = createLogger({
				namespace: 'TestNamespace',
				isProd: () => true,
			})

			logger.debug('test')
			logger.log('test')
			logger.warn('test')
			logger.error('test')

			expect(console.debug).not.toHaveBeenCalled()
			expect(console.log).not.toHaveBeenCalled()
			expect(console.warn).not.toHaveBeenCalled()
			expect(console.error).toHaveBeenCalled()
		})

		it('Must be able to use custom isProd functions', () => {
			const customIsProd = vi.fn().mockReturnValue(true)
			const logger = createLogger({
				namespace: 'TestNamespace',
				isProd: customIsProd,
			})

			logger.error('test')
			expect(customIsProd).toHaveBeenCalled()
		})
	})
})
