import React, { useState } from "react";
import { ArrowLeft, Settings, Shield, Server, Bell, Save, Check, Loader2, FileText, Briefcase, DollarSign, Key, Trash2 } from "lucide-react";

// --- TYPE DEFINITIONS ---

// Define the shape of the settings state
interface SettingsState {
    // Security 
    force2FA: boolean;
    sessionTimeoutMinutes: number;
    ipRateLimitingEnabled: boolean;
    passwordStrengthPolicy: 'Simple' | 'Moderate' | 'Strong';
    automatedContentFlagging: boolean;
    maxLoginAttempts: number;
    
    // Platform Operations
    registrationStatus: 'Open' | 'Invite-Only' | 'Closed';
    defaultCommissionRate: number; // Percentage
    maintenanceMode: boolean;
    maxCourseFileUploadMB: number;
    maxActiveCoursesPerUser: number;
    defaultCurrencySymbol: 'USD' | 'EUR' | 'INR' | 'GBP';

    // Data & API Control (NEW)
    automatedDataPurgeEnabled: boolean;
    dataPurgeInactivityMonths: number;
    gdprCcpaComplianceMode: boolean;
    webhookFailureThreshold: number;

    // Email & Notifications
    sendWeeklyReport: boolean;
    adminEmailAddress: string;
    
    // Content & Branding / Legal
    topBannerEnabled: boolean;
    topBannerMessage: string;
    aboutUsContent: string;
    termsAndConditionsContent: string;
    privacyPolicyContent: string;
}

// Define the type for the current active tab
type CurrentTab = 'Security' | 'Platform' | 'Notifications' | 'Content & Branding' | 'Legal Documents' | 'Data & API Control';

// Define the common props structure for all setting panels
interface SettingPanelProps {
    settings: SettingsState;
    updateSetting: (key: keyof SettingsState, value: any) => void;
}


// --- DUMMY DATA / INITIAL STATE ---
const initialSettings: SettingsState = {
    // Security
    force2FA: true,
    sessionTimeoutMinutes: 60,
    ipRateLimitingEnabled: false,
    passwordStrengthPolicy: 'Moderate',
    automatedContentFlagging: true,
    maxLoginAttempts: 5,

    // Platform Operations
    registrationStatus: 'Open',
    defaultCommissionRate: 20,
    maintenanceMode: false,
    maxCourseFileUploadMB: 2048,
    maxActiveCoursesPerUser: 50,
    defaultCurrencySymbol: 'USD',
    
    // Data & API Control (NEW)
    automatedDataPurgeEnabled: false,
    dataPurgeInactivityMonths: 24, // 2 years default
    gdprCcpaComplianceMode: true,
    webhookFailureThreshold: 5,
    
    // Email & Notifications
    sendWeeklyReport: true,
    adminEmailAddress: 'admin@platform.com',
    
    // Content & Branding / Legal
    topBannerEnabled: false,
    topBannerMessage: 'System undergoing planned maintenance on Saturday from 2:00 AM to 5:00 AM UTC. Expect brief service interruptions.',
    aboutUsContent: 'Our platform is dedicated to providing high-quality, specialized education resources and tools for professionals worldwide. We believe in continuous learning and innovation. Founded in 2024, our mission has been to bridge the gap between theoretical knowledge and practical application, empowering thousands of users globally. Our team is composed of industry veterans and academic experts dedicated to delivering the best possible learning experience and support to our community.',
    termsAndConditionsContent: 'I. Acceptance of Terms\nThis document governs your use of our service and outlines the rules and regulations that must be adhered to by all users. By accessing this platform, you agree to these terms and conditions in full. If you disagree with any part of these terms, do not use our platform. We reserve the right to modify these terms at any time by posting updated versions on this page.\n\nII. User Conduct\nUsers are prohibited from engaging in illegal or harmful activities, including but not limited to, unauthorized access, data misuse, harassment, intellectual property infringement, and spamming. Violation of these terms will result in immediate termination of your account and potential legal action. You are responsible for maintaining the confidentiality of your account password.\n\nIII. Intellectual Property\nAll content, logos, features, and source code are the proprietary property of the platform owner and protected by international copyright and trademark laws. Unauthorized reproduction, redistribution, or modification of any material is strictly forbidden and may result in legal action. You are granted a non-exclusive, non-transferable, limited license only for the purposes of viewing the material contained on this platform as intended by the service provider.',
    privacyPolicyContent: 'I. Data Collection\nWe value your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard the information you provide to us. We collect data necessary for platform operation, including registration details (name, email, organization) and usage data (pages viewed, time spent, device information, and IP address).\n\nII. Data Usage and Sharing\nYour data is used solely to provide, maintain, and improve our services, process transactions, and communicate with you about your account. We may share aggregated, non-personally identifiable information with third parties for marketing or research purposes. We do not sell your personal data to third parties. Data is only shared with trusted partners when required to provide services (e.g., payment processors).\n\nIII. Data Security and Retention\nWe implement industry-standard security measures, including strong encryption (SSL/TLS) and secure servers, to maintain the safety of your personal information. However, no electronic storage is 100% secure. We retain your personal data only for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.',
};

