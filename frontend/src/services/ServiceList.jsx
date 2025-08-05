

import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";

import weatherImg from '../assets/images/mainteinance.png';
import guideImg from '../assets/images/repair.png';
import customizationImg from '../assets/images/mod.png';

const servicesData =[
  {
    imgUrl: weatherImg,
    title: "Routine Maintenance",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
  {
    imgUrl: guideImg,
    title: "Car Repair",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
  {
    imgUrl: customizationImg,
    title: "Customization and Mods",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
]

export const ServiceList = () => {
  return (
    <>
 
    {servicesData.map((item, index)=> (
      <Col lg="3" md='6' sm='12' className="mb--4" key={index}>
      <ServiceCard item={item} />
      </Col>
      ))}
  
  </>
  );
};

export default ServiceList;
