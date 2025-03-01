const APPOINTMENT_CONFIRMATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
    }
    .header {
      background-color: #5f6FFF;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #5f6FFF;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Appointment Confirmed</h1>
    </div>
    <div class="content">
      <p>Hello {PatientName},</p>
      <p>Your appointment has been successfully scheduled. Here are the details:</p>
      <ul>
        <li><strong>Doctor:</strong> {DoctorName}</li>
        <li><strong>Date:</strong> {AppointmentDate}</li>
        <li><strong>Time:</strong> {AppointmentTime}</li>
        <li><strong>Address:</strong> {Address}</li>
      </ul>
      <p>We look forward to seeing you! If you need to reschedule or cancel, feel free to contact us.</p>
      <p style="text-align: center;">
        <a href="{Link}" class="button">Manage Appointment</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Prescripto. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const APPOINTMENT_CANCELLATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Cancellation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
    }
    .header {
      background-color: #5f6FFF;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #5f6FFF;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Appointment Cancelled</h1>
    </div>
    <div class="content">
      <p>Hello {PatientName},</p>
      <p>We’re sorry to inform you that your appointment has been cancelled. Here are the details:</p>
      <ul>
        <li><strong>Doctor:</strong> {DoctorName}</li>
        <li><strong>Date:</strong> {AppointmentDate}</li>
        <li><strong>Time:</strong> {AppointmentTime}</li>
        <li><strong>Address:</strong> {Address}</li>
      </ul>
      <p>If this was a mistake or you’d like to reschedule, please let us know. We’d be happy to assist!</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Prescrpto. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export {
  APPOINTMENT_CONFIRMATION_TEMPLATE,
  APPOINTMENT_CANCELLATION_TEMPLATE,
};
