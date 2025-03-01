import { APPOINTMENT_CONFIRMATION_TEMPLATE,APPOINTMENT_CANCELLATION_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender, recipients } from "./mailtrap.config.js";

// snkjdbskvs
const sendAppointmentConfirmationEmail = async (
  PatientName,
  DoctorName,
  AppointmentDate,
  AppointmentTime,
  Address,
  Link
) => {
  // Object containing all variables to replace
  const templateVars = {
    PatientName,
    DoctorName,
    AppointmentDate,
    AppointmentTime,
    Address,
    Link,
  };

  // Function to replace all placeholders
  const replaceTemplateVars = (template, vars) => {
    let updatedTemplate = template;
    for (const [key, value] of Object.entries(vars)) {
      updatedTemplate = updatedTemplate.replace(`{${key}}`, value);
    }
    return updatedTemplate;
  };

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Appointment Confirmation",
      html: replaceTemplateVars(
        APPOINTMENT_CONFIRMATION_TEMPLATE,
        templateVars
      ),
      category: "Appointment Confirmation",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error to send appointment confirmation email : ${error}`);
    throw new Error(`Failed to send appointment confirmation email : ${error}`);
  }
};


const sendAppointmentCancellationEmail = async (
  PatientName,
  DoctorName,
  AppointmentDate,
  AppointmentTime,
  Address
) => {
  // Object containing all variables to replace
  const templateVars = {
    PatientName,
    DoctorName,
    AppointmentDate,
    AppointmentTime,
    Address
  };

  // Function to replace all placeholders
  const replaceTemplateVars = (template, vars) => {
    let updatedTemplate = template;
    for (const [key, value] of Object.entries(vars)) {
      updatedTemplate = updatedTemplate.replace(`{${key}}`, value);
    }
    return updatedTemplate;
  };

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Appointment Cancellation",
      html: replaceTemplateVars(
        APPOINTMENT_CANCELLATION_TEMPLATE,
        templateVars
      ),
      category: "Appointment Cancellation",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error to send appointment cancellation email : ${error}`);
    throw new Error(`Failed to send appointment cancellation email : ${error}`);
  }
};

export {
  sendAppointmentConfirmationEmail,
  sendAppointmentCancellationEmail
};
