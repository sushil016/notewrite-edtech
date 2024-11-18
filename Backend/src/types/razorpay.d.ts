import { RazorpayOptions } from 'razorpay';

declare module 'razorpay' {
    interface RazorpayOrderCreateOptions extends RazorpayOptions {
        amount: number;
        currency: string;
        receipt: string;
        notes?: {
            [key: string]: string;
        };
    }

    interface RazorpayOrder {
        id: string;
        entity: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string;
        status: string;
        attempts: number;
        notes: any;
        created_at: number;
    }
} 