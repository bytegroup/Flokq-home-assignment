export class Logger {
    private static formatMessage(level: string, message: string, meta?: any): string {
        const timestamp = new Date().toISOString();
        const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level}] ${message}${metaString}`;
    }

    static info(message: string, meta?: any): void {
        console.log(this.formatMessage('INFO', message, meta));
    }

    static error(message: string, error?: any): void {
        console.error(this.formatMessage('ERROR', message, {
            message: error?.message,
            stack: error?.stack,
            code: error?.code,
        }));
    }

    static warn(message: string, meta?: any): void {
        console.warn(this.formatMessage('WARN', message, meta));
    }

    static debug(message: string, meta?: any): void {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('DEBUG', message, meta));
        }
    }
}