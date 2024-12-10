import { commonRequest } from "./commonRequest";

// Login

export const login = (body) => {
  return commonRequest("POST", "api/users/loginAdmin", body);
};

// User

export const getAllUsers = async () => {
  return commonRequest("GET", "api/users/getUsers");
};

export const getUserById = async (id) => {
  return commonRequest("GET", `api/users/getUserDataByUserId/${id}`);
};

export const editUser = async (id, body) => {
  return commonRequest(
    "PUT",
    `api/users/updateUser/${id}`,
    body,
    "multipart/form-data"
  );
};

export const requestOtp = async (body) => {
  return commonRequest("POST", "api/users/userRequestOTP", body);
};

export const verifyOtp = async (body) => {
  return commonRequest("POST", "api/users/userVerifyOTP", body);
};

export const createUser = async (body, id) => {
  return commonRequest(
    "POST",
    `api/users/createUser/${id}`,
    body,
    "multipart/form-data"
  );
};

export const getAllKyc = async () => {
  return commonRequest("GET", "api/users/getAllKYCDetails");
};

export const changeKycStatus = async (id, kycStatus) => {
  return commonRequest("PUT", `api/users/updateKYC/${id}`, { kycStatus });
};

export const getAllBlockedUsers = async () => {
  return commonRequest("GET", "api/users/getAllUserReports");
};

// Admin

export const getAllRoles = async (id) => {
  return commonRequest("GET", "api/users/getRoles");
};

export const createNewUserRole = async (body) => {
  return commonRequest("POST", "api/users/createRole", body);
};

export const getRoleById = async (id) => {
  return commonRequest("GET", `api/users/getRoleDetails/${id}`);
};

export const updateUserRole = async (id, body) => {
  return commonRequest("PUT", `api/users/updateRole/${id}`, body);
};

// Dashboard

export const getDashboardData = async () => {
  return commonRequest("GET", "api/users/getRevenueDetails");
};

// Language

export const createNewLanguage = async (body) => {
  return commonRequest("POST", "api/users/createlanguage", body);
};

export const getAllLanguages = async () => {
  return commonRequest("GET", "api/users/getAllLanguages");
};

export const getLanguageById = async (id) => {
  return commonRequest("GET", `api/users/getLanguageBYId/${id}`);
};

export const deleteSingleLaguage = async (id) => {
  return commonRequest("DELETE", `api/users/deleteLanguageById/${id}`);
};

export const updateLanguage = async (id, body) => {
  return commonRequest("PUT", `api/users/updateLanguageById/${id}`, body);
};

// Leaderboard

export const getLeaderboard = async () => {
  return commonRequest("GET", "api/users/getLeaderBoard");
};

// Notifications

export const getAllNotifications = async () => {
  return commonRequest("GET", "api/users/getAllNotifications");
};

export const getNotificationById = async (id) => {
  return commonRequest("GET", `api/users/getNotificationById/${id}`);
};

export const updateNotification = async (id, body) => {
  return commonRequest("PUT", `api/users/updateNotification/${id}`, body);
};

export const addNewNotification = async (body) => {
  return commonRequest(
    "POST",
    "api/users/addNotification",
    body,
    "multipart/form-data"
  );
};

export const sendPushNotification = async (id) => {
  return commonRequest("POST", "api/users/sendNotification", {
    notificationId: id,
  });
};

// Hosted Users

export const getAllHostedUsers = async () => {
  return commonRequest("GET", "api/users/getHostedUsers");
};

export const updateHostedUserStatus = async (body) => {
  return commonRequest("PUT", "api/users/updateHostedUserStatus", body);
};

// Report / Block

export const getAllReportReasons = async () => {
  return commonRequest("GET", "api/users/getAllReportReasons");
};

export const createNewReportReason = async (body) => {
  return commonRequest("POST", "api/users/createReportReason", body);
};

export const deleteReportReason = async (id) => {
  return commonRequest("DELETE", `api/users/deleteReportReason/${id}`);
};

// Coin

export const getCoinList = async () => {
  return commonRequest("GET", "api/users/getAllCoinPackages");
};

export const createCoinPackage = async (body) => {
  return commonRequest("POST", "api/users/createCoinPackage", body);
};

export const getCoinById = async (id) => {
  return commonRequest("GET", `api/users/getCoinPackageById/${id}`);
};

export const updateCoinPackage = async (id, body) => {
  return commonRequest("PUT", `api/users/updateCoinPackage/${id}`, body);
};

export const getFreeCoinDetails = async () => {
  return commonRequest("GET", "api/users/getFreeCoin");
};

export const updateFreeCoinDetails = async (id, body) => {
  return commonRequest("PUT", `api/users/updateFreeCoin/${id}`, body);
};

export const deleteCoinPackage = async (id) => {
  return commonRequest("DELETE", `api/users/deleteCoinPackage/${id}`);
};

// Conversions

export const getConversionFactors = async () => {
  return commonRequest(
    "GET",
    "api/users/getConversionFactors/67484d6bdb7f5649821fa945"
  );
};

export const conversionsEdit = async (body) => {
  return commonRequest(
    "PUT",
    "api/users/updateConversionFactor/67484d6bdb7f5649821fa945",
    body
  );
};

// Wallpapers

export const createWallpaper = async (body) => {
  return commonRequest(
    "POST",
    "api/users/wallpaper",
    body,
    "multipart/form-data"
  );
};

export const getWallpaperById = async (id) => {
  return commonRequest("GET", `api/users/getWallpaper/${id}`);
};

export const getAllWallpapers = async () => {
  return commonRequest("GET", "api/users/getAllWallpaper");
};

export const deleteWallpaper = async (id) => {
  return commonRequest("DELETE", `api/users/deleteWallpaper/${id}`);
};

// Moods

export const getAllMoods = async () => {
  return commonRequest("GET", "api/users/getAllMood");
};

export const addNewMood = async (body) => {
  return commonRequest(
    "POST",
    "api/users/createMood",
    body,
    "multipart/form-data"
  );
};

// Frames

export const getAllFrames = async () => {
  return commonRequest("GET", "api/users/getAllFrame");
};

export const createNewFrame = async (body) => {
  return commonRequest(
    "POST",
    "api/users/createframe",
    body,
    "multipart/form-data"
  );
};

export const deleteFrame = async (id) => {
  return commonRequest("DELETE", `api/users/deleteFrame/${id}`);
};

// Gifts

export const getAllGifts = async () => {
  return commonRequest("GET", "api/users/getAllGifts");
};

export const createGift = async (body) => {
  return commonRequest(
    "POST",
    "api/users/createGift",
    body,
    "multipart/form-data"
  );
};

export const deleteGift = async (id) => {
  return commonRequest("DELETE", `api/users/deleteGift/${id}`);
};

// CMS

export const getPrivacyPolicies = async () => {
  return commonRequest("GET", "api/users/getPrivacyPolicy");
};

export const createPrivacyPolicy = async (data) => {
  return commonRequest("POST", "api/users/createPrivacyPolicy", data);
};

export const getPolicyById = async (id) => {
  return commonRequest("GET", `api/users/getPrivacyPolicyById/${id}`);
};
