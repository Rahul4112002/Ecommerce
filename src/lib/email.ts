import { Resend } from "resend";
import { getOrderConfirmationTemplate, getStatusUpdateTemplate } from "./email-templates";

// Initialize Resend with API Key from env
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "EyeFrames <noreply@eyeframes.store>"; // Or use a verified domain if available, otherwise 'onboarding@resend.dev' for testing

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn("RESEND_API_KEY is not set. Skipping email sending.");
            return { success: false, error: "Missing API Key" };
        }

        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to,
            subject,
            html,
        });

        return { success: true, data };
    } catch (error) {
        console.error("Email sending failed:", error);
        return { success: false, error };
    }
};

export const sendOrderConfirmation = async (order: any, user: any) => {
    const html = getOrderConfirmationTemplate(order, user);
    return sendEmail({
        to: user.email,
        subject: `Order Confirmation - #${order.orderNumber || order.id.slice(-8)}`,
        html,
    });
};

export const sendStatusUpdate = async (order: any, status: string, userEmail: string) => {
    const html = getStatusUpdateTemplate(order, status);
    return sendEmail({
        to: userEmail,
        subject: `Order Update - #${order.orderNumber || order.id.slice(-8)} is ${status}`,
        html,
    });
};
