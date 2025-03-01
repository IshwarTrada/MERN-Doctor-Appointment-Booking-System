import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();
// const TOKEN = "0c1756a087664e0af4d2c7dd6f099dc8";
const TOKEN = process.env.MAILTRAP_TOKEN;

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "ishwarkumartrada.21.it@iite.indusuni.ac.in",
  }
];

export { mailtrapClient, sender ,recipients};
