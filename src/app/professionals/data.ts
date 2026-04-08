export type Professional = {
  id: number;
  name: string;
  specialization: string;
  category: "adhd" | "dyslexia" | "speech" | "autism" | "special-ed";
  language: "English" | "Hindi" | "Gujarati" | "Bengali" | "Tamil";
  location: string;
  rating: number;
  reviews: number;
  image: string;
};

export const professionals: Professional[] = [
  {
    id: 1,
    name: "Dr. Aanya Mehta",
    specialization: "ADHD Specialist",
    category: "adhd",
    language: "English",
    location: "Mumbai",
    rating: 4.9,
    reviews: 420,
    image: "/pro1.jpeg",
  },
  {
    id: 2,
    name: "Ritika Sharma",
    specialization: "Speech Therapist",
    category: "speech",
    language: "Hindi",
    location: "Delhi",
    rating: 4.7,
    reviews: 315,
    image: "/pro2.jpeg",
  },
  {
    id: 3,
    name: "Neha Kapoor",
    specialization: "Dyslexia Expert",
    category: "dyslexia",
    language: "English",
    location: "Bengaluru",
    rating: 4.8,
    reviews: 505,
    image: "/pro3.jpeg",
  },
  {
    id: 4,
    name: "Sonal Iyer",
    specialization: "Autism Support Coach",
    category: "autism",
    language: "Tamil",
    location: "Chennai",
    rating: 4.6,
    reviews: 260,
    image: "/pro4.jpeg",
  },
  {
    id: 5,
    name: "Mohit Verma",
    specialization: "Special Education Mentor",
    category: "special-ed",
    language: "Hindi",
    location: "Pune",
    rating: 4.5,
    reviews: 140,
    image: "/pro1.jpeg",
  },
  {
    id: 6,
    name: "Arjun Desai",
    specialization: "ADHD Behavior Coach",
    category: "adhd",
    language: "Gujarati",
    location: "Ahmedabad",
    rating: 4.8,
    reviews: 355,
    image: "/pro2.jpeg",
  },
  {
    id: 7,
    name: "Priya Nandi",
    specialization: "Speech & Language Therapist",
    category: "speech",
    language: "Bengali",
    location: "Kolkata",
    rating: 4.7,
    reviews: 280,
    image: "/pro3.jpeg",
  },
  {
    id: 8,
    name: "Kavya Rao",
    specialization: "Dyslexia Intervention Specialist",
    category: "dyslexia",
    language: "English",
    location: "Hyderabad",
    rating: 4.9,
    reviews: 630,
    image: "/pro4.jpeg",
  },
];
