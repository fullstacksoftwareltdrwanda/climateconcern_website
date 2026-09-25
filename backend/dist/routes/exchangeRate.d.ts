declare const router: import("express-serve-static-core").Router;
interface RateInfo {
    rate: number;
    mode: 'auto' | 'manual';
    lastUpdated: string;
}
export declare function getCurrentExchangeRate(): Promise<RateInfo>;
export default router;
//# sourceMappingURL=exchangeRate.d.ts.map