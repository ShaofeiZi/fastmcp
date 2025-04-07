# FastMCP

一个用于构建能够处理客户端会话的[MCP](https://glama.ai/mcp)服务器的TypeScript框架。

> [!NOTE]
>
> 如需Python实现，请参考[FastMCP](https://github.com/jlowin/fastmcp)。

## 功能特性

- 简单的工具、资源和提示定义
- [认证](#authentication)
- [会话](#sessions)
- [图片内容](#returning-an-image)
- [日志](#logging)
- [错误处理](#errors)
- [SSE](#sse)
- CORS (默认启用)
- [进度通知](#progress)
- [类型化服务器事件](#typed-server-events)
- [提示参数自动补全](#prompt-argument-auto-completion)
- [采样](#requestsampling)
- 自动SSE心跳
- 根目录
- 用于[测试](#test-with-mcp-cli)和[调试](#inspect-with-mcp-inspector)的CLI

## 安装

```bash
npm install fastmcp
```

## 快速开始

> [!NOTE]
>
> 有许多实际使用FastMCP的示例，请参考[展示](#showcase)部分。

```ts
import { FastMCP } from "fastmcp";
import { z } from "zod"; // 或任何支持标准模式的验证库

const server = new FastMCP({
  name: "我的服务器",
  version: "1.0.0",
});

server.addTool({
  name: "add",
  description: "两个数字相加",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async (args) => {
    return String(args.a + args.b);
  },
});

server.start({
  transportType: "stdio",
});
```

_就这样！_ 您已经拥有一个可工作的MCP服务器了。

您可以在终端中测试服务器：

```bash
git clone https://github.com/punkpeye/fastmcp.git
cd fastmcp

npm install

# 使用CLI测试加法服务器示例:
npx fastmcp dev src/examples/addition.ts
# 使用MCP检查器测试加法服务器示例:
npx fastmcp inspect src/examples/addition.ts
```

### SSE

[服务器发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)(SSE)提供了一种机制，使服务器能够通过HTTPS连接向客户端发送实时更新。在MCP的上下文中，SSE主要用于实现远程MCP通信，允许托管在远程机器上的MCP通过网络被访问并中继更新。

您也可以使用SSE支持运行服务器：

```ts
server.start({
  transportType: "sse",
  sse: {
    endpoint: "/sse",
    port: 8080,
  },
});
```

这将启动服务器并在`http://localhost:8080/sse`上监听SSE连接。

然后您可以使用`SSEClientTransport`连接到服务器：

```ts
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  },
);

const transport = new SSEClientTransport(new URL(`http://localhost:8080/sse`));

await client.connect(transport);
```
