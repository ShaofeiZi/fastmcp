/**
 * 这是一个完整的MCP服务器示例
 * This is a complete example of an MCP server
 */
import { FastMCP } from "../FastMCP.js";
import { z } from "zod";
import { type } from "arktype";
import * as v from "valibot";

/**
 * 创建FastMCP服务器实例
 * Create FastMCP server instance
 */
const server = new FastMCP({
  name: "Addition",
  version: "1.0.0",
});

/**
 * --- Zod示例 ---
 * --- Zod Example ---
 */
const AddParamsZod = z.object({
  a: z.number().describe("The first number"), // 第一个数字
  b: z.number().describe("The second number"), // 第二个数字
});

/**
 * 使用Zod模式的加法工具
 * Addition tool using Zod schema
 */
server.addTool({
  name: "add-zod",
  description: "Add two numbers (using Zod schema)", // 使用Zod模式添加两个数字
  parameters: AddParamsZod,
  execute: async (args) => {
    // args is typed as { a: number, b: number }
    console.log(`[Zod] Adding ${args.a} and ${args.b}`);
    return String(args.a + args.b);
  },
});

/**
 * --- ArkType示例 ---
 * --- ArkType Example ---
 */
const AddParamsArkType = type({
  a: "number", // 第一个数字
  b: "number", // 第二个数字
});

/**
 * 使用ArkType模式的加法工具
 * Addition tool using ArkType schema
 */
server.addTool({
  name: "add-arktype",
  description: "Add two numbers (using ArkType schema)",
  parameters: AddParamsArkType,
  execute: async (args) => {
    // args is typed as { a: number, b: number } based on AddParamsArkType.infer
    console.log(`[ArkType] Adding ${args.a} and ${args.b}`);
    return String(args.a + args.b);
  },
});

/**
 * --- Valibot示例 ---
 * --- Valibot Example ---
 */
const AddParamsValibot = v.object({
  a: v.number("The first number"), // 第一个数字
  b: v.number("The second number"), // 第二个数字
});

/**
 * 添加资源示例
 * Resource addition example
 */
server.addTool({
  name: "add-valibot",
  description: "Add two numbers (using Valibot schema)",
  parameters: AddParamsValibot,
  execute: async (args) => {
    console.log(`[Valibot] Adding ${args.a} and ${args.b}`);
    return String(args.a + args.b);
  },
});

server.addResource({
  uri: "file:///logs/app.log",
  name: "Application Logs",
  mimeType: "text/plain",
  async load() {
    return {
      text: "Example log content",
    };
  },
});

/**
 * 添加提示示例
 * Prompt addition example
 */
server.addPrompt({
  name: "git-commit",
  description: "Generate a Git commit message",
  arguments: [
    {
      name: "changes",
      description: "Git diff or description of changes",
      required: true,
    },
  ],
  load: async (args) => {
    return `Generate a concise but descriptive commit message for these changes:\n\n${args.changes}`;
  },
});

server.start({
  transportType: "stdio",
});