// --- Custom Components ---

/**
 * Reusable toggle switch component
 */
const ToggleSwitch: React.FC<{ label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }> = ({
    label,
    description,
    checked,
    onChange
}) => (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
        <div className="flex flex-col">
            <span className="text-base font-medium text-gray-900">{label}</span>
            <span className="text-sm text-gray-500 max-w-lg mt-0.5">{description}</span>
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? 'bg-purple-600' : 'bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
            role="switch"
            aria-checked={checked}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    </div>
);

/**
 * Security Settings Panel
 */
const SecuritySettings: React.FC<SettingPanelProps> = ({ settings, updateSetting }) => (
    <div className="space-y-6">
        
        {/* Force 2FA (Existing) */}
        <ToggleSwitch
            label="Force Two-Factor Authentication (2FA)"
            description="Require all users (Superadmin, Subadmin, Instructor) to set up 2FA for enhanced security on login."
            checked={settings.force2FA}
            onChange={(v) => updateSetting('force2FA', v)}
        />
        
        {/* Password Strength Policy (NEW) */}
        <div className="py-4 border-b">
            <label htmlFor="password-policy" className="text-base font-medium text-gray-900 block mb-1">
                Password Strength Policy
            </label>
            <p className="text-sm text-gray-500 mb-3">
                Sets the minimum complexity requirements for all user passwords upon creation or reset.
            </p>
            <select
                id="password-policy"
                value={settings.passwordStrengthPolicy}
                onChange={(e) => updateSetting('passwordStrengthPolicy', e.target.value as 'Simple' | 'Moderate' | 'Strong')}
                className="w-full max-w-xs pl-4 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500 appearance-none text-sm font-medium"
            >
                <option value="Simple">Simple (Min 6 characters)</option>
                <option value="Moderate">Moderate (Min 8 chars, mixed case, 1 number)</option>
                <option value="Strong">Strong (Min 12 chars, mixed case, 1 number, 1 symbol)</option>
            </select>
        </div>

        {/* Admin Session Timeout (Existing) */}
        <div className="py-4 border-b">
            <label htmlFor="session-timeout" className="text-base font-medium text-gray-900 block mb-1">
                Admin Session Timeout (Minutes)
            </label>
            <p className="text-sm text-gray-500 mb-3">
                Automatically log out Superadmin/Subadmin accounts after this period of inactivity.
            </p>
            <div className="relative w-full max-w-xs">
                <input
                    id="session-timeout"
                    type="number"
                    min="15"
                    max="180"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => updateSetting('sessionTimeoutMinutes', parseInt(e.target.value) || 0)}
                    className="w-full pr-14 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <span className="absolute right-0 top-0 bottom-0 px-3 py-2 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-lg">
                    Minutes
                </span>
            </div>
        </div>
        
        {/* Max Login Attempts (NEW) */}
        <div className="py-4 border-b">
            <label htmlFor="login-attempts" className="text-base font-medium text-gray-900 block mb-1">
                Max Login Attempts Before Lockout
            </label>
            <p className="text-sm text-gray-500 mb-3">
                The number of failed login attempts allowed from an account before a temporary lockout is enforced.
            </p>
            <div className="relative w-full max-w-xs">
                <input
                    id="login-attempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value) || 0)}
                    className="w-full pr-14 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <span className="absolute right-0 top-0 bottom-0 px-3 py-2 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-lg">
                    Attempts
                </span>
            </div>
        </div>

        {/* Automated Content Flagging (NEW) */}
        <ToggleSwitch
            label="Automated Content Flagging"
            description="Enable automated machine learning models to scan and flag user-submitted content (e.g., course descriptions, forum posts) for policy violations."
            checked={settings.automatedContentFlagging}
            onChange={(v) => updateSetting('automatedContentFlagging', v)}
        />
        
        {/* IP Rate Limiting (Existing) */}
        <ToggleSwitch
            label="Enable IP Rate Limiting"
            description="Limit the number of requests from a single IP address to prevent brute force attacks and scraping."
            checked={settings.ipRateLimitingEnabled}
            onChange={(v) => updateSetting('ipRateLimitingEnabled', v)}
        />
    </div>
);

