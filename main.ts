import { App, Editor, FileSystemAdapter, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Vault } from 'obsidian';
import success from "audio/success.mp3"

const CHECKBOX_CLASS = "task-list-item-checkbox"

interface TaskBellSettings {
	audioPath: string;
}

const DEFAULT_SETTINGS: TaskBellSettings = {
	audioPath: null 
}


export default class TaskBell extends Plugin {
  	settings: TaskBellSettings;
	async onload() {
    		await this.loadSettings();
		this.addSettingTab(new TaskBellSettingTab(this.app, this));
    

    // on task status changed. 
    // Listener on every single task item....?|

    const vault = new Vault();
    const ll = vault.getFiles()
    console.log(ll)

    console.log(FileSystemAdapter.readLocalFile('Audio/i'))

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			const target = evt.target as HTMLElement;
      const classname = target.className;

      console.log(classname)

      const f = vault.create();
      
      if (classname === CHECKBOX_CLASS) {
        var audio = new Audio(success);
        audio.play();
      }

		});
	}
	onunload() {
		console.log("No more task sounds for you.")
	}
  	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class TaskBellSettingTab extends PluginSettingTab {
	plugin: TaskBell;
	constructor(app: App, plugin: TaskBell) {
		super(app, plugin);
		this.plugin = plugin;
	}
	display(): void {
		let {containerEl} = this;
		containerEl.empty();
		new Setting(containerEl)
			.setName('Task Completition Sound')
			.setDesc('You change the sound by replacing the file here: ')
    .addText(text => text

        .setPlaceholder('Audio/tick.mp3')
        .setValue(this.plugin.settings.audioPath)
        .onChange(async (value) => {
        this.plugin.settings.audioPath = value;
        await this.plugin.saveSettings();
        })
    )
	}
}
