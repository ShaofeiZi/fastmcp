#!/usr/bin/env node

/**
 * 命令行参数解析工具
 * Command line argument parsing tool
 */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { execa } from "execa";

/**
 * 配置命令行界面
 * Configure command line interface
 */
await yargs(hideBin(process.argv))
  .scriptName("fastmcp")
  /**
   * 开发服务器命令
   * Development server command
   */
  .command(
    "dev <file>",
    "Start a development server", // 启动开发服务器
    (yargs) => {
      return yargs.positional("file", {
        type: "string",
        describe: "The path to the server file", // 服务器文件的路径
        demandOption: true,
      });
    },
    async (argv) => {
      try {
        await execa({
          stdin: "inherit",
          stdout: "inherit",
          stderr: "inherit",
        })`npx @wong2/mcp-cli npx tsx ${argv.file}`;
      } catch {
        process.exit(1);
      }
    }
  )
  /**
   * 检查服务器文件命令
   * Inspect server file command
   */
  .command(
    "inspect <file>",
    "Inspect a server file", // 检查服务器文件
    (yargs) => {
      return yargs.positional("file", {
        type: "string",
        describe: "The path to the server file", // 服务器文件的路径
        demandOption: true,
      });
    },
    async (argv) => {
      try {
        await execa({
          stdout: "inherit",
          stderr: "inherit",
        })`npx @modelcontextprotocol/inspector npx tsx ${argv.file}`;
      } catch {
        process.exit(1);
      }
    }
  )
  .help()
  .parseAsync();
