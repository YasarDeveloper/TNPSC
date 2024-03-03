import React, { useState, useEffect } from 'react';
import "../styles/StudentStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import StudentForm from './StudentForm';
import { getInitialData, deleteData, updateData } from '../services/StudentService.js';
import AuthForm from './AuthForm';
import axios from 'axios';

Modal.setAppElement("#root");


const StudentList = () => {
    const [initialData, setInitialData] = useState([]);
    const [data, setData] = useState(initialData);
    const [editableRow, setEditableRow] = useState(null);
    const [isFormVisible, setFormVisible] = useState(false);
    const [isEditForm, setIsEditForm] = useState(true);
    const [selectdIndex, setselectdIndex] = useState(-1);
    const [isAuthFormVisible, setAuthFormVisible] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        getInitialData(userId)
            .then(data => {
                setInitialData(data);
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleEdit = (index) => {
        setEditableRow(index);
    };

    const handleAuthSuccess = (userId) => {
        setAuthFormVisible(false);
        setUserId(userId)
        console.log("----------------------------", userId)
        getInitialData(userId)
            .then(data => {
                setInitialData(data);
                setData(data);
            })
        // Additional actions post-auth, like hiding login/register option
    };

    const handleDelete = async (index, recordId) => {
        // Display confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete this record?");

        // Check if the user confirmed the deletion
        if (isConfirmed) {
            try {
                await deleteData(recordId);
                const updatedData = [...data];
                updatedData.splice(index, 1);
                setData(updatedData);
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
        // If the user did not confirm, do nothing
    };


    const handleSave = async (index) => {
        try {
            const updatedData = data[index];
            const dataToSend = { ...updatedData, userId: userId };
            await updateData(dataToSend)
            setEditableRow(null);
            setInitialData(data);
            setData(data);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };



    const handleAdd = (index, id) => {
        if (id != null) {
            setIsEditForm(true)
            setselectdIndex(index)
        }
        else { setIsEditForm(false) };
        setFormVisible(true);
    };

    const closeForm = () => {
        setFormVisible(false);
    };

    const saveFormData = async (formData) => {
        try {
            const dataToSend = { ...formData, userId: userId };
            const response = await axios.post('http://localhost:3001/api/saveFormData', dataToSend);
            console.log(response.data);

            axios.get(`http://localhost:3001/api/getInitialData/${userId}`)
                .then(response => {
                    console.log(response.data)
                    setInitialData(response.data);
                    setData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            closeForm();
        } catch (error) {
            console.error('Error sending data to the server:', error);
        }
    };

    return (
        <div>
            {userId === null && <p onClick={() => setAuthFormVisible(true)}>Login/Register</p>}
            <Modal
                isOpen={isAuthFormVisible}
                onRequestClose={() => setAuthFormVisible(false)}
                contentLabel="Auth Form"
                style={{
                    overlay: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                    content: {
                        position: 'relative',
                        margin: 'auto',
                        width: '30%',
                        maxHeight: '80%', // You can adjust the maximum height as needed
                        overflow: 'auto',
                    },
                }}
            >
                <AuthForm onClose={() => setAuthFormVisible(false)} onAuthSuccess={(userId) => handleAuthSuccess(userId)} />

            </Modal>
            <h1>Student List</h1>
            <p className="add" onClick={() => handleAdd()}>
                Add
            </p>
            <Modal
                isOpen={isFormVisible}
                onRequestClose={closeForm}
                contentLabel="Add Form"
                style={{
                    overlay: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                    content: {
                        position: 'relative',
                        margin: 'auto',
                        width: 'fit-content',
                        maxHeight: '80%', // You can adjust the maximum height as needed
                        overflow: 'auto',
                    },
                }}
            >
                <StudentForm closeForm={closeForm} saveFormData={saveFormData} isEditForm={isEditForm} data={data[selectdIndex]} />
            </Modal>

            <table>
                <thead>
                    <tr>
                        <th>View</th>
                        <th>Edit</th>
                        <th>Del</th>
                        <th>Student Name</th>
                        <th>Age</th>
                        <th>Created User Name</th>
                        <th>Updated User Name</th>
                        <th>Subject 1</th>
                        <th>Mark 1</th>
                        <th>Subject 2</th>
                        <th>Mark 2</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <FontAwesomeIcon icon={faTable} onClick={() => handleAdd(index, item.id)} />
                            </td>
                            <td>
                                <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit(index)} />
                            </td>
                            <td>
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(index, item.id)} />
                            </td>
                            {editableRow === index ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="StudentName"
                                            value={data[index].StudentName}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].StudentName = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="Age"
                                            value={data[index].Age}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].Age = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>{item.CreatedUserName}</td>
                                    <td>{item.UpdatedUserName}</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="Subject1"
                                            value={data[index].Subject1}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].Subject1 = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="Mark1"
                                            value={data[index].Mark1}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].Mark1 = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            name="Mark2"
                                            value={data[index].Mark2}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].Mark2 = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleSave(index)}>Save</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{item.StudentName}</td>
                                    <td>{item.Age}</td>
                                    <td>{item.CreatedUserName}</td>
                                    <td>{item.UpdatedUserName}</td>
                                    <td>{item.Subject1}</td>
                                    <td>{item.Mark1}</td>
                                    <td>{item.Subject2}</td>
                                    <td>{item.Mark2}</td>
                                    <td></td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



export default StudentList;