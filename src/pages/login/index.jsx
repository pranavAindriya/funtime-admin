import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Container,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../../service/allApi";
import { setLogin } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      handleLogin(values);
    },
  });

  const dispatch = useDispatch();

  const handleLogin = async (loginData) => {
    const response = await login(loginData);
    if (response.status === 200) {
      dispatch(setLogin(response?.data));
    } else {
      console.error("Login failed:", response.message);
    }
    console.log(response);
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100dvw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(https://i.postimg.cc/3JhjMShB/image-88.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        padding: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              flex: 1,
              position: "relative",
            }}
          >
            <img
              style={{
                width: "90%",
              }}
              src="https://i.postimg.cc/Kj20HmQ7/OBJECTS.png"
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: 500, lg: 400 },
              marginInline: "auto",
              bgcolor: "white",
              borderRadius: "24px",
              p: 4,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Fun Time
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Admin Login
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  slotProps={{
                    input: {
                      style: {
                        borderRadius: "30px",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  slotProps={{
                    input: {
                      style: {
                        borderRadius: "30px",
                      },
                    },
                  }}
                />

                <Box sx={{ textAlign: "right" }}>
                  <Link
                    href="#"
                    color="#E94057"
                    underline="hover"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    backgroundColor: "#E94057",
                    borderRadius: "30px",
                    paddingBlock: "10px",
                  }}
                >
                  Login
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
