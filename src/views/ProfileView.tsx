import React, { useState, useContext, ChangeEvent, FormEvent } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

interface Profile {
  name: string;
  email: string;
  phone: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

interface AuthState {
  userId: string;
  token: string;
}

const ProfileView: React.FC = () => {
  const { authState } = useContext(AuthContext) as { authState: AuthState };
  const { userId, token } = authState;
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (e: FormEvent) => {
    setIsEditing(false);
    e.preventDefault();
    try {
      let theBody = JSON.stringify(profile);
      // separate the name into first, middle, and last names
      const names = profile.name.split(' ');
      if (names.length === 1) {
        theBody = JSON.stringify({
          ...profile,
          firstName: names[0],
          middleName: '',
          lastName: '',
          mobileNumbers: profile.phone,
        });
      } else if (names.length === 2) {
        theBody = JSON.stringify({
          ...profile,
          firstName: names[0],
          middleName: '',
          lastName: names[1],
          mobileNumbers: profile.phone,
        });
      } else if (names.length === 3) {
        theBody = JSON.stringify({
          ...profile,
          firstName: names[0],
          middleName: names[1],
          lastName: names[2],
          mobileNumbers: profile.phone,
        });
      } else {
        theBody = JSON.stringify({
          ...profile,
          firstName: names[0],
          middleName: names.slice(1, -1).join(' '),
          lastName: names[names.length - 1],
          mobileNumbers: profile.phone,
        });
      }

      // Update the user profile
      const response = await fetch(`http://localhost:9500/api/users/${userId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: theBody,
      });

      if (response.ok) {
        const data: Profile = await response.json();
        console.log('User updated successfully with data of: ', data);

        // Update the user email
        const response2 = await fetch(`http://localhost:9500/api/users/${userId}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: profile.email,
          }),
        });
        if (response2.ok) {
          const data = await response2.json();
          console.log('User updated successfully with data of: ', data);
          setProfile((prevProfile) => ({ ...prevProfile, email: data.email }));
        } else {
          console.error('Failed to update user:', response2.statusText);
        }

        setProfile((prevProfile) => ({ ...prevProfile, ...data }));
      } else {
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    alert('Profile updated successfully!');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <User className="mr-2" size={18} /> Full name
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                profile.name
              )}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Mail className="mr-2" size={18} /> Email address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                profile.email
              )}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Phone className="mr-2" size={18} /> Phone number
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                profile.phone
              )}
            </dd>
          </div>
        </dl>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );

};

export default ProfileView;