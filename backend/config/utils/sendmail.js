import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async ({
  to,
  name,
  orderId,
  items,
  amount,
  address,
  city,
  postalCode,
}) => {
  const itemList = items
    .map(
      (item) =>
        `<li>${item.product_name} - Qty: ${item.quantity} - $${item.price * item.quantity}</li>`
    )
    .join("");

  const html = `
    <h2>Thank you for your purchase, ${name}!</h2>
    <p>Your order <strong>#${orderId}</strong> has been confirmed.</p>
    <p><strong>Order Details:</strong></p>
    <ul>${itemList}</ul>
    <p><strong>Total Amount:</strong> $${amount}</p>
    <p><strong>Shipping Address:</strong> ${address}, ${city} - ${postalCode}</p>
    <p>We’ll notify you when your items are out for delivery.</p>
  `;

  try {
    console.log(" Sending email to:", to);
    await transporter.sendMail({
      from: `"Shop Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmation - #${orderId}`,
      html,
    });
    console.log(" Email sent successfully to:", to);
  } catch (error) {
    console.error(" Failed to send email:", error);
  }
};

export default sendOrderConfirmationEmail;
