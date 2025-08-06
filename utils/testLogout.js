import { handleApiLogout } from './logoutHandler';

// Test function to manually trigger logout (for testing purposes)
export const testLogout = async () => {
    console.log('🧪 Testing logout functionality...');
    try {
        await handleApiLogout();
        console.log('✅ Logout test completed successfully');
        return true;
    } catch (error) {
        console.error('❌ Logout test failed:', error);
        return false;
    }
};

// You can call this function from anywhere to test the logout flow
// Example: import { testLogout } from './utils/testLogout';
// Then call: testLogout(); 