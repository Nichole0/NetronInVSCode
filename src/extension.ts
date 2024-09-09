import * as vscode from 'vscode';
import { ModelVisualizer } from './modelVisualizer';

export function activate(context: vscode.ExtensionContext) {
	// Register our custom editor providers
	let pythonPath = '';
	let modelVisualizerDisposable: vscode.Disposable | undefined;

	const registerModelVisualizer = (path: string) => {
		// Dispose of the previous registration if it exists
		if (modelVisualizerDisposable) {
			modelVisualizerDisposable.dispose();
		}
		// Register a new instance of ModelVisualizer with the updated pythonPath
		modelVisualizerDisposable = ModelVisualizer.register(context, path);
		context.subscriptions.push(modelVisualizerDisposable);
	};

	// Initial registration with the default pythonPath (if needed)
	registerModelVisualizer(pythonPath);

	context.subscriptions.push(
		vscode.commands.registerCommand('netron.setPythonPath', async (path: string) => {
			if (path) {
				pythonPath = path;
				vscode.window.showInformationMessage(`Python Path set to ${pythonPath}`);
				// Re-register ModelVisualizer with the new pythonPath
				registerModelVisualizer(pythonPath);
			} else {
				vscode.window.showErrorMessage('Python Path not provided.');
			}
		})
	);
}