import { Box, Grid, Typography } from "@mui/material";
import Coin from "../assets/SmallCoin.svg";
import React from "react";

const TopSellingPackages = ({ transactions }) => {
  const packages = transactions || [];
  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-evenly"}
        height={"100%"}
        p={1}
      >
        {packages?.map((item, ind) => (
          <Grid container>
            <Grid item md={2}>
              1
            </Grid>
            <Grid item md={5}>
              {item.coins} Coins
            </Grid>
            <Grid item md={3}>
              <Box component={"img"} src={Coin} />
            </Grid>

            <Grid item md={2}>
              <Typography>{item.amount} Rs</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    </>
  );
};

export default TopSellingPackages;
