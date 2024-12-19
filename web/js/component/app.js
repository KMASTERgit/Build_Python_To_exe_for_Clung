const app = Vue.createApp({
    data() {
      return {
        fileName: '',
        icoFileName: '',
        toggle1: false,
        toggle2: false,
        toggle3: false,
        textAreaContent: '', // プロンプト状態を表示
        newTextAreaContent: '', // 新しいテキストボックス用
        checkboxItems: [ // チェックボックスの名前を配列で管理
          "anti-bloat",
          "data-files",
          "dill-compat",
          "enum-compat",
          "eventlet",
          "gevent",
          "glfw",
          "implicit-imports",
          "multiprocessing",
          "numpy",
          "pbr-compat",
          "pkg-resources",
          "pmw-freezer",
          "pylint-warnings",
          "pyqt5",
          "pyside2",
          "pyside6",
          "pyzmq",
          "tensorflow",
          "tk-inter",
          "torch"
        ],
        selectedCheckboxes: [] // 選択されたチェックボックス
      };
    },
    watch: {
      icoFileName() {
        this.updateContent();
      },
      toggle1(val) {
        this.updateContent();
      },
      toggle2(val) {
        this.updateContent();
      },
      toggle3(val) {
        this.updateContent();
      },
      selectedCheckboxes() {
        this.updateContent();
      }
    },
    methods: {
      triggerFileDialog() {
        this.$refs.fileInput.click();
      },
      handleFileSelection(event) {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.py')) {
          this.fileName = file.name;
          this.updateContent(); // ファイル選択時に内容を再構築
        } else {
          alert('選択したファイルはPython (.py) ファイルではありません');
          this.resetState(); // 状態をリセット
        }
      },
      triggerIcoFileDialog() {
        this.$refs.icoFileInput.click();
      },
      handleIcoFileSelection(event) {
        const file = event.target.files[0];
        if (file) {
          this.icoFileName = file.webkitRelativePath || file.name;
        }
      },
      updateContent() {
        if (!this.fileName) {
          this.newTextAreaContent = ''; // ファイル名がない場合はクリア
          return;
        }
  
        // 基本構造を構築
        this.newTextAreaContent = `nuitka ${this.fileName}`;
        
        if (this.icoFileName.length > 0) {
          this.newTextAreaContent += ` --windows-icon-from-ico=${this.icoFileName}`;
        }
  
        // トグルの状態に応じてオプションを追加
        if (this.toggle1) {
          this.newTextAreaContent += ` --onefile`;
        }
        if (this.toggle2) {
          this.newTextAreaContent += ` --standalone`;
        }
        if (this.toggle3) {
          this.newTextAreaContent += ` --windows-console-mode=disable`;
        }
  
        // チェックリストの選択を追加
        if (this.selectedCheckboxes.length > 0) {
          this.newTextAreaContent += ` --plugin-enable=`;
          this.selectedCheckboxes.forEach((itemIndex, idx) => {
            const itemName = this.checkboxItems[itemIndex];
            this.newTextAreaContent += itemName;
            if (idx < this.selectedCheckboxes.length - 1) {
              this.newTextAreaContent += ','; // 最後の項目以外にカンマを追加
            }
          });
        }
      },
      resetState() {
        // ファイル名とすべての状態をリセット
        this.fileName = '';
        this.icoFileName = '';
        this.toggle1 = false;
        this.toggle2 = false;
        this.toggle3 = false;
        this.selectedCheckboxes = [];
        this.newTextAreaContent = '';
        this.textAreaContent = '';
      },
      async plonpt() {
        this.textAreaContent = '';
        await eel.receive_data_from_js(this.newTextAreaContent);
      },
    }
  });
  
  const vueInstance = app.mount('#app');
  
  // Pythonから呼び出される関数を登録
  eel.expose(update_text_area);
  function update_text_area(line) {
    vueInstance.textAreaContent += line + "\n"; // Vueインスタンスの`textAreaContent`を更新
  }
  