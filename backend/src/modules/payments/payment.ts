import axios from "axios";

export const initializePayment = async (email: string) => {
  const res = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount: 1000 * 100, // kobo
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      },
    },
  );

  return res.data;
};
