# OpsDesk 来源与修改说明

OpsDesk 是基于 [laogou717/local-ops](https://github.com/laogou717/local-ops) 的衍生项目。

## 上游项目

- 上游项目：`local-ops`
- 上游作者：`laogou717`
- 上游地址：https://github.com/laogou717/local-ops
- 上游许可证：MIT License

本仓库保留上游项目的版权声明、MIT 许可证以及第三方软件和素材许可文件。请同时阅读根目录的 [`LICENSE`](LICENSE)、[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) 和 [`ASSET_PROVENANCE.md`](ASSET_PROVENANCE.md)。

## 本项目的主要修改

- 将原本面向 macOS 的运行与启动流程扩展为 Windows / macOS 双平台；
- 增加 Windows 进程、端口、工作目录、进程树和日志处理能力；
- 增加 Windows 启动器、原生选择框和无控制台运行入口；
- 对启动台、服务监控和响应式 UI 进行了适配与视觉优化；
- 保持 Python 标准库后端、原生前端和本地回环安全边界。

## 品牌与兼容性

项目对外品牌为 **OpsDesk**。为兼容现有配置和启动器，部分内部文件名、数据目录名以及 API 文案仍保留“总控台”这一历史名称；这不表示本项目与上游仓库存在官方隶属关系。

公开发行前，还必须完成素材台账中 `REVIEW_REQUIRED` 项的许可和再分发复核；在复核完成前，不应把发行包宣传为全部素材权利已清理完毕。
