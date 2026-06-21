// BookingForm.jsx — varauksen lähetyksen yhteydessä
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

await addDoc(collection(db, 'bookings'), bookingData);

await addDoc(collection(db, 'mail'), {
  to: customerEmail,
  message: {
    subject: 'Varauksesi on vastaanotettu📅– Freewheelbikes🚴, 2026',
    html: `
      <p>Hei ${name},</p>
      <p>Varauksesi <strong>${serviceName}</strong> 
         päivälle ${date}📅klo ${time}⏰on vastaanotettu.</p>
      <p>Otamme sinuun yhteyttä vahvistusta varten.</p>
      <p>– Freewheelbikes, 2026</p>
    `
  }
});