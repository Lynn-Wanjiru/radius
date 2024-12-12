import axios from "axios";

let token;

// Middleware to Generate Mpesa Access Token
export const createToken = async (req, res, next) => {
  const consumerKey = "zOltjQBqnajJfW0GUhcbxZYKE3kshuvxv4Ty1AH0OktZIwoD";
  const consumerSecret =
    "nZ7WBV2kqmZKf9qKkvc8RmEgK29d2FFA4VOmX5ogY8HImTv25L1nAFKiVFRMll7M";

  // Encode consumer key and secret in Base64
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  console.log("Authorization Header:", auth); // Debugging log for the header

  try {
    // Make request to Safaricom's OAuth API
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    // Save the access token
    token = response.data.access_token;
    console.log("Access Token:", token); // Debugging log for the token

    // Attach token to the request object for subsequent middleware
    req.token = token;

    // Proceed to the next middleware or route
    next();
  } catch (err) {
    console.error("Token Generation Error:", err.response?.data || err.message); // Detailed error log

    // Return an error response
    res.status(400).json({
      message: "Error generating token",
      error: err.response?.data?.errorMessage || err.message,
    });
  }
};

// Handler to Initiate Mpesa STK Push
export const postStk = async (req, res) => {
  const shortCode = "174379";
  const passkey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  // Validate input
  const { phone, amount } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({
      message: "Phone number and amount are required.",
    });
  }

  if (!phone.startsWith("0") || phone.length !== 10) {
    return res.status(400).json({
      message: "Invalid phone number format. Use 07XXXXXXXX.",
    });
  }

  const formattedPhone = phone.substring(1); // Remove leading 0 from phone number

  // Generate timestamp in the required format (YYYYMMDDHHMMSS)
  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  // Generate Base64 encoded password
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString(
    "base64"
  );

  // Prepare the STK push payload
  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${formattedPhone}`,
    PartyB: shortCode,
    PhoneNumber: `254${formattedPhone}`,
    CallBackURL: "https://www.ironwifi.com/en-us/",
    AccountReference: `Payment for ${formattedPhone}`,
    TransactionDesc: "Payment of goods",
  };

  console.log("STK Payload:", data); // Debugging log

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("STK Push Response:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(400).json({
      message: "Error initiating Mpesa STK Push",
      error: error.response?.data || error.message,
    });
  }
};
