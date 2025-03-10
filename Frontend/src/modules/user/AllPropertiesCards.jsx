import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Card, Modal, Carousel, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { message } from "antd";

const AllPropertiesCards = ({ loggedIn }) => {
   const [index, setIndex] = useState(0);
   const [show, setShow] = useState(false);
   const [allProperties, setAllProperties] = useState([]);
   const [filterPropertyType, setPropertyType] = useState("");
   const [filterPropertyAdType, setPropertyAdType] = useState("");
   const [filterPropertyAddress, setPropertyAddress] = useState("");
   const [propertyOpen, setPropertyOpen] = useState(null);
   const [userDetails, setUserDetails] = useState({ fullName: "", phone: "" });

   // Handle user input change
   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserDetails({ ...userDetails, [name]: value });
   };

   // Handle Modal Open/Close
   const handleClose = () => setShow(false);
   const handleShow = (propertyId) => {
      setPropertyOpen(propertyId);
      setShow(true);
   };

   // Fetch Properties from Backend
   const getAllProperties = async () => {
      const token = localStorage.getItem("token");
   
      if (!token) {
         console.error("No token found. Redirecting to login...");
         message.error("Authentication required. Please log in.");
         return;
      }
   
      try {
         const response = await axios.get(`http://localhost:8001/api/user/getAllProperties`, {
            headers: { 'Authorization': `Bearer ${token}` }
         });
   
         if (response.data.success) {
            setAllProperties(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.error("Error fetching properties:", error);
         message.error("Failed to fetch properties. Please try again.");
      }
   };
   
   // Handle Property Booking
   const handleBooking = async (propertyID) => {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID"); // Ensure you store user ID on login
   
      if (!token) {
         message.error("Authentication required. Please log in.");
         return;
      }
   
      try {
         console.log("getallproper",propertyID,userID);
         const response = await axios.post(
            `http://localhost:8001/api/user/bookinghandle`, // ✅ No propertyID in URL
            { propertyID }, // ✅ Send userID
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
         );
   
         if (response.data.success) {
            message.success("Booking successful!");
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.error("Booking Error:", error.response?.data || error);
         message.error(error.response?.data?.error || "Booking failed. Please try again.");
      }
   };
   
    
   
   useEffect(() => {
      getAllProperties();
   }, []);

   // Filter properties based on user input
   const filteredProperties = allProperties
      .filter((property) => filterPropertyAddress === "" || property.propertyAddress.includes(filterPropertyAddress))
      .filter((property) => filterPropertyAdType === "" || property.propertyAdType.toLowerCase().includes(filterPropertyAdType.toLowerCase()))
      .filter((property) => filterPropertyType === "" || property.propertyType.toLowerCase().includes(filterPropertyType.toLowerCase()));

   return (
      <>
         {/* Filters Section */}
         <div className="mt-4 filter-container text-center">
            <span className="mt-3">Filter By: </span>
            <input type="text" placeholder="Address" value={filterPropertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} />
            <select value={filterPropertyAdType} onChange={(e) => setPropertyAdType(e.target.value)}>
               <option value="">All Ad Types</option>
               <option value="sale">Sale</option>
               <option value="rent">Rent</option>
            </select>
            <select value={filterPropertyType} onChange={(e) => setPropertyType(e.target.value)}>
               <option value="">All Types</option>
               <option value="commercial">Commercial</option>
               <option value="land/plot">Land/Plot</option>
               <option value="residential">Residential</option>
            </select>
         </div>

         {/* Property Cards */}
         <div className="d-flex column mt-5">
            {filteredProperties.length > 0 ? (
               filteredProperties.map((property) => (
                  <Card border="dark" key={property._id} style={{ width: "18rem", marginLeft: 10 }}>
                     <Card.Body>
                        <Card.Title>
                           <img
                              src={property.propertyImage?.length > 0 ? `http://localhost:8001${property.propertyImage[0].path}` : "/default-image.jpg"}
                              alt="property"
                           />
                        </Card.Title>

                        <Card.Text>
                           <div><b>Location:</b> {property.propertyAddress}</div>
                           <div><b>Type:</b> {property.propertyType}</div>
                           <div><b>Ad Type:</b> {property.propertyAdType}</div>

                           {loggedIn && (
                              <>
                                 <div><b>Owner Contact:</b> {property.ownerContact}</div>
                                 <div><b>Availability:</b> {property.isAvailable}</div>
                                 <div><b>Price:</b> Rs. {property.propertyAmt}</div>
                              </>
                           )}
                        </Card.Text>

                        {/* Get Info Button */}
                        {!loggedIn ? (
                           <Link to="/login">
                              <Button variant="outline-dark">Get Info</Button>
                           </Link>
                        ) : (
                           <>
                              {property.isAvailable === "Available" ? (
                                 <>
                                    <Button onClick={() => handleShow(property._id)} variant="outline-dark">Get Info</Button>

                                    {/* Property Details Modal */}
                                    <Modal show={show && propertyOpen === property._id} onHide={handleClose}>
                                       <Modal.Header closeButton>
                                          <Modal.Title>Property Info</Modal.Title>
                                       </Modal.Header>
                                       <Modal.Body>
                                          {/* Property Images */}
                                          {property.propertyImage?.length > 0 ? (
                                             <Carousel activeIndex={index} onSelect={setIndex}>
                                                {property.propertyImage.map((image, idx) => (
                                                   <Carousel.Item key={idx}>
                                                      <img src={`http://localhost:8001${image.path}`} alt={`Image ${idx + 1}`} className="d-block w-100" />
                                                   </Carousel.Item>
                                                ))}
                                             </Carousel>
                                          ) : (
                                             <p>No images available</p>
                                          )}

                                          <div>
                                             <p><b>Owner Contact:</b> {property.ownerContact}</p>
                                             <p><b>Availability:</b> {property.isAvailable}</p>
                                             <p><b>Price:</b> Rs. {property.propertyAmt}</p>
                                             <p><b>Location:</b> {property.propertyAddress}</p>
                                             <p><b>Additional Info:</b> {property.additionalInfo}</p>
                                          </div>

                                          <hr />
                                          <h4>Your Details for Booking</h4>
                                          <Form onSubmit={(e) => { e.preventDefault(); handleBooking( property._id); }}>
                                             <Row className="mb-3">
                                                <Col md="6">
                                                   <Form.Label>Full Name</Form.Label>
                                                   <Form.Control type="text" name="fullName" value={userDetails.fullName} onChange={handleChange} required />
                                                </Col>
                                                <Col md="6">
                                                   <Form.Label>Phone Number</Form.Label>
                                                   <Form.Control type="number" name="phone" value={userDetails.phone} onChange={handleChange} required />
                                                </Col>
                                             </Row>
                                             <Button type="submit" variant="secondary">Book Property</Button>
                                          </Form>
                                       </Modal.Body>
                                    </Modal>
                                 </>
                              ) : (
                                 <p>Not Available</p>
                              )}
                           </>
                        )}
                     </Card.Body>
                  </Card>
               ))
            ) : (
               <p>No Properties Available.</p>
            )}
         </div>
      </>
   );
};

export default AllPropertiesCards;