import React, { useState } from 'react';
interface GroupMember {
  id: number;
  name: string;
  role: 'admin' | 'moderator' | 'member';
  online: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  rsvpCount: number;
  maxCapacity: number | null;
}

interface GroupFile {
  id: number;
  name: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
}

const CommunityGroupFeatures: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventMaxCapacity, setEventMaxCapacity] = useState<number | ''>('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [members, setMembers] = useState<GroupMember[]>([
    { id: 1, name: 'Alex Johnson', role: 'admin', online: true },
    { id: 2, name: 'Taylor Smith', role: 'moderator', online: true },
    { id: 3, name: 'Jordan Williams', role: 'member', online: false },
    { id: 4, name: 'Casey Davis', role: 'member', online: true }
  ]);
  const [events, setEvents] = useState<Event[]>([]);
  const [files, setFiles] = useState<GroupFile[]>([]);
  const [historyVisibility, setHistoryVisibility] = useState(false);
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(false);
  const [largeFileSharing, setLargeFileSharing] = useState(false);
  const [autoInvitations, setAutoInvitations] = useState(false);

  const handleAddEvent = () => {
    if (eventTitle && eventDate && eventTime) {
      const newEvent: Event = {
        id: Date.now(),
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
        rsvpCount: 0,
        maxCapacity: eventMaxCapacity ? Number(eventMaxCapacity) : null
      };
      setEvents([...events, newEvent]);
      // Reset form fields
      setEventTitle('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventDescription('');
      setEventMaxCapacity('');
    }
  };

  const handleAddFile = () => {
    if (fileName && fileSize && uploadedBy) {
      const newFile: GroupFile = {
        id: Date.now(),
        name: fileName,
        size: fileSize,
        uploadedBy,
        uploadDate: uploadDate || new Date().toISOString().split('T')[0]
      };
      setFiles([...files, newFile]);
      // Reset form fields
      setFileName('');
      setFileSize('');
      setUploadedBy('');
      setUploadDate('');
    }
  };

  const handleRemoveEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleRemoveFile = (id: number) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleToggleHistoryVisibility = () => setHistoryVisibility(!historyVisibility);
  const handleToggleVoiceChat = () => setVoiceChatEnabled(!voiceChatEnabled);
  const handleToggleLargeFileSharing = () => setLargeFileSharing(!largeFileSharing);
  const handleToggleAutoInvitations = () => setAutoInvitations(!autoInvitations);

  const toggleMemberOnlineStatus = (id: number) => {
    setMembers(members.map(member =>
      member.id === id ? { ...member, online: !member.online } : member
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Community & Group Features</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Group Information</h3>

            <div className="mb-4">
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">Group Description</label>
              <textarea
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Describe your group..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Group Members</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.role === 'admin' ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold' :
                            member.role === 'moderator' ? 'bg-blue-100 text-purple-950 border border-purple-400 font-bold' :
                              'bg-green-100 text-purple-950 border border-purple-400 font-bold'
                        }font-black`}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.online ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-gray-100 text-green-950'
                        }font-black`}>
                          {member.online ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        <button
                          onClick={() => toggleMemberOnlineStatus(member.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            member.online
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-green-200 text-green-700 hover:bg-green-300'
                          }`}
                        >
                          {member.online ? 'Mark Offline' : 'Mark Online'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Event Planning</h3>
            <p className="text-sm text-gray-600 mb-3">Plan events in group chats with RSVPs and +1 options</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  id="eventTitle"
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Event name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  id="eventTime"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  id="eventLocation"
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Where is the event?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="eventMaxCapacity" className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                <input
                  id="eventMaxCapacity"
                  type="number"
                  value={eventMaxCapacity}
                  onChange={(e) => setEventMaxCapacity(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Leave blank for unlimited"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Event details..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleAddEvent}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create Event
            </button>

            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Upcoming Events ({events.length})</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {events.map(event => (
                  <div key={event.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between">
                      <h5 className="font-medium">{event.title}</h5>
                      <button
                        onClick={() => handleRemoveEvent(event.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-slate-700">
                        RSVPs: {event.rsvpCount}{event.maxCapacity ? `/${event.maxCapacity}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">File Sharing (up to 200MB)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
              <input
                id="fileName"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Document.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
              <input
                id="fileSize"
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g., 150MB"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label htmlFor="uploadedBy" className="block text-sm font-medium text-gray-700 mb-1">Uploaded By</label>
              <input
                id="uploadedBy"
                type="text"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                placeholder="Uploader name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label htmlFor="uploadDate" className="block text-sm font-medium text-gray-700 mb-1">Upload Date</label>
              <input
                id="uploadDate"
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            onClick={handleAddFile}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Upload File
          </button>

          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Shared Files ({files.length})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div>
                    <span className="font-medium">{file.name}</span>
                    <p className="text-xs text-slate-700">{file.size} • Uploaded by {file.uploadedBy}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Group Features</h3>

          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="historyVisibility"
                checked={historyVisibility}
                onChange={handleToggleHistoryVisibility}
                className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
              <div className="ml-3">
                <label htmlFor="historyVisibility" className="block text-sm font-medium text-gray-700">
                  History Visibility (Admin Toggle)
                </label>
                <p className="text-xs text-slate-700 mt-1">
                  Allow new members to see previous chat history
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="voiceChat"
                checked={voiceChatEnabled}
                onChange={handleToggleVoiceChat}
                className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
              <div className="ml-3">
                <label htmlFor="voiceChat" className="block text-sm font-medium text-gray-700">
                  Voice Chats (up to 15 people)
                </label>
                <p className="text-xs text-slate-700 mt-1">
                  Low-friction audio hangouts for group discussions
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="largeFileSharing"
                checked={largeFileSharing}
                onChange={handleToggleLargeFileSharing}
                className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
              <div className="ml-3">
                <label htmlFor="largeFileSharing" className="block text-sm font-medium text-gray-700">
                  Large File Sharing (up to 200MB)
                </label>
                <p className="text-xs text-slate-700 mt-1">
                  Share large assets without bloating the platform
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="autoInvitations"
                checked={autoInvitations}
                onChange={handleToggleAutoInvitations}
                className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
              <div className="ml-3">
                <label htmlFor="autoInvitations" className="block text-sm font-medium text-gray-700">
                  Auto-Invitations (Engagement-Based)
                </label>
                <p className="text-xs text-slate-700 mt-1">
                  Invite highly engaged followers automatically
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Live Online Status:</strong> Enabled by default for all members
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Member Tags & Reminders:</strong> Available to admins and moderators
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          aria-label="Save your group settings"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Save Group Settings
        </button>
      </div>
    </div>
  );
};

export default CommunityGroupFeatures;
