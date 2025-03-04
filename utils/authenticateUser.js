import dbConnect from "@/lib/db"; // Ensure DB connection 
import Authuser from "@/models/User";
import bcrypt from "bcryptjs";

async function authenticateUser(email, password) {
  try {
    await dbConnect(); // Ensure database is connected

    const user = await Authuser.findOne({ email });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid email or password" };
    }

    return {
      id: user._id.toString(), // Ensure ID is a string
      name: user.name,
      email: user.email,
      token: user.token, // Ensure token is set in DB
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Internal server error" };
  }
}

export default authenticateUser;
