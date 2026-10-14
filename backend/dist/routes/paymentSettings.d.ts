declare const router: import("express-serve-static-core").Router;
export interface PaymentDetails {
    momoNumber: string;
    momoName: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    instructions: string;
}
export declare const DEFAULT_PAYMENT_DETAILS: PaymentDetails;
export default router;
//# sourceMappingURL=paymentSettings.d.ts.map