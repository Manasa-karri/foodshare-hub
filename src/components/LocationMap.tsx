import React from "react";

const LocationMap: React.FC = () => {
  return (
    <div className="w-full rounded-lg overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243208.96917090248!2d83.09777813039061!3d17.738034663709527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9c20395498468!2sVisakhapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1767524464728!5m2!1sen!2sin"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default LocationMap;
