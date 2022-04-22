const Constant = Object.freeze({
  FLUTTER_PUBSPEC: "pubspec.yaml"
});
const vscode = require('vscode');
class FlutterAssets {
  constructor(root) {
    this.root = root;
  }

  restart() {
    this.stop();
    this.start();
  }

  stop() {
    this.folderWatcher.stop();
  }

  start() {
    /// 当前文件夹设置为 root 位置
    const process = require("process");
    process.chdir(this.root);
    /// 校验是否是 flutter 项目
    this._validateFlutterProject();
    /// 提取配置文件
    const configs = this._extraConfigFileContent();
    const FolderWatcher = require("./folder_watcher/folder_watcher.js");
    this.folderWatcher = new FolderWatcher(configs);
    this.folderWatcher.start();
  }

  _validateFlutterProject() {
    const yamlFilePath = `${this.root}/${Constant.FLUTTER_PUBSPEC}`;
    const fs = require("fs");
    if (!fs.existsSync(yamlFilePath)) {
      throw new Error("root path must have an pubspec.yaml file");
    }
  }
  extraConfigFileContent() {
    return this._extraConfigFileContent();
  }

  _extraConfigFileContent() {
    const yaml = require("js-yaml");
    const fs = require("fs");
    let config, assets, code, packageName, compressImages;

    const doc = yaml.safeLoad(fs.readFileSync(Constant.FLUTTER_PUBSPEC));
    if (!doc.hasOwnProperty("flutter_assets")) {
      // throw new Error("not found assets_config in pubspec.yaml file");
      config = {
        assets_path: "assets/images",
        output_path: "lib/generated/assets",
        compress_images: false,
        package: ""
      };
      vscode.window.showWarningMessage('pubspec.yaml file not found flutter_assets config，use default config');
    } else {
      config = doc.flutter_assets;
    }
    assets = config.assets_path;
    compressImages = config.compress_images;
    code = config.output_path || "lib/generated/assets";
    packageName = config.package || "";
    // const config = doc.flutter_assets;
    // const assets = config.assets_path;
    // const code = config.output_path || "lib/assets";
    // const packageName = config.package || "";

    if (!assets) {
      throw new Error(
        "assets_config.json file must specify `assets` folder as assets"
      );
    }
    const { trimEnd } = require("lodash/string");
    const { flatten } = require("lodash/array");
    return {
      assets_path: flatten([assets]).map(a => trimEnd(a, "/")),
      output_path: trimEnd(code, "/"),
      pubspec: Constant.FLUTTER_PUBSPEC,
      packageName: packageName,
      compressImages: compressImages,
      yaml_file_path: `${this.root}/${Constant.FLUTTER_PUBSPEC}`,
    };
  }
}

module.exports = FlutterAssets;
