import { Resend } from "resend";
import { RESEND_API_KEY } from "@notifications/constants/env.constants";

const resend = new Resend(RESEND_API_KEY);

export default resend;