/**
 * Platform Operations Panel
 */
const PlatformSettings: React.FC<SettingPanelProps> = ({ settings, updateSetting }) => (
    <div className="space-y-6">
        
        {/* Registration Status (Existing) */}
        <div className="py-4 border-b">
            <label htmlFor="registration-status" className="text-base font-medium text-gray-900 block mb-1">
                Platform Registration Status
            </label>
            <p className="text-sm text-gray-500 mb-3">
                Control how new users can sign up for the platform.
            </p>
            <select
                id="registration-status"
                value={settings.registrationStatus}
                onChange={(e) => updateSetting('registrationStatus', e.target.value as 'Open' | 'Invite-Only' | 'Closed')}
                className="w-full max-w-xs pl-4 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500 appearance-none text-sm font-medium"
            >
                <option value="Open">Open (Anyone can register)</option>
                <option value="Invite-Only">Invite-Only (Requires Admin invitation)</option>
                <option value="Closed">Closed (No new registrations allowed)</option>
            </select>
        </div>
        
        {/* Default Currency Symbol (NEW) */}
        <div className="py-4 border-b">
            <label htmlFor="currency-symbol" className="text-base font-medium text-gray-900 block mb-1">
                Default Platform Currency
            </label>
            <p className="text-sm text-gray-500 mb-3">
                The primary currency symbol used for all displayed prices and financial reports.
            </p>
            <div className="relative w-full max-w-xs">
                <select
                    id="currency-symbol"
                    value={settings.defaultCurrencySymbol}
                    onChange={(e) => updateSetting('defaultCurrencySymbol', e.target.value as 'USD' | 'EUR' | 'INR' | 'GBP')}
                    className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500 appearance-none text-sm font-medium"
                >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                </select>
                <DollarSign size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
        </div>

        {/* Default Commission Rate (Existing) */}
        <div className="py-4 border-b">
            <label htmlFor="commission-rate" className="text-base font-medium text-gray-900 block mb-1">
                Default Instructor Commission Rate
            </label>
            <p className="text-sm text-gray-500 mb-3">
                The standard percentage of course revenue the platform keeps (e.g., 20 for 20%). This applies to new contracts.
            </p>
            <div className="relative w-full max-w-xs">
                <input
                    id="commission-rate"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.defaultCommissionRate}
                    onChange={(e) => updateSetting('defaultCommissionRate', parseInt(e.target.value) || 0)}
                    className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <span className="absolute right-0 top-0 bottom-0 px-3 py-2 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-lg">%</span>
            </div>
        </div>

        {/* Max Course File Upload Size (NEW) */}
        <div className="py-4 border-b">
            <label htmlFor="max-upload-size" className="text-base font-medium text-gray-900 block mb-1">
                Max Course File Upload Size
            </label>
            <p className="text-sm text-gray-500 mb-3">
                The maximum size allowed for a single video or document file uploaded by an instructor (in Megabytes).
            </p>
            <div className="relative w-full max-w-xs">
                <input
                    id="max-upload-size"
                    type="number"
                    min="100"
                    max="10240" // Max 10GB
                    step="100"
                    value={settings.maxCourseFileUploadMB}
                    onChange={(e) => updateSetting('maxCourseFileUploadMB', parseInt(e.target.value) || 0)}
                    className="w-full pr-12 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <span className="absolute right-0 top-0 bottom-0 px-3 py-2 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-lg">MB</span>
            </div>
        </div>
        
        {/* Maximum Active Courses per User (NEW) */}
        <div className="py-4 border-b">
            <label htmlFor="max-active-courses" className="text-base font-medium text-gray-900 block mb-1">
                Maximum Active Courses per Instructor
            </label>
            <p className="text-sm text-gray-500 mb-3">
                Limit the total number of courses an individual instructor can have published simultaneously. Set to 0 for unlimited.
            </p>
            <div className="relative w-full max-w-xs">
                <input
                    id="max-active-courses"
                    type="number"
                    min="0"
                    max="500"
                    value={settings.maxActiveCoursesPerUser}
                    onChange={(e) => updateSetting('maxActiveCoursesPerUser', parseInt(e.target.value) || 0)}
                    className="w-full pr-14 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <span className="absolute right-0 top-0 bottom-0 px-3 py-2 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-lg">
                    Courses
                </span>
            </div>
        </div>


        {/* Activate Maintenance Mode (Existing) */}
        <ToggleSwitch
            label="Activate Maintenance Mode"
            description="Immediately take the site offline for all non-admin users. Use for major system upgrades or fixes."
            checked={settings.maintenanceMode}
            onChange={(v) => updateSetting('maintenanceMode', v)}
        />
    </div>
);

