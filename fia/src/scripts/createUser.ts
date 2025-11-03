import dotenv from "dotenv";
dotenv.config({ path: ".env" }); 

import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/lib/models/user";

async function main() {
  console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);

  await dbConnect();

  const username = "colapinto123";
  const plainPassword = "ferrari";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    console.log(`⚠️  El usuario '${username}' ya existe.`);
    process.exit(0);
  }

  await User.create({
    username,
    password: hashedPassword,
  });

  console.log(`✅ Usuario '${username}' creado con contraseña encriptada.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
