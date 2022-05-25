// list of certified health care providers in Ontario
// More info: https://www.healthforceontario.ca/en/Home/Health_Providers

const listOfProfessions = [
    "Audiologists",
    "Chiropodists",
    "Chiropractors",
    "Dental Hygienists",
    "Dental Technologists",
    "Dentists",
    "Denturists",
    "Dietitians",
    "Homeopaths",
    "Kinesiologists",
    "Massage Therapists",
    "Medical Laboratory Technologists",
    "Medical Radiation Technologists and Sonographers",
    "Midwives",
    "Naturopaths",
    "Nurses",
    "Occupational Therapists",
    "Opticians",
    "Optometrists",
    "Pharmacists",
    "Pharmacy Technicians",
    "Physicians",
    "Physiotherapists",
    "Podiatrists",
    "Psychologists",
    "Psychotherapists",
    "Respiratory Therapists",
    "Speech-Language Pathologists",
    "Traditional Chinese Medicine Practitioners and Acupuncturists",
]

let list = [];
listOfProfessions.forEach((profession) => {
    list = [...list, { value: profession, label: profession }];
});

export default list;