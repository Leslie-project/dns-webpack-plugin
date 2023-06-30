export = DnsOptimizationWebpackPlugin;

declare class DnsOptimizationWebpackPlugin {
  constructor(options?: DnsOptimizationWebpackPlugin.Options);
  options?: DnsOptimizationWebpackPlugin.Options;
  name: string;
  scanFileType: string[];
  apply(compiler: any): void;
}

declare namespace DnsOptimizationWebpackPlugin {
  /**
   * 文件传入类型
   */
  type excludeFileType = 'js' | 'css' | 'html';

  interface Options {
    /**
     * 传入排除的扫描文件类型
     */
    exclude?: excludeFileType[];

    /**
     * 输出的html重命名，单文件输出时生效
     */
    as?: string;

    /**
     * 手动传入DNS预解析的域名
     */
    dns?: string[];
  }
}
