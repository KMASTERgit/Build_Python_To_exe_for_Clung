import eel
import subprocess


@eel.expose
def receive_data_from_js(content):
    # コマンドプロンプトで内容を実行し、出力を逐次送信
    try:
        process = subprocess.Popen(
            content,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        # 標準出力とエラー出力を逐次読み取る
        for line in process.stdout:
            eel.update_text_area(line.strip())  # JS側に出力を送信
        for line in process.stderr:
            eel.update_text_area(f"ERROR: {line.strip()}")  # エラー出力も送信

        process.wait()  # プロセスの終了を待つ
        eel.update_text_area("Command execution completed.")
    except Exception as e:
        eel.update_text_area(f"Command execution failed: {str(e)}")


def main():
    eel.init("web")
    eel.start("main.html", size=(1024, 768))


if __name__ == "__main__":
    main()
