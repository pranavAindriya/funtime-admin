import { Box, Grid, Typography } from "@mui/material";
import Coin from "../assets/SmallCoin.svg";
import React from "react";

const TopSellingPackages = () => {
  return (
    <Box>
      <Grid container>
        <Grid item md={2}>
          1
        </Grid>
        <Grid item md={5}>
          2000 Coins
        </Grid>
        <Grid item md={3}>
          <Box component={"img"} src={Coin} />
        </Grid>

        <Grid item md={2}>
          <Typography>1000rs</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopSellingPackages;
