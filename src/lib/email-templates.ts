
export const getOrderConfirmationTemplate = (order: any, user: any) => {
    const { id, total, items, address, paymentMethod } = order;

    const itemList = items.map((item: any) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px; font-family: sans-serif;">
        <div style="font-weight: bold;">${item.product?.name || item.name || 'Product'}</div>
        <div style="font-size: 12px; color: #666;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; text-align: right; font-family: sans-serif;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #000;">EyeFrames Store</h1>
    <p style="font-size: 18px; color: #666;">Thank you for your order!</p>
  </div>

  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <p>Hi <strong>${user.name || user.email || 'Customer'}</strong>,</p>
    <p>We're getting your order ready to be shipped. We will notify you when it has been sent.</p>
    <div style="margin: 20px 0;">
      <strong>Order ID:</strong> ${id}<br>
      <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
      <strong>Payment Method:</strong> ${paymentMethod}
    </div>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="background: #eee;">
        <th style="padding: 10px; text-align: left;">Item</th>
        <th style="padding: 10px; text-align: right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemList}
    </tbody>
    <tfoot>
      <tr>
        <td style="padding: 10px; font-weight: bold; border-top: 2px solid #333;">Total</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #333;">₹${Number(total).toLocaleString('en-IN')}</td>
      </tr>
    </tfoot>
  </table>

  <div style="margin-bottom: 20px;">
    <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">Delivery Address</h3>
    <p>
      ${address.name}<br>
      ${address.address}<br>
      ${address.city}, ${address.state} - ${address.pincode}<br>
      Phone: ${address.phone}
    </p>
  </div>

  <div style="text-align: center; color: #888; font-size: 12px; margin-top: 30px;">
    <p>&copy; ${new Date().getFullYear()} EyeFrames Store. All rights reserved.</p>
    <p>If you have any questions, reply to this email.</p>
  </div>
</body>
</html>
  `;
};

export const getStatusUpdateTemplate = (order: any, status: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #000;">EyeFrames Store</h1>
    <h2 style="color: #4CAF50;">Order ${status}</h2>
  </div>

  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
    <p>Hi,</p>
    <p>Your order <strong>#${order.orderNumber || order.id.slice(-8)}</strong> has been updated to: <strong style="color: #000;">${status}</strong></p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Track Order</a>
    </div>

    <p>We hope you enjoy your purchase!</p>
  </div>
</body>
</html>
  `;
};
