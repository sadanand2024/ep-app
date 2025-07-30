import AsyncStorage from "@react-native-async-storage/async-storage";

class LocationService {
  constructor() {
    this.officeLocation = {
      latitude: 17.4169, // Default to NYC - replace with actual office coordinates
      longitude: 78.3836,
      radius: 100 // meters
    };
    this.locationSubscription = null;
  }

  // Request location permissions
  async requestPermissions() {
    try {
      console.log("Location permissions - using mock data");
      return true;
    } catch (error) {
      console.error("Error requesting location permissions:", error);
      throw error;
    }
  }

  // Check if location permissions are granted
  async checkPermissions() {
    try {
      console.log("Location permissions check - using mock data");
      return true;
    } catch (error) {
      console.error("Error checking location permissions:", error);
      return false;
    }
  }

  // Get current location
  async getCurrentLocation() {
    try {
      // Check permissions first
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        throw new Error(
          "Location permission not granted. Please enable location permissions in settings."
        );
      }
      console.log("Getting current location - using mock data");
      return {
        latitude: this.officeLocation.latitude,
        longitude: this.officeLocation.longitude,
        accuracy: 10,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Error getting current location:", error);
      throw error;
    }
  }

  // Check if user is within office geofence
  async isWithinOfficeGeofence() {
    try {
      const currentLocation = await this.getCurrentLocation();
      const distance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        this.officeLocation.latitude,
        this.officeLocation.longitude
      );

      return {
        isWithin: distance <= this.officeLocation.radius,
        distance: distance,
        currentLocation: currentLocation,
        officeLocation: this.officeLocation
      };
    } catch (error) {
      console.error("Error checking geofence:", error);
      throw error;
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Set office location (should be called from admin settings)
  async setOfficeLocation(latitude, longitude, radius = 100) {
    this.officeLocation = { latitude, longitude, radius };
    await AsyncStorage.setItem(
      "officeLocation",
      JSON.stringify(this.officeLocation)
    );
  }

  // Load office location from storage
  async loadOfficeLocation() {
    try {
      const stored = await AsyncStorage.getItem("officeLocation");
      if (stored) {
        this.officeLocation = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading office location:", error);
    }
  }

  // Start location monitoring for geofencing
  async startLocationMonitoring(callback) {
    try {
      await this.requestPermissions();

      console.log("Location monitoring - using mock data");
    } catch (error) {
      console.error("Error starting location monitoring:", error);
      throw error;
    }
  }

  // Stop location monitoring
  stopLocationMonitoring() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  // Get address from coordinates
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      console.log("Address lookup - using mock data");
      return {
        street: "Mock Street",
        city: "Mock City",
        region: "Mock Region",
        country: "Mock Country",
        postalCode: "12345",
        fullAddress: "Mock Address - Location service using mock data"
      };
    } catch (error) {
      console.error("Error getting address:", error);
      return null;
    }
  }

  // Verify attendance location with detailed info
  async verifyAttendanceLocation() {
    try {
      const geofenceResult = await this.isWithinOfficeGeofence();
      const address = await this.getAddressFromCoordinates(
        geofenceResult.currentLocation.latitude,
        geofenceResult.currentLocation.longitude
      );

      return {
        ...geofenceResult,
        address,
        timestamp: new Date().toISOString(),
        verificationStatus: geofenceResult.isWithin ? "APPROVED" : "REJECTED"
      };
    } catch (error) {
      console.error("Error verifying attendance location:", error);

      // Return a mock result for demo purposes if location fails
      if (error.message.includes("permission")) {
        throw error; // Re-throw permission errors
      }

      // For other errors, return a mock approved result
      return {
        isWithin: true,
        distance: 0,
        currentLocation: {
          latitude: this.officeLocation.latitude,
          longitude: this.officeLocation.longitude,
          accuracy: 10,
          timestamp: Date.now()
        },
        officeLocation: this.officeLocation,
        address: {
          street: "Mock Street",
          city: "Mock City",
          region: "Mock Region",
          country: "Mock Country",
          postalCode: "12345",
          fullAddress: "Mock Address for Demo"
        },
        timestamp: new Date().toISOString(),
        verificationStatus: "APPROVED",
        isMockData: true
      };
    }
  }
}

export default new LocationService();
