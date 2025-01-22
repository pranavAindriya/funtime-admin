import { commonRequest } from "./commonRequest";

// Login

export const login = (body) => {
  return commonRequest("POST", "api/users/loginAdmin", body);
};

// Settings

export const getSettings = () => {
  return commonRequest("GET", "api/users/getSetting");
};

export const updateSettings = (data) => {
  return commonRequest("PUT", "api/users/settingUpdate", data);
};

export const getVersionById = (id) => {
  return commonRequest("GET", `api/users/getVersionById/${id}`);
};

export const updateVersion = (id, data) => {
  return commonRequest("PUT", `api/users/updateVersion/${id}`, data);
};

// User

export const getAllUsers = async (pageOrSearch, limit = 10) => {
  let url;

  if (typeof pageOrSearch === "string") {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(pageOrSearch);

    if (isObjectId) {
      url = `api/users/getUsersTest?userId=${pageOrSearch}`;
    } else {
      url = `api/users/getUsersTest?username=${pageOrSearch}`;
    }
  } else {
    url = `api/users/getUsersTest?page=${pageOrSearch}&limit=${limit}`;
  }

  return commonRequest("GET", url);
};

export const getUserById = async (id) => {
  return commonRequest("GET", `api/users/getUserDataByUserId/${id}`);
};

export const getProfileDataById = async (id) => {
  return commonRequest("GET", `api/users/getProfile/${id}`);
};

export const getCallHistory = async (id, page, limit = 10) => {
  return commonRequest(
    "GET",
    `api/users/callHistory/${id}?page=${page}&limit=${limit}`
  );
};

export const getTransactionHistory = async (id, page, limit = 10) => {
  return commonRequest(
    "GET",
    `api/users/getTransactionHistory/${id}?page=${page}&limit=${limit}`
  );
};

export const editUser = async (id, body) => {
  return commonRequest(
    "PUT",
    `api/users/updateUser/${id}`,
    body,
    "multipart/form-data"
  );
};

export const blockUser = async (userId, blockedUserId, blockFlag) => {
  return commonRequest("POST", "api/users/adminBlockUser", {
    userId,
    blockedUserId,
    blockFlag,
  });
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

export const getAllKyc = async (queryString) => {
  return commonRequest("GET", `api/users/getAllKYCDetails?${queryString}`);
};

export const getKycById = async (id) => {
  return commonRequest("GET", `api/users/getKYCDetailsByUserId/${id}`);
};

export const changeKycStatus = async (id, kycStatus) => {
  return commonRequest("PUT", `api/users/updateKYC/${id}`, { kycStatus });
};

export const getAllBlockedUsers = async () => {
  return commonRequest("GET", "api/users/getAllUserReports");
};

// Withdrawal

export const getWithdrawalHistory = async (queryParams) => {
  return commonRequest("GET", `api/users/getAllWithdrawHistory?${queryParams}`);
};

export const changeWithdrawalStatus = async (id, status) => {
  return commonRequest("PUT", `api/users/updateWithdrawStatus/${id}`, {
    status,
  });
};

export const exportWitrhdrawalData = async (
  status,
  startDate = "",
  endDate = ""
) => {
  let url = `api/users/exportWithdrawals?status=${status}`;
  if (startDate && endDate) {
    url += `&fromDate=${startDate}&toDate=${endDate}`;
  }
  return commonRequest("GET", url);
};

// Calls

export const getRecentCalls = async (
  page,
  limit = 10,
  fromDate = "",
  toDate = ""
) => {
  let url = `api/users/CallTransactionHistory?page=${page}&limit=${limit}`;
  if (fromDate) {
    url += `&fromDate=${fromDate}`;
  }
  if (toDate) {
    url += `&toDate=${toDate}`;
  }
  return commonRequest("GET", url);
};

// Admin

export const getAllRoles = async () => {
  return commonRequest("GET", "api/users/getRoles");
};

export const getAllAdmins = async () => {
  return commonRequest("GET", "api/users/getAllAdmins");
};

export const getAdminById = async (id) => {
  return commonRequest("GET", `api/users/getAdminById/${id}`);
};

export const updateAdmin = async (id, body) => {
  return commonRequest("PUT", `api/users/updateSubAdmin/${id}`, body);
};

export const deleteAdmin = async (id) => {
  return commonRequest("DELETE", `api/users/deleteAdmin/${id}`);
};

export const createNewUserRole = async (body) => {
  return commonRequest("POST", "api/users/createRole", body);
};

export const createNewAdmin = async (body) => {
  return commonRequest("POST", "api/users/registerSubAdmin", body);
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
  return commonRequest("GET", "api/users/getAllLanguagesUserCount");
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

export const getAllHostedUsers = async (queryString) => {
  return commonRequest("GET", `api/users/getHostedUsers?${queryString}`);
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

export const getConversionFactors = async (id) => {
  return commonRequest("GET", `api/users/getConversionFactors/${id}`);
};

export const conversionsEdit = async (body, id) => {
  return commonRequest("PUT", `api/users/updateConversionFactor/${id}`, body);
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
