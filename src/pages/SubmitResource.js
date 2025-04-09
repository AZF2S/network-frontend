import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resourcesApi } from "../api";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import "./SubmitResource.css";
import ".././config";
import Confetti from "react-confetti";
import { useDialog } from '../utils/DialogProvider';

function SubmitResource() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    link: "",
    briefExplanation: "",
    workGroup: [],
    applicableAudience: [],
    ageGroup: [],
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { requestDialog } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = (updatedFormData) => {
    const isWorkGroupSelected = updatedFormData.workGroup.length > 0;
    const isAudienceSelected = updatedFormData.applicableAudience.length > 0;
    const isAgeGroupSelected = updatedFormData.ageGroup.length > 0;
    const areRequiredFieldsFilled = 
      updatedFormData.title &&
      updatedFormData.author &&
      updatedFormData.link &&
      updatedFormData.briefExplanation;
    
    setIsFormValid(isWorkGroupSelected && isAudienceSelected && isAgeGroupSelected && areRequiredFieldsFilled);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    validateForm(updatedFormData);
  };

  const handleCheckboxChange = (category, value) => {
    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        [category]: prevData[category].includes(value)
          ? prevData[category].filter((item) => item !== value)
          : [...prevData[category], value],
      };
      validateForm(updatedFormData);
      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await resourcesApi.submitResource(formData);
      if (response.success) {
        console.log("Resource submitted successfully");
        setShowConfetti(true);
        requestDialog(
          'Thank You!',
          'Your resource has been submitted successfully. It will be reviewed and added to the library within 2 business days.',
          "Back to Resource Library",
          () => { navigate('/resources'); },
        );
      } else {
        console.log("Error:", response.error);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const topics = [
    "Getting Started with Farm to School",
    "School Garden",
    "Food Education",
    "Farm to Early Care",
    "Procurement Workgroup",
    "Produce Related",
    "School Food Service",
    "Advocacy and Sustainability",
    "Reports and Tools",
  ];

  const roles = [
    "Administrators & Food Directors",
    "Educators",
    "Students",
    "Producers",
    "Purchasers",
    "Other",
  ];

  const ageGroups = ["Early Care", "K+", "K-5", "K-8", "K-12", "10+", "Adults"];

  return (
    <div className="submit-resource-container">
      {showConfetti && <Confetti />}
      <div className="submit-resource-hero">
        <h1>Submit a Resource</h1>
      </div>
      <div className="submit-resource-content">
        <p className="submit-resource-subheader" style={{ maxWidth: "calc(100% - 200px)", margin: "0 auto 20px" }}>
          Help grow our resource library! Submit your resource below, and it will be reviewed and added within 2 business days.
        </p>
        <form onSubmit={handleSubmit} className="submit-resource-form">
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Brief Explanation"
            name="briefExplanation"
            value={formData.briefExplanation}
            onChange={handleInputChange}
            required
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <div className="checkbox-sections">
            <div className="checkbox-section">
              <h3>Topic(s)</h3>
              <FormGroup className="checkbox-group">
                {topics.map((group) => (
                  <FormControlLabel
                    key={group}
                    control={
                      <Checkbox
                        checked={formData.workGroup.includes(group)}
                        onChange={() => handleCheckboxChange("workGroup", group)}
                      />
                    }
                    label={group}
                  />
                ))}
              </FormGroup>
              {formData.workGroup.length === 0 && (
                <p className="error-text">Please select at least one work group.</p>
              )}
            </div>
            <div className="checkbox-section">
              <h3>Audience(s)</h3>
              <FormGroup className="checkbox-group">
                {roles.map((role) => (
                  <FormControlLabel
                    key={role}
                    control={
                      <Checkbox
                        checked={formData.applicableAudience.includes(role)}
                        onChange={() =>
                          handleCheckboxChange("applicableAudience", role)
                        }
                      />
                    }
                    label={role}
                  />
                ))}
              </FormGroup>
              {formData.applicableAudience.length === 0 && (
                <p className="error-text">Please select at least one audience.</p>
              )}
            </div>
            <div className="checkbox-section">
              <h3>Age Group</h3>
              <FormGroup className="checkbox-group">
                {ageGroups.map((age) => (
                  <FormControlLabel
                    key={age}
                    control={
                      <Checkbox
                        checked={formData.ageGroup.includes(age)}
                        onChange={() => handleCheckboxChange("ageGroup", age)}
                      />
                    }
                    label={age}
                  />
                ))}
              </FormGroup>
              {formData.ageGroup.length === 0 && (
                <p className="error-text">Please select at least one age group.</p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
            disabled={!isFormValid}
          >
            Submit Resource
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SubmitResource;