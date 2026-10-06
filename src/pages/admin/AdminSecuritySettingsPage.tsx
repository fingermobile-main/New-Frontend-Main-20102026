import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import adminOperationsService from '../../services/adminOperationsService';

interface SecuritySetting {
  id: string;
  name: string;
  value: string;
  description?: string;
  type: 'text' | 'number' | 'boolean';
}

const AdminSecuritySettingsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [settings, setSettings] = useState<SecuritySetting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSecuritySettings = async () => {
    try {
      setLoading(true);
      const allSettings = await adminOperationsService.getSettings();
      const secSettings = allSettings.filter((s: any) => s.config_group === 'security');

      const mapped: SecuritySetting[] = secSettings.map((s: any) => {
        let val = s.config_value;
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        } else {
          val = String(val);
        }

        let type: 'text' | 'number' | 'boolean' = 'text';
        if (val === 'true' || val === 'false') {
          type = 'boolean';
        } else if (!isNaN(Number(val)) && val.trim() !== '') {
          type = 'number';
        }

        return {
          id: s.config_key,
          name: s.config_key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          value: val,
          description: s.description || '',
          type
        };
      });

      setSettings(mapped);
    } catch (err) {
      setError('Failed to fetch security settings.');
      console.error('Error fetching security settings:', err);
      showToast('Failed to fetch security settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const handleSettingChange = (id: string, newValue: string) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, value: newValue } : setting,
      ),
    );
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      for (const setting of settings) {
        let parsedVal: any = setting.value;
        if (setting.type === 'boolean') {
          parsedVal = setting.value === 'true';
        } else if (setting.type === 'number') {
          parsedVal = Number(setting.value);
        } else {
          try {
            parsedVal = JSON.parse(setting.value);
          } catch {
            parsedVal = setting.value;
          }
        }
        await adminOperationsService.updateSetting(
          setting.id,
          parsedVal,
          'security',
          setting.description
        );
      }
      showToast('Security settings saved successfully!', 'success');
    } catch (err) {
      setError('Failed to save security settings.');
      console.error('Error saving security settings:', err);
      showToast('Failed to save security settings', 'error');
    } finally {
      setSaving(false);
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
              {setting.type === 'boolean' ? (
                <input
                  type="checkbox"
                  id={setting.id}
                  checked={setting.value === 'true'}
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
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSecuritySettingsPage;
