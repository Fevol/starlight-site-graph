export interface StarlightPlugin {
	name: string;
	hooks?: Record<string, (...args: any[]) => void | Promise<void>>;
}
