// @ts-check
// Import types
/** @typedef {import("./typings").Options} DnsWebpackPluginOptions */
'use strict';

const glob = require('glob');
const fs = require('fs');
const { parse } = require('node-html-parser');
const urlRegex = require('url-regex');
const path = require('path');
function isPlainObject(value) {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.getPrototypeOf({});
}

class DnsOptimizationWebpackPlugin {
  name = 'dns-optimization-webpack-plugin';
  /**
   * @param {DnsWebpackPluginOptions} [options]
   */
  constructor(options = {}) {
    if (isPlainObject(options) === false) {
      throw new Error(
        ` ${this.name} only accepts an options object. See:https://www.npmjs.com/package/dns-webpack-plugin`
      );
    }

    this.options = options;
    this.initialOptimization = false;
  }

  apply(compiler) {
    if (!compiler.options.output || !compiler.options.output.path) {
      console.warn(
        `${this.name}: options.output.path not defined. Plugin disabled...`
      );
      return;
    }

    this.outputPath = compiler.options.output.path;

    const hooks = compiler.hooks;

    hooks.emit.tap(this.name, (compilation, callback) => {
      this.handleInitial(compilation);
    });

    hooks.done.tap(this.name, stats => {
      this.handleDone(stats);
    });
  }

  /**
   * 如果编译过程报错，停止本插件的操作
   * @param {*} compilation
   */
  handleInitial(compilation) {
    console.log('handleInitial');
    const stats = compilation.getStats();
    if (stats.hasErrors()) {
      return;
    }
  }

  /**
   * 资源输出后守卫，如果编译过程报错，停止本插件的操作
   */
  handleDone(stats) {
    if (this.initialOptimization) {
      return;
    }
    if (stats.hasErrors()) {
      return;
    }
    this.initialOptimization = true;
    this.optimizateFiles();
  }

  /**
   * 优化文件主函数
   */
  optimizateFiles() {
    //遍历整个目录，找到所有的文件
    try {
      const files = glob.sync(`${this.outputPath}/**/*.{html,js,css}`);
      const urlList = [];
      files.forEach(file => {
        urlList.push(...this.matchUrlFromFile(file));
      });
      this.handleHtmlFile(Array.from(new Set(urlList)));
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * 从文件中匹配url
   * @param {*} file
   */
  matchUrlFromFile(file) {
    const urlPattern = /(https?:\/\/[^/]*)/i;
    const urls = [];
    // 匹配fileContent中的所有url
    const fileContent = fs.readFileSync(file, 'utf8');
    const matches = fileContent.match(urlRegex());
    if (matches) {
      matches.forEach(match => {
        const url = match.match(urlPattern);
        if (url && url[1]) {
          urls.push(url[1]);
        }
      });
    }
    return urls;
  }

  /**
   * 操作html文件
   * @param {*} urlList
   */
  handleHtmlFile(urlList) {
    const files = glob.sync(`${this.outputPath}/**/*.html`);
    if (files.length === 0) return;
    const links = urlList.map(url => `<link rel="dns-prefetch" href="${url}">`);
    if (links.length === 0) return;
    for (const file of files) {
      const fileContent = fs.readFileSync(file, 'utf8');
      const root = parse(fileContent);
      const head = root.querySelector('head');
      head?.insertAdjacentHTML('afterbegin', links);
      fs.writeFileSync(
        this.options.as ? path.join(this.outputPath, this.options.as) : file,
        root.toString()
      );
    }
  }
}

module.exports = DnsOptimizationWebpackPlugin;
