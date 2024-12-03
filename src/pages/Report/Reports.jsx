import React, { useEffect } from "react";
import { BASE_URL } from "../../service/environment";
import axios from "axios";

const Reports = () => {
  const fetchCoinPackages = async () => {
    const response = await axios.get(`${BASE_URL}api/coinPackagePurchases`);
    console.log(response);
  };

  useEffect(() => {
    fetchCoinPackages();
  }, []);

  return <div>Reports</div>;
};

export default Reports;
