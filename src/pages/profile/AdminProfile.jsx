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
        .email("Inavlid Email Address")
        .required("Email is required"),
      password: Yup.string().required("Password required"),
      role: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
      alert(values);
    },
  });
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef(null);
  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "160px",
          height: "160px",
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
            position: "absolute",
            top: 0,
          }}
          alt=""
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
          }}
          bgcolor={"#D9D9D9"}
          width={"100%"}
        >
          <IconButton
            sx={{
              display: "flex",
              marginInline: "auto",
            }}
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
      <Typography textAlign={"center"} fontWeight={600} fontSize={25} mt={3}>
        Blake Johnson
      </Typography>
      <Typography textAlign={"center"}>Admin</Typography>

      <Box
        sx={{
          border: "grey 1px solid",
          padding: 2,
          py: 5,
          borderRadius: "30px",
          marginInline: "150px",
          marginBlock: "30px",
          display: "flex",
          flexDirection: "column",
          gap: 4.5,
        }}
        component={"form"}
        onSubmit={formik.handleSubmit}
      >
        <Box
          display={"flex"}
          flexGrow={1}
          flexWrap={"wrap"}
          alignItems={"center"}
          gap={2}
        >
          <Typography width={"28%"} pl={15}>
            Name
          </Typography>
          <TextField
            sx={{ width: "40%" }}
            size="small"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            slotProps={{
              formHelperText: {
                sx: {
                  position: "absolute",
                  bottom: -25,
                },
              },
            }}
          />
        </Box>
        <Box
          display={"flex"}
          flexGrow={1}
          flexWrap={"wrap"}
          alignItems={"center"}
          gap={2}
        >
          <Typography width={"28%"} pl={15}>
            Email
          </Typography>
          <TextField
            sx={{ width: "40%" }}
            size="small"
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            slotProps={{
              formHelperText: {
                sx: {
                  position: "absolute",
                  bottom: -25,
                },
              },
            }}
          />
        </Box>
        <Box
          display={"flex"}
          flexGrow={1}
          flexWrap={"wrap"}
          alignItems={"center"}
          gap={2}
        >
          <Typography width={"28%"} pl={15}>
            Password
          </Typography>
          <TextField
            sx={{ width: "40%" }}
            size="small"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            slotProps={{
              formHelperText: {
                sx: {
                  position: "absolute",
                  bottom: -25,
                },
              },
              input: {
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </IconButton>
                ),
              },
            }}
          />
          <Button
            color="primary"
            variant="outlined"
            sx={{
              marginLeft: "10px",
            }}
          >
            Change Password
          </Button>
        </Box>
        <Box
          display={"flex"}
          flexGrow={1}
          flexWrap={"wrap"}
          alignItems={"center"}
          gap={2}
        >
          <Typography width={"28%"} pl={15}>
            Role
          </Typography>
          <TextField
            sx={{ width: "40%" }}
            size="small"
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            slotProps={{
              formHelperText: {
                sx: {
                  position: "absolute",
                  bottom: -25,
                },
              },
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{
            width: "max-content",
            marginInline: "auto",
          }}
        >
          Update Details
        </Button>
      </Box>
    </Box>
  );
};

export default AdminProfile;
