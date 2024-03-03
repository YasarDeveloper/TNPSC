import React, { useState } from 'react';

function StudentForm({ closeForm, saveFormData, isEditForm, data }) {
    const [formData, setFormData] = useState({
        StudentName: "",
        Age: 0,
        Subject1: "",
        Mark1: "",
        Subject: "",
        Mark2: "",
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        // Check if all fields are filled
        if (!formData.StudentName) {
            formIsValid = false;
            errors["StudentName"] = "Student Name is required.";
        }
        if (!formData.Subject1) {
            formIsValid = false;
            errors["Subject1"] = "Subject 1 is required.";
        }
        if (!formData.Mark1) {
            formIsValid = false;
            errors["Mark1"] = "Mark 1 is required.";
        }
        if (!formData.Subject) {
            formIsValid = false;
            errors["Subject"] = "Subject 2 is required.";
        }
        if (!formData.Mark2) {
            formIsValid = false;
            errors["Mark2"] = "Mark 2 is required.";
        }

        // Validate Age, Mark1, and Mark2 to be integers not exceeding 100
        ['Age', 'Mark1', 'Mark2'].forEach(field => {
            if (formData[field]) {
                const value = parseInt(formData[field], 10);
                if (isNaN(value) || value < 0 || value > 100) {
                    formIsValid = false;
                    errors[field] = `${field} must be an integer between 0 and 100.`;
                }
            }
        });

        setErrors(errors);
        return formIsValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (validateForm()) {
            saveFormData(formData);
        }
    };

    return (
        <div className="form-container">
            <h2>Add Form</h2>
            <form>
                <label>Student Name:</label>
                <input type="text" name="StudentName" disabled={isEditForm} value={isEditForm ? data.StudentName : formData.StudentName} onChange={handleInputChange} />
                {errors.StudentName && <div style={{ color: "red" }}>{errors.StudentName}</div>}

                <label>Age:</label>
                <input type="number" name="Age" disabled={isEditForm} value={isEditForm ? data.Age : formData.Age} onChange={handleInputChange} />
                {errors.Age && <div style={{ color: "red" }}>{errors.Age}</div>}

                <label>Subject 1:</label>
                <input type="text" name="Subject1" disabled={isEditForm} value={isEditForm ? data.Subject1 : formData.Subject1} onChange={handleInputChange} />
                {errors.Subject1 && <div style={{ color: "red" }}>{errors.Subject1}</div>}

                <label>Mark 1:</label>
                <input type="text" name="Mark1" disabled={isEditForm} value={isEditForm ? data.Mark1 : formData.Mark1} onChange={handleInputChange} />
                {errors.Mark1 && <div style={{ color: "red" }}>{errors.Mark1}</div>}

                <label>Subject 2:</label>
                <input type="text" name="Subject" disabled={isEditForm} value={isEditForm ? data.Subject2 : formData.Subject} onChange={handleInputChange} />
                {errors.Subject && <div style={{ color: "red" }}>{errors.Subject}</div>}

                <label>Mark 2:</label>
                <input type="text" name="Mark2" disabled={isEditForm} value={isEditForm ? data.Mark2 : formData.Mark2} onChange={handleInputChange} />
                {errors.Mark2 && <div style={{ color: "red" }}>{errors.Mark2}</div>}

                {!isEditForm && (
                    <button type="button" onClick={handleSave}>Save</button>
                )}
                <button type="button" onClick={closeForm}>Cancel</button>
            </form>
        </div>
    );
}

export default StudentForm;
