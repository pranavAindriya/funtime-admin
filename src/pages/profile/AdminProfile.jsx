import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { Camera, Eye, EyeSlash } from "@phosphor-icons/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useRef, useState } from "react";

const AdminProfile = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid Email Address")
        .required("Email is required"),
      password: Yup.string().required("Password required"),
      role: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
      alert(JSON.stringify(values, null, 2));
    },
  });

  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Profile Image Section */}
      <Box
        sx={{
          position: "relative",
          width: { xs: 120, md: 160 },
          height: { xs: 120, md: 160 },
          borderRadius: "50%",
          overflow: "hidden",
          marginInline: "auto",
        }}
      >
        <img
          src={
            image
              ? URL.createObjectURL(image)
              : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
          }
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="Profile"
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            bgcolor: "#D9D9D9",
            width: "100%",
          }}
        >
          <IconButton
            sx={{ display: "flex", marginInline: "auto" }}
            size="small"
            onClick={() => inputRef.current.click()}
          >
            <Camera weight="fill" />
          </IconButton>
        </Box>
      </Box>
      <input
        style={{ display: "none" }}
        type="file"
        ref={inputRef}
        onChange={(e) => setImage(e.target.files[0])}
      />

      {/* Profile Info */}
      <Typography
        textAlign="center"
        fontWeight={600}
        fontSize={{ xs: 22, md: 25 }}
        mt={3}
      >
        Blake Johnson
      </Typography>
      <Typography textAlign="center">Admin</Typography>

      {/* Form Section */}
      <Box
        sx={{
          border: "1px solid grey",
          borderRadius: "30px",
          p: { xs: 3, md: 4 },
          py: { xs: 3, md: 10 },
          my: 4,
          mx: { xs: 0, md: 8, lg: 15 },
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        {/* Name Field */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              width: { md: "28%" },
              pl: { md: 8 },
              fontSize: { xs: 14, md: 16 },
            }}
          >
            Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ maxWidth: { md: "40%" } }}
            FormHelperTextProps={{ sx: { position: "absolute", bottom: -28 } }}
          />
        </Box>

        {/* Email Field */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              width: { md: "28%" },
              pl: { md: 8 },
              fontSize: { xs: 14, md: 16 },
            }}
          >
            Email
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ maxWidth: { md: "40%" } }}
            FormHelperTextProps={{ sx: { position: "absolute", bottom: -28 } }}
          />
        </Box>

        {/* Password Field */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              width: { md: "28%" },
              pl: { md: 8 },
              fontSize: { xs: 14, md: 16 },
            }}
          >
            Password
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: { md: "40%" },
              position: "relative",
            }}
          >
            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              FormHelperTextProps={{
                sx: { position: "absolute", bottom: -28 },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ p: 0.5 }}
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Button
            color="primary"
            variant="outlined"
            sx={{
              width: { xs: "100%", md: "auto" },
              mt: { xs: 2, md: 0 },
              ml: { md: 2 },
            }}
          >
            Change Password
          </Button>
        </Box>

        {/* Role Field */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              width: { md: "28%" },
              pl: { md: 8 },
              fontSize: { xs: 14, md: 16 },
            }}
          >
            Role
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            sx={{ maxWidth: { md: "40%" } }}
            FormHelperTextProps={{ sx: { position: "absolute", bottom: -28 } }}
          />
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          sx={{
            width: { xs: "100%", md: "max-content" },
            mx: "auto",
            mt: 2,
          }}
        >
          Update Details
        </Button>
      </Box>
    </Box>
  );
};

export default AdminProfile;
