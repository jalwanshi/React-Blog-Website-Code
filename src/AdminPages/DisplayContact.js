import React, { useState, useEffect } from 'react';
import AdminHeader from '../Component/AdminHeader';
import Firebase from '../Firebase'; // Update Firebase import path
import '../Component/Style.css'; // Importing the CSS file for styling

const DisplayContact = () => {
  const [contactList, setContactList] = useState([]);
  const [showTable, setShowTable] = useState(false); // State variable to control table visibility
  const [userList, setUserList] = useState([]); // State variable to store user list
  const [approvedUsers, setApprovedUsers] = useState([]); // State variable to store approved user list
  const [showUserRequest, setShowUserRequest] = useState(false); // State variable to control user request table visibility
  const [showApprovedUsers, setShowApprovedUsers] = useState(false); // State variable to control approved user table visibility
  const [selectedUser, setSelectedUser] = useState(null); // State variable to store the selected user details
  const [approvedUserIds, setApprovedUserIds] = useState([]); // State variable to store the IDs of approved users

  useEffect(() => {
    // Fetch contact details from Firebase database
    const enquiryRef = Firebase.child('Enquiry');
    enquiryRef.on('value', (snapshot) => {
      const contacts = snapshot.val();
      if (contacts) {
        const contactArray = Object.entries(contacts).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setContactList(contactArray);
      } else {
        setContactList([]);
      }
    });

    return () => {
      enquiryRef.off('value');
    };
  }, []);

  useEffect(() => {
    // Fetch user details from Firebase database
    const usersRef = Firebase.child('users');
    usersRef.on('value', (snapshot) => {
      const users = snapshot.val();
      if (users) {
        const userArray = Object.entries(users).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setUserList(userArray);
      } else {
        setUserList([]);
      }
    });

    return () => {
      usersRef.off('value');
    };
  }, []);

  useEffect(() => {
    // Fetch approved user details from Firebase database
    const approvedUsersRef = Firebase.child('ApprovedUsers');
    approvedUsersRef.on('value', (snapshot) => {
      const users = snapshot.val();
      if (users) {
        const userArray = Object.entries(users).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setApprovedUsers(userArray);
        // Update approved user IDs
        const approvedIds = userArray.map(user => user.id);
        setApprovedUserIds(approvedIds);
      } else {
        setApprovedUsers([]);
        setApprovedUserIds([]);
      }
    });

    return () => {
      approvedUsersRef.off('value');
    };
  }, []);

  const sendEmail = (email) => {
    // Logic to send email to the contact's email address
    window.location.href = `mailto:${email}`;
  };

  const deleteContact = (id) => {
    // Remove contact details from Firebase database
    const contactRef = Firebase.child(`Enquiry/${id}`);
    contactRef.remove()
      .then(() => {
        console.log('Contact deleted successfully.');
      })
      .catch(error => {
        console.error('Error deleting contact:', error);
      });
  };

  const approveRequest = (id, user) => {
    // Add user details to the "ApprovedUsers" key in Firebase
    const approvedUsersRef = Firebase.child(`ApprovedUsers/${id}`);
    approvedUsersRef.set(user)
      .then(() => {
        console.log('User request approved:', id);
        // Update the user status in the "users" key
        const updatedUser = { ...user, status: 'approved' };
        const usersRef = Firebase.child(`users/${id}`);
        usersRef.update(updatedUser)
          .then(() => {
            console.log('User status updated in "users" key:', id);
            // Update the user status in the local userList without removing it
            setUserList(prevList => prevList.map(u => u.id === id ? updatedUser : u));
          })
          .catch(error => {
            console.error('Error updating user status in "users" key:', error);
          });
      })
      .catch(error => {
        console.error('Error approving user:', error);
      });
  };

  const deleteApprovedUser = (id) => {
    // Remove user from the ApprovedUsers list
    const approvedUserRef = Firebase.child(`ApprovedUsers/${id}`);
    approvedUserRef.remove()
      .then(() => {
        console.log('User deleted from ApprovedUsers successfully.');
        // Update approved users list after deletion
        setApprovedUsers(prevList => prevList.filter(user => user.id !== id));
        // Update approved user IDs
        setApprovedUserIds(prevIds => prevIds.filter(userId => userId !== id));
        // Update the user status in the "users" key
        const usersRef = Firebase.child(`users/${id}`);
        usersRef.update({ status: null })
          .then(() => {
            console.log('User status removed in "users" key:', id);
          })
          .catch(error => {
            console.error('Error removing user status in "users" key:', error);
          });
      })
      .catch(error => {
        console.error('Error deleting user from ApprovedUsers:', error);
      });
  };

  const denyRequest = (id) => {
    // Remove user details from Firebase database and user list
    const userRef = Firebase.child(`users/${id}`);
    userRef.remove()
      .then(() => {
        console.log('User denied and deleted successfully.');
        // Update user list after deletion
        setUserList(prevList => prevList.filter(user => user.id !== id));
        setSelectedUser(null); // Reset selected user details
      })
      .catch(error => {
        console.error('Error denying user:', error);
      });
  };

  const showUserDetails = (user) => {
    setSelectedUser(user); // Set the selected user details
  };

  const hideUserDetails = () => {
    setSelectedUser(null); // Reset the selected user details
  };

  const toggleTable = () => {
    setShowTable(prevState => !prevState); // Toggle contact table visibility
    setShowUserRequest(false); // Hide user request table
    setShowApprovedUsers(false); // Hide approved user table
  };

  const toggleUserRequest = () => {
    setShowUserRequest(prevState => !prevState); // Toggle user request table visibility
    setShowTable(false); // Hide contact table
    setShowApprovedUsers(false); // Hide approved user table
  };

  const toggleApprovedUsers = () => {
    setShowApprovedUsers(prevState => !prevState); // Toggle approved user table visibility
    setShowTable(false); // Hide contact table
    setShowUserRequest(false); // Hide user request table
  };

  return (
    <div>
      <AdminHeader />
      <h2></h2>
      <button id='Toggel' onClick={toggleTable}>{showTable ? 'Hide Enquiry' : 'Show Enquiry'}</button>
      <button id='Toggel' onClick={toggleUserRequest}>{showUserRequest ? 'Hide User Request' : 'Show User Request'}</button>
      <button id='Toggel' onClick={toggleApprovedUsers}>{showApprovedUsers ? 'Hide Approved Users' : 'Show Approved Users'}</button>

      {showTable && (
        <>
          <h3>Contact Enquiry</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contactList.map(contact => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.message}</td>
                  <td>
                    <button className="send-email" onClick={() => sendEmail(contact.email)}>Send Email</button>
                    <button className="reject" onClick={() => deleteContact(contact.id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showUserRequest && (
        <>
          <h3>User Request Table</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userList.map(user => (
                <tr key={user.id}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
                  <td>
                    {approvedUserIds.includes(user.id) ? (
                      <button className="approve approved">Approved</button>
                    ) : (
                      <button className="approve" onClick={() => approveRequest(user.id, user)}>Approve</button>
                    )}
                    <button className="deny" onClick={() => denyRequest(user.id)}>Deny</button>
                    {selectedUser === user ? (
                      <button id='Toggell' className="hide-details" onClick={hideUserDetails}>Hide Details</button>
                    ) : (
                      <button id='Toggell' className="view-details" onClick={() => showUserDetails(user)}>View Details</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showApprovedUsers && (
        <>
          <h3>Approved Users Table</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedUsers.map(user => (
                <tr key={user.id}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
                  <td>
                    <button className="delete" onClick={() => deleteApprovedUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Display selected user details */}
      {selectedUser && (
        <div className="user-details">
          <h3>User Details</h3>
          <table>
            <tbody>
              <tr>
                <td><strong>Full Name:</strong></td>
                <td>{`${selectedUser.firstName} ${selectedUser.lastName}`}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{selectedUser.email}</td>
              </tr>
              <tr>
                <td><strong>Password:</strong></td>
                <td>{selectedUser.password}</td>
              </tr>
              <tr>
                <td><strong>Address:</strong></td>
                <td>{`${selectedUser.address}, ${selectedUser.city}, ${selectedUser.zip}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayContact;