/**
 * Data & API Control Panel (NEW)
 */
const DataAndApiControlSettings: React.FC<SettingPanelProps> = ({ settings, updateSetting }) => {
    const [mockMessage, setMockMessage] = useState<string | null>(null);
    
    const handleApiKeyManagement = () => {
        // Mock a navigation or modal open
        console.log("Navigating to API Key Management sub-page...");
        setMockMessage("🔑 Navigating to secure API Key Management interface...");
        setTimeout(() => setMockMessage(null), 3000);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">API and System Integration</h3>
            
            {/* API Key Management */}
            <div className="py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex flex-col mb-3 sm:mb-0">
                    <span className="text-base font-medium text-gray-900 flex items-center gap-2">
                        <Key size={18} className="text-blue-500" /> API Key Management
                    </span>
                    <span className="text-sm text-gray-500 max-w-lg mt-0.5">
                        Create, manage, and revoke platform-level API keys for external integrations and services.
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <button
                        onClick={handleApiKeyManagement}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Manage Keys
                    </button>
                    {mockMessage && (
                        <span className="text-xs text-blue-600 mt-2">{mockMessage}</span>
                    )}
                </div>
            </div>

            {/* Webhook Failure Threshold */}
            {/* <div className="py-4 border-b">
                <label htmlFor="webhook-threshold" className="text-base font-medium text-gray-900 block mb-1">
                    Webhook Failure Threshold
                </label>
                <p className="text-sm text-gray-500 mb-3">
                    Set the number of consecutive failed delivery attempts before a system webhook is automatically disabled.
                </p>
                <div className="relative w-full max-w-xs">
                    <input
                        id="webhook-threshold"
                        type="number"
                        min="1"
                        max="10"
                        value={settings.webhookFailureThreshold}
                        onChange={(e) => updateSetting('webhookFailureThreshold', parseInt(e.target.value) || 0)}
                        className="w-full pr-14 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                    <span className="absolute right-0 top-0 bottom-0 px-3 py-2 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-lg">
                        Fails
                    </span>
                </div>
            </div> */}

            {/* <h3 className="text-xl font-semibold text-gray-800 pt-4">Data Management and Compliance</h3>

            {/* GDPR/CCPA Compliance Mode */}
            {/* <ToggleSwitch
                label="GDPR/CCPA Compliance Mode"
                description="Globally enables stricter consent requirements, cookie policies, and right-to-be-forgotten protocols for European and Californian users."
                checked={settings.gdprCcpaComplianceMode}
                onChange={(v) => updateSetting('gdprCcpaComplianceMode', v)}
            /> */}

            {/* Automated Data Purge */}
            {/* <ToggleSwitch
                label="Enable Automated Inactive Data Purge"
                description="Automatically delete non-essential data and anonymize user accounts inactive for the specified period."
                checked={settings.automatedDataPurgeEnabled}
                onChange={(v) => updateSetting('automatedDataPurgeEnabled', v)}
            /> */}

            {settings.automatedDataPurgeEnabled && (
                <div className="py-4 pl-8 border-l-4 border-red-500 bg-red-50 rounded-lg p-4 mt-4">
                    <label htmlFor="purge-months" className="text-base font-medium text-red-700 block mb-1 flex items-center gap-2">
                        <Trash2 size={18} /> Data Purge Inactivity Period
                    </label>
                    <p className="text-sm text-red-500 mb-3">
                        Define the number of months an account must be inactive before data purging is triggered (This action is irreversible).
                    </p>
                    <div className="relative w-full max-w-xs">
                        <input
                            id="purge-months"
                            type="number"
                            min="12"
                            max="60"
                            value={settings.dataPurgeInactivityMonths}
                            onChange={(e) => updateSetting('dataPurgeInactivityMonths', parseInt(e.target.value) || 0)}
                            className="w-full pr-14 py-2 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                        />
                        <span className="absolute right-0 top-0 bottom-0 px-3 py-2 text-sm text-red-500 bg-red-100 border-l border-red-300 rounded-r-lg">
                            Months
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};


/**
 * Email & Notifications Panel (Unchanged)
 */
const NotificationSettings: React.FC<SettingPanelProps> = ({ settings, updateSetting }) => (
    <div className="space-y-6">
        <ToggleSwitch
            label="Send Weekly System Health Report"
            description="Automatically generate and send a summary report of platform performance and key metrics every Monday."
            checked={settings.sendWeeklyReport}
            onChange={(v) => updateSetting('sendWeeklyReport', v)}
        />
        
        <div className="py-4 border-b">
            <label htmlFor="admin-email" className="text-base font-medium text-gray-900 block mb-1">
                Primary Superadmin Contact Email
            </label>
            <p className="text-sm text-gray-500 mb-3">
                The official email address for all system-critical alerts and internal reports.
            </p>
            <input
                id="admin-email"
                type="email"
                value={settings.adminEmailAddress}
                onChange={(e) => updateSetting('adminEmailAddress', e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
        </div>
    </div>
);

/**
 * Content & Branding Settings Panel (Unchanged)
 */
const ContentAndBrandingSettings: React.FC<SettingPanelProps> = ({ settings, updateSetting }) => {
    // Mock local state for the uploaded logo URL for visualization
    const [mockLogoUrl, setMockLogoUrl] = useState<string>("https://placehold.co/100x40/5b21b6/ffffff?text=System+Logo");

    // Mock banner state to show a list of potential banners
    const [mockBanners, setMockBanners] = useState([
        { id: 1, message: settings.topBannerMessage, isActive: settings.topBannerEnabled, priority: 'High' },
        { id: 2, message: 'New security patch applied successfully on all servers.', isActive: false, priority: 'Low' },
    ]);

    const handleMockLogoUpload = (): void => {
        // Toggles between two mock logos to demonstrate change
        setMockLogoUrl(prevUrl => 
            prevUrl.includes('System') 
                ? "https://placehold.co/120x45/f97316/ffffff?text=NEW+BRAND"
                : "https://placehold.co/100x40/5b21b6/ffffff?text=System+Logo"
        );
    };
    
    // Simulate updating the active banner text back to the main state
    const handleBannerUpdate = (id: number, field: keyof typeof mockBanners[0], value: any): void => {
        const newBanners = mockBanners.map(b => b.id === id ? { ...b, [field]: value } : b);
        
        // Logic to ensure only one banner is active and updates main state
        if (field === 'isActive' && value === true) {
            newBanners.forEach(b => {
                if (b.id !== id) b.isActive = false;
            });
            updateSetting('topBannerMessage', newBanners.find(b => b.id === id)?.message || '');
            updateSetting('topBannerEnabled', true);
        } else if (field === 'isActive' && value === false) {
             updateSetting('topBannerEnabled', newBanners.some(b => b.isActive));
        }
        
        if (newBanners.find(b => b.id === id)?.isActive && field === 'message') {
             updateSetting('topBannerMessage', value);
        }

        setMockBanners(newBanners);
    };


    return (
        <div className="space-y-8">
            
            {/* Logo Change */}
            <div className="pt-4 pb-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Branding: System Logo</h3>
                <label htmlFor="logo-url" className="text-base font-medium text-gray-900 block mb-2">
                    Current Live Logo Preview
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-gray-50">
                    <img
                        src={mockLogoUrl}
                        alt="Current System Logo"
                        className="h-10 w-auto object-contain rounded-lg border p-1 bg-white shadow-sm"
                    />
                    <span className="text-sm font-medium text-gray-600 truncate flex-1">
                        {mockLogoUrl.split('?text=')[1].replace('+', ' ').replace('NEW BRAND', 'new_brand_logo.png')}
                    </span>
                    <button 
                        type="button" 
                        onClick={handleMockLogoUpload}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
                    >
                        Upload New Logo
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Recommended dimensions: 150x50px. Max file size: 500KB. Click 'Upload New Logo' to see a mock change.</p>
            </div>


            {/* Top Banner Settings (Enhanced List View) */}
            <div className="pb-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">System Banner Announcements Management</h3>
                <p className="text-sm text-gray-500 mb-4">Manage and activate critical status messages that appear at the top of the application for all users. Only one banner can be active at a time.</p>
                
                <div className="space-y-3 max-w-4xl">
                    {mockBanners.map((banner) => (
                        <div key={banner.id} className={`p-4 border rounded-lg bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm transition-all ${banner.isActive ? 'border-purple-400 ring-1 ring-purple-300' : 'border-gray-200'}`}>
                            <div className="flex-1 mr-4 w-full">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {banner.isActive ? 'LIVE' : 'INACTIVE'}
                                    </span>
                                    <span className={`text-xs font-semibold ${banner.priority === 'High' ? 'text-red-600' : 'text-blue-600'}`}>
                                        {banner.priority} Priority
                                    </span>
                                </div>
                                <textarea
                                    value={banner.message}
                                    onChange={(e) => handleBannerUpdate(banner.id, 'message', e.target.value)}
                                    rows={1}
                                    className="w-full text-sm font-medium text-gray-800 border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2 resize-none"
                                />
                            </div>
                            <div className="flex items-center justify-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 mt-3 sm:mt-0">
                                <ToggleSwitch
                                    label=""
                                    description="Active"
                                    checked={banner.isActive}
                                    onChange={(v) => handleBannerUpdate(banner.id, 'isActive', v)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                <button type="button" className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors shadow-sm">
                    + Add New Banner Message
                </button>
            </div>

            {/* About Us */}
            <div className="space-y-6 pt-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Marketing Content: About Us</h3>
                <div>
                    <label htmlFor="about-us" className="text-base font-medium text-gray-900 block mb-1">
                        About Us Page Content
                    </label>
                    <p className="text-sm text-gray-500 mb-2">
                        This content is displayed on the public "About Us" page. Supports basic Markdown formatting.
                    </p>
                    <textarea
                        id="about-us"
                        value={settings.aboutUsContent}
                        onChange={(e) => updateSetting('aboutUsContent', e.target.value)}
                        rows={5}
                        className="w-full max-w-3xl px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                </div>
            </div>

        </div>
    );
};

/**
 * Legal Documents Settings Panel (Unchanged)
 */
const LegalDocumentsSettings: React.FC<SettingPanelProps> = ({ settings, updateSetting }) => (
    <div className="space-y-8">
        {/* Terms and Conditions */}
        <div>
            <label htmlFor="terms-conditions" className="text-base font-medium text-gray-900 block mb-1">
                Terms & Conditions Document Text
            </label>
            <p className="text-sm text-gray-500 mb-2">
                The full, legally binding text of the platform's user agreement. This content should be meticulously reviewed before publishing.
            </p>
            <textarea
                id="terms-conditions"
                value={settings.termsAndConditionsContent}
                onChange={(e) => updateSetting('termsAndConditionsContent', e.target.value)}
                rows={15} // Increased rows for long document view
                // *** Full width applied here ***
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm font-mono"
            />
        </div>

        {/* Privacy Policy */}
        <div>
            <label htmlFor="privacy-policy" className="text-base font-medium text-gray-900 block mb-1">
                Privacy Policy Document Text
            </label>
            <p className="text-sm text-gray-500 mb-2">
                The comprehensive policy detailing how user data is collected, used, and protected.
            </p>
            <textarea
                id="privacy-policy"
                value={settings.privacyPolicyContent}
                onChange={(e) => updateSetting('privacyPolicyContent', e.target.value)}
                rows={15} // Increased rows for long document view
                // *** Full width applied here ***
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm font-mono"
            />
        </div>
    </div>
);


// --- MAIN COMPONENT ---

export default function SystemSettingsPage() {
    const [settings, setSettings] = useState<SettingsState>(initialSettings);
    const [currentTab, setCurrentTab] = useState<CurrentTab>('Data & API Control'); // Set default to the new tab
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

    // Mock the navigation function
    const mockNavigateBack = (): void => {
        console.log("Mock Navigation: Attempted to go back.");
    };

    const updateSetting = (key: keyof SettingsState, value: any): void => {
        setSettings(prev => ({ ...prev, [key]: value }));
        // Reset success state on change
        setSaveSuccess(false); 
    };

    const handleSave = (): void => {
        setIsSaving(true);
        setSaveSuccess(false);

        // --- Mock API Save Delay ---
        setTimeout(() => {
            console.log("Settings Saved:", settings);
            setIsSaving(false);
            setSaveSuccess(true);
            
            // Clear success message after a few seconds
            setTimeout(() => setSaveSuccess(false), 3000); 
        }, 1500);
    };

    const tabConfigs = [
        { name: 'Security', icon: Shield, component: SecuritySettings },
        { name: 'Platform', icon: DollarSign, component: PlatformSettings }, // Icon changed to DollarSign for financial/ops focus
        { name: 'Data & API Control', icon: Server, component: DataAndApiControlSettings }, // NEW TAB
        { name: 'Notifications', icon: Bell, component: NotificationSettings },
        { name: 'Content & Branding', icon: FileText, component: ContentAndBrandingSettings },
        { name: 'Legal Documents', icon: Briefcase, component: LegalDocumentsSettings },
    ];

    const CurrentComponent = tabConfigs.find(t => t.name === currentTab)?.component;

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 mb-3 sm:mb-0">
                    <Settings size={28} className="text-purple-600" /> System Settings
                </h1>
                <button
                    onClick={mockNavigateBack}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
                
                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto whitespace-nowrap" aria-label="Tabs">
                        {tabConfigs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setCurrentTab(tab.name as CurrentTab)}
                                className={`
                                    ${currentTab === tab.name
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                                `}
                            >
                                <tab.icon 
                                    size={20} 
                                    className={`-ml-0.5 mr-2 h-5 w-5 transition-colors duration-150 
                                        ${currentTab === tab.name ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}
                                    `}
                                />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="py-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentTab} Configuration</h2>
                    {CurrentComponent && (
                        <CurrentComponent 
                            settings={settings} 
                            updateSetting={updateSetting} 
                        />
                    )}
                </div>

                {/* Save Button & Status */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
                    
                    {saveSuccess && (
                        <div className="flex items-center text-sm font-medium text-green-700 bg-green-100 px-4 py-2 rounded-lg transition-opacity duration-300">
                            <Check size={16} className="mr-2" /> Settings saved successfully!
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`inline-flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg shadow-md transition-colors duration-200
                            ${isSaving
                                ? 'bg-purple-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
