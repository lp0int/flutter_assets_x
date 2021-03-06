## 说明

原插件是[flutter_assets](https://marketplace.visualstudio.com/items?itemName=icofans.flutter-assets)，作者[icofans](https://github.com/icofans),
本插件修改了工作区目录获取的方式，和其他的一些细微修改

基于auto_assets插件修改,修改了配置方式, pubspec自动添加声明等...

1、在项目pubspec.yaml下添加(若不添加将使用如下默认配置)：

```yaml
flutter_assets:
  assets_path: assets/images
  output_path: lib/generated/assets
  package: module_home
  compress_images: false
```

- `assets_path` 代表项目中资源文件的目录，有多个的时候可以传入数组。
- `output_path` 代表自动生成的代码的根目录。
- `package` 指定模块，会生成模块相应的声明代码。
- `compress_images` 指定需不需要压缩图片。

2、在 VSCode -> Extensions 下搜索 `flutter_assets_x` 并安装, 重新打开项目

3、如资源目录如下:

```
|-- assets
    |-- images
    |   |-- tab
    |   |   |-- 2x
    |   |   |   |-- home.png
    |   |   |-- 3x
    |   |   |   |-- home.png
    |   |   |-- home.png
    |   |-- login
    |   |   |-- 2x
    |   |   |   |-- logo.png
    |   |   |-- 3x
    |   |   |   |-- logo.png
    |   |   |-- logo.png
```

生成dart文件如下:

lib/generated/assets/assets.dart

```dart
class Assets {
  Assets._();
  
  /// Assets for loginLogo
  /// login/2x/logo, login/3x/logo, login/logo
  static const String loginLogo = "assets/images/login/logo.png";

  /// Assets for tabHome
  /// tab/2x/home, tab/3x/home, tab/home
  static const String tabHome = "assets/images/tab/home.png";
}
```
lib/generated/assets/assets_images.dart

```dart
import 'package:flutter/widgets.dart';
import 'assets.dart';

class AssetImages {
  AssetImages._();
  
  /// Assets for loginLogo
  /// login/2x/logo, login/3x/logo, login/logo
  static AssetImage get loginLogo => const AssetImage(Assets.loginLogo);

  /// Assets for tabHome
  /// tab/2x/home, tab/3x/home, tab/home
  static AssetImage get tabHome => const AssetImage(Assets.tabHome);
}
```
lib/generated/assets/flutter_assets.dart
```dart
export 'assets.dart';
export 'assets_images.dart';
```

pubspec.yaml
```
...
  assets:
    - assets/images/login/
    - assets/images/tab/
...
```

3、设置了package时，会生成package声明的相关代码

4、新增左侧菜单, 需在模块根目录右键使用
