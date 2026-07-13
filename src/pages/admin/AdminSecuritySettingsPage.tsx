import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

interface SecuritySetting {
  id: string;
  name: string;
  value: string;
  description: string;
  type: "text" | "number" | "boolean";
}

const AdminSecuritySettingsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [settings, setSettings] = React.useState<SecuritySetting[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const { getToken } = useAuth();

  React.useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        const token = getToken();
        // Simulate API call
        // const response = await axios.get("/api/admin/security-settings", { ... });
        // setSettings(response.data);
        setSettings([]); // Placeholder
      } catch (err) {
        setError("Failed to fetch security settings.");
        console.error("Error fetching security settings:", err);
        showToast("Failed to fetch security settings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSecuritySettings();
  }, [getToken, showToast]);

  const handleSettingChange = (id: string, newValue: string) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, value: newValue } : setting,
      ),
    );
  };

  const saveSettings = async () => {
    try {
      const token = getToken();
      // Simulate API call
      // await axios.post("/api/admin/security-settings", { settings }, { ... });
      showToast("Security settings saved successfully!", "success");
    } catch (err) {
      setError("Failed to save security settings.");
      console.error("Error saving security settings:", err);
      showToast("Failed to save security settings", "error");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading security settings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Security Settings
      </h1>
      {settings.length === 0 ? (
        <p className="text-gray-600">No security settings to display.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          {settings.map((setting) => (
            <div key={setting.id} className="mb-4">
              <label
                htmlFor={setting.id}
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {setting.name}
              </label>
              {setting.type === "boolean" ? (
                <input
                  type="checkbox"
                  id={setting.id}
                  checked={setting.value === "true"}
                  onChange={(e) =>
                    handleSettingChange(setting.id, e.target.checked.toString())
                  }
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              ) : (
                <input
                  type={setting.type}
                  id={setting.id}
                  value={setting.value}
                  onChange={(e) =>
                    handleSettingChange(setting.id, e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              )}
              <p className="text-gray-600 text-xs mt-1">
                {setting.description}
              </p>
            </div>
          ))}
          <button
            onClick={saveSettings}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSecuritySettingsPage;
