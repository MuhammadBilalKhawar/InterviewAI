import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('https://interviewai-zmzj.onrender.com/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setInterests(data.interests || []);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://interviewai-zmzj.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddInterest();
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('❌ File too large. Maximum size is 10MB.');
      setTimeout(() => setMessage(''), 3000);
      e.target.value = '';
      return;
    }

    // Accept PDF, TXT, and Word documents
    const allowedExtensions = ['.pdf', '.txt', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      setMessage('❌ Invalid file type. Please upload PDF, TXT, or Word document.');
      setTimeout(() => setMessage(''), 3000);
      e.target.value = '';
      return;
    }

    setUploading(true);
    setMessage('⏳ Processing your CV...');

    try {
      const formData = new FormData();
      formData.append('cv', file);

      console.log('[Frontend] Uploading CV:', file.name, 'Size:', file.size);

      const token = localStorage.getItem('token');
      const response = await fetch('https://interviewai-zmzj.onrender.com/api/users/profile/upload-cv', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('[Frontend] Response:', data);

      if (response.ok) {
        setUser(data.user);
        setInterests(data.extractedSkills);
        setMessage(`✨ Successfully extracted ${data.count} skills: ${data.extractedSkills.join(', ')}`);
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('❌ ' + (data.message || 'Failed to process CV. Please try again.'));
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (error) {
      console.error('[Frontend] CV upload error:', error);
      setMessage('❌ Error uploading file: ' + error.message);
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950">
        <NavBar mode="app" active="profile" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-amber-500 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950">
      <NavBar mode="app" active="profile" />
      
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-3xl">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-amber-500/20 p-4 sm:p-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-amber-500 mb-6 sm:mb-8">My Profile</h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('success') 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          {/* User Info Section */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-amber-400 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4">
                {user?.avatar && (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-500 flex-shrink-0"
                  />
                )}
                <div className="space-y-2">
                  <div className="text-white text-sm sm:text-lg">
                    <span className="text-amber-500 font-medium">Name:</span> {user?.name}
                  </div>
                  <div className="text-white text-sm sm:text-lg break-all">
                    <span className="text-amber-500 font-medium">Email:</span> {user?.email}
                  </div>
                  <div className="text-white text-sm sm:text-lg">
                    <span className="text-amber-500 font-medium">Role:</span> {user?.role}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interests Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-amber-400 mb-4">My Interests</h2>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              Add your interests to get personalized question recommendations on your dashboard
            </p>

            {/* CV Upload Section */}
            <div className="mb-6 p-4 sm:p-5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📄</span>
                <h3 className="font-semibold text-amber-400 text-sm sm:text-base">Upload Your CV</h3>
              </div>
              <p className="text-gray-400 mb-4 text-xs sm:text-sm">
                Upload your CV (PDF, TXT, or Word) and we'll automatically extract your skills and add them as interests
              </p>
              <label className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleCVUpload}
                  disabled={uploading}
                  className="text-xs sm:text-sm text-gray-400 file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer disabled:opacity-50"
                />
                {uploading && <span className="text-amber-400 text-xs sm:text-sm">Processing CV...</span>}
              </label>
            </div>

            {/* Add Interest Input */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., JavaScript, React, Node.js, MongoDB..."
                className="flex-1 px-3 sm:px-4 py-2 bg-slate-950/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm sm:text-base"
              />
              <button
                onClick={handleAddInterest}
                className="px-4 sm:px-6 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm sm:text-base flex-shrink-0"
              >
                Add
              </button>
            </div>

            {/* Interests List */}
            <div className="flex flex-wrap gap-3 mb-6">
              {interests.length === 0 ? (
                <p className="text-gray-500 italic">No interests added yet</p>
              ) : (
                interests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400"
                  >
                    <span>{interest}</span>
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-red-400 hover:text-red-300 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
