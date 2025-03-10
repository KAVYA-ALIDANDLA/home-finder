import React, { useState } from 'react';
import { Container, Button, Col, Form, InputGroup, Row, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

function AddProperty() {
   const [images, setImages] = useState([]);
   const [propertyDetails, setPropertyDetails] = useState({
      propertyType: 'residential',
      propertyAdType: 'rent',
      propertyAddress: '',
      ownerContact: '',
      propertyAmt: 0,
      additionalInfo: ''
   });

   // Handle image selection
   const handleImageChange = (e) => {
      setImages([...e.target.files]); // Store images as an array
   };

   // Handle form field changes
   const handleChange = (e) => {
      const { name, value } = e.target;
      setPropertyDetails((prevDetails) => ({
         ...prevDetails,
         [name]: value,
      }));
   };

   // Submit form
   const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('propertyType', propertyDetails.propertyType);
      formData.append('propertyAdType', propertyDetails.propertyAdType);
      formData.append('propertyAddress', propertyDetails.propertyAddress);
      formData.append('ownerContact', propertyDetails.ownerContact);
      formData.append('propertyAmt', propertyDetails.propertyAmt);
      formData.append('additionalInfo', propertyDetails.additionalInfo);

      // Append images
      images.forEach((image) => formData.append('propertyImages', image));

      try {
         const token = localStorage.getItem('token');
         console.log("add property-",token)
         const response = await axios.post('http://localhost:8001/api/owner/postproperty', formData, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
            },
         });

         if (response.data.success) {
            message.success(response.data.message);
            setPropertyDetails({
               propertyType: 'residential',
               propertyAdType: 'rent',
               propertyAddress: '',
               ownerContact: '',
               propertyAmt: 0,
               additionalInfo: ''
            });
            setImages([]);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.error('Error adding property:', error);
         message.error("Failed to add property. Please try again.");
      }
   };

   return (
      <Container style={{ border: '1px solid lightblue', borderRadius: '5px', padding: '30px' }}>
         <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
               <Form.Group as={Col} md="4">
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select name='propertyType' value={propertyDetails.propertyType} onChange={handleChange}>
                     <option value="residential">Residential</option>
                     <option value="commercial">Commercial</option>
                     <option value="land/plot">Land/Plot</option>
                  </Form.Select>
               </Form.Group>
               <Form.Group as={Col} md="4">
                  <Form.Label>Property Ad Type</Form.Label>
                  <Form.Select name='propertyAdType' value={propertyDetails.propertyAdType} onChange={handleChange}>
                     <option value="rent">Rent</option>
                     <option value="sale">Sale</option>
                  </Form.Select>
               </Form.Group>
               <Form.Group as={Col} md="4">
                  <Form.Label>Property Full Address</Form.Label>
                  <InputGroup>
                     <Form.Control
                        type="text"
                        placeholder="Address"
                        required
                        name='propertyAddress'
                        value={propertyDetails.propertyAddress}
                        onChange={handleChange}
                     />
                  </InputGroup>
               </Form.Group>
            </Row>

            <Row className="mb-3">
               <Form.Group as={Col} md="6">
                  <Form.Label>Property Images</Form.Label>
                  <Form.Control
                     type="file"
                     accept="image/*"
                     multiple
                     onChange={handleImageChange}
                  />
               </Form.Group>
               <Form.Group as={Col} md="3">
                  <Form.Label>Owner Contact No.</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Contact number"
                     required
                     name='ownerContact'
                     value={propertyDetails.ownerContact}
                     onChange={handleChange}
                  />
               </Form.Group>
               <Form.Group as={Col} md="3">
                  <Form.Label>Property Amount</Form.Label>
                  <Form.Control
                     type="number"
                     placeholder="Amount"
                     required
                     name='propertyAmt'
                     value={propertyDetails.propertyAmt}
                     onChange={handleChange}
                  />
               </Form.Group>
            </Row>

            <FloatingLabel label="Additional details for the Property" className="mt-4">
               <Form.Control
                  name='additionalInfo'
                  value={propertyDetails.additionalInfo}
                  onChange={handleChange}
                  as="textarea"
                  placeholder="Leave a comment here"
               />
            </FloatingLabel>

            <Button variant='outline-info' className='float-right mt-3' type="submit">
               Submit Property
            </Button>
         </Form>
      </Container>
   );
}

export default AddProperty;
