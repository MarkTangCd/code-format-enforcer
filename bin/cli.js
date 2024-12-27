#!/usr/bin/env node
import { program } from "commander";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyFile = (src, dest) => {
  try {
    if (!fs.existsSync(src)) {
      console.error(`Source file ${src} does not exist`);
      return;
    }

    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`${src} was copied to ${dest}`);
    } else {
      console.log(`${dest} already exists, skipping...`);
    }
  } catch (err) {
    console.error(`Error copying file from ${src} to ${dest}:`, err);
  }
};

const configFiles = [
  {
    src: path.join(__dirname, "../templates/react/eslint.config.js"),
    dest: path.join(process.cwd(), "eslint.config.js"),
  },
  {
    src: path.join(__dirname, "../templates/react/.prettierrc"),
    dest: path.join(process.cwd(), ".prettierrc"),
  },
];

program
  .command("init")
  .description("Generate ESLint and Prettier configuration files")
  .action(() => {
    try {
      console.log("Installing required dependencies...");

      const dependencies = [
        "eslint",
        "eslint-config-prettier",
        "eslint-plugin-jsx-a11y",
        "eslint-plugin-prettier",
        "eslint-plugin-react",
        "eslint-plugin-react-hooks",
        "eslint-plugin-react-refresh",
        "prettier",
      ];

      //TODO: Need to check NPM manager of the project first and check whether these libraries was installed.
      execSync(`pnpm add -D ${dependencies.join(" ")}`, {
        stdio: "inherit",
      });

      console.log("Dependencies installed successfully!");
      configFiles.forEach((file) => copyFile(file.src, file.dest));
    } catch (error) {
      console.error("Failed to install dependencies:", error);
      process.exit(1);
    }
  });

program.parse(process.argv);
