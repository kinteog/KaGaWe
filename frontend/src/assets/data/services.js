import serviceImg01 from "../images/tour-img01.jpg";
import serviceImg02 from "../images/tour-img02.jpg";
import serviceImg03 from "../images/tour-img03.jpg";
import serviceImg04 from "../images/tour-img04.jpg";
import serviceImg05 from "../images/tour-img05.jpg";
import serviceImg06 from "../images/tour-img06.jpg";
import serviceImg07 from "../images/tour-img07.jpg";

const services = [
  {
    id: "01",
    name: "Oil Change",
    description: "Regular oil changes help extend engine life and improve performance.",
    estimatedDuration: "30 minutes",
    priceRange: "$40 - $80",
    category: "Maintenance",
    bookingOptions: ["Online Payment", "Pay on Arrival"],
    photo: serviceImg01,
    featured: true,
  },
  {
    id: "02",
    name: "Wheel Alignment",
    description: "Ensures your wheels are set to the proper position, improving safety and tire lifespan.",
    estimatedDuration: "1 hour",
    priceRange: "$80 - $150",
    category: "Suspension & Steering",
    bookingOptions: ["Online Payment", "Pay on Arrival"],
    photo: serviceImg02,
    featured: true,
  },
  {
    id: "03",
    name: "Brake Pad Replacement",
    description: "Replacing worn-out brake pads to ensure safe braking performance.",
    estimatedDuration: "45 minutes",
    priceRange: "$100 - $250",
    category: "Brakes",
    bookingOptions: ["Online Payment", "Pay on Arrival"],
    photo: serviceImg03,
    featured: true,
  },
  {
    id: "04",
    name: "Battery Replacement",
    description: "Replacement of your vehicle's battery to ensure reliable starting.",
    estimatedDuration: "20 minutes",
    priceRange: "$75 - $200",
    category: "Electrical",
    bookingOptions: ["Online Payment", "Pay on Arrival"],
    photo: serviceImg04,
    featured: false,
  },
  {
    id: "05",
    name: "Engine Overhaul",
    description: "Comprehensive engine repair service for performance restoration.",
    estimatedDuration: "2-3 days",
    priceRange: "To be determined",
    category: "Engine Repair",
    bookingOptions: ["Consultation Required"],
    photo: serviceImg05,
    featured: false,
  },
  {
    id: "06",
    name: "Tire Rotation & Balancing",
    description: "Ensures even tire wear and a smoother ride.",
    estimatedDuration: "45 minutes",
    priceRange: "$50 - $100",
    category: "Tires & Wheels",
    bookingOptions: ["Online Payment", "Pay on Arrival"],
    photo: serviceImg06,
    featured: false,
  },
  {
    id: "07",
    name: "Air Conditioning Service",
    description: "Inspection and recharging of your A/C system for optimal cooling.",
    estimatedDuration: "1-2 hours",
    priceRange: "$80 - $250",
    category: "Cooling & Heating",
    bookingOptions: ["Online Payment", "Pay on Arrival"],
    photo: serviceImg07,
    featured: false,
  },
];

export default services;
