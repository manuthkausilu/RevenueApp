export default {
  name: "Biztrack",
  slug: "biztrack",
  scheme: "biztrack", // Add this for Expo Linking to work in production
  extra: {
    mockApi: process.env.EXPO_BASE_API_URL
  }
};