import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Box,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import sha256 from "crypto-js/sha256";
import Reaptcha from "reaptcha";
import { useState } from "react";
import { AdminDataLogin } from "../../interfaces";
import { AdminLoginService } from "../../services";

const AdminLogin: React.FC = () => {
  if (localStorage.getItem("role")) {
    if (
      localStorage.getItem("role") === "admin" &&
      JSON.parse(localStorage.getItem("admin") || "{}").accessToken
    ) {
      window.location.href = "/admin/dashboard";
    }
  }

  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminDataLogin>({
    _id: "",
    id: "",
    email: "",
    role: "admin",
  });
  const [choosenMethod, setChoosenMethod] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);

  const adminLogin = (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    showNotification({
      id: "login-admin",
      loading: true,
      title: "Logging in...",
      message: "Please wait while we log you in to the admin dashboard",
      autoClose: false,
      withCloseButton: false,
    });

    const encryptedPassword = sha256(values.password);

    AdminLoginService.adminLogin(
      values.email.toLowerCase(),
      encryptedPassword.toString()
    )
      .then(async (response) => {
        setAdminData({
          _id: response.data.data._id,
          id: response.data.data.id,
          email: response.data.data.email,
          role: "admin",
        });
        await AdminLoginService.getTOTPByAdminId(response.data.data._id)
          .then((response) => {
            setIsFirstTime(response.data.data.isFirstTime);
            setOtpStep(true);
            updateNotification({
              id: "login-admin",
              color: "teal",
              title: "Logged in successfully",
              message:
                "You have been logged in successfully. Redirecting you to the admin dashboard...",
              icon: <IconCheck />,
              autoClose: 1000,
            });
          })
          .catch(() => {
            updateNotification({
              id: "login-admin",
              color: "red",
              title: "Login failed",
              message:
                "We were unable to log you in. Please check your email and password and try again.",
              icon: <IconAlertTriangle />,
              autoClose: 5000,
            });
            return null;
          });
      })
      .catch(() => {
        updateNotification({
          id: "login-admin",
          color: "red",
          title: "Login failed",
          message:
            "We were unable to log you in. Please check your email and password and try again.",
          icon: <IconAlertTriangle />,
          autoClose: 5000,
        });
      });
  };

  const choose2FAMethod = async (method: string) => {
    showNotification({
      id: "choose-otp-method",
      loading: true,
      title: "Please wait...",
      message: "We are processing your request",
      autoClose: false,
      withCloseButton: false,
    });
    await AdminLoginService.chooseTOTPMethodByAdminId(adminData._id, method)
      .then((response) => {
        if (method === "email") {
          setChoosenMethod("email");
          updateNotification({
            id: "choose-otp-method",
            color: "teal",
            title: "Success",
            message: "We have sent you an OTP to your email",
            icon: <IconCheck />,
            autoClose: 1000,
          });
        } else {
          setChoosenMethod("app");
          setQrCode(response.data.data.qrCode);
          updateNotification({
            id: "choose-otp-method",
            color: "teal",
            title: "Success",
            message: "Please scan the QR code usine your authenticator app",
            icon: <IconCheck />,
            autoClose: 1000,
          });
        }
      })
      .catch(() => {
        updateNotification({
          id: "choose-otp-method",
          color: "red",
          title: "Failed",
          message: "We were unable to process your request",
          icon: <IconAlertTriangle />,
          autoClose: 5000,
        });
      });
  };

  const verifyOTP = async () => {
    showNotification({
      id: "verify-otp",
      loading: true,
      title: "Please wait...",
      message: "We are verifying your OTP",
      autoClose: false,
      withCloseButton: false,
    });
    await AdminLoginService.verifyTOTPByAdminId(adminData, otp)
      .then((response) => {
        if (response.data.data.isTOTPVerified) {
          updateNotification({
            id: "verify-otp",
            color: "teal",
            title: "Success",
            message: "You have been verified successfully",
            icon: <IconCheck />,
            autoClose: 1000,
          });
          const adminDataNew = {
            ...adminData,
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            phone: response.data.data.phone,
            gender: response.data.data.gender,
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
          };
          //add data to local storage
          localStorage.setItem("admin", JSON.stringify(adminDataNew));
          //wait to notification to close and redirect to admin dashboard
          setTimeout(() => {
            //Add role to local storage
            localStorage.setItem("role", "admin");
            window.location.href = "/admin/dashboard";
          }, 1000);
        } else {
          updateNotification({
            id: "verify-otp",
            color: "red",
            title: "Failed",
            message: "We were unable to verify your OTP, please try again",
            icon: <IconAlertTriangle />,
            autoClose: 5000,
          });
        }
      })
      .catch(() => {
        updateNotification({
          id: "verify-otp",
          color: "red",
          title: "Failed",
          message: "We were unable to verify your OTP, please try again",
          icon: <IconAlertTriangle />,
          autoClose: 5000,
        });
      });
  };

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { email: "", password: "", remember: false },

    validate: {
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
    },
  });

  //set the page title
  document.title = "Admin Login - FixACareer";

  return (
    <Container size={420} my={40}>
      {!otpStep && (
        <>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Admin Login
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Enter your credentials to access the Admin Dashboard
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md" w={410}>
            <form onSubmit={form.onSubmit((values) => adminLogin(values))}>
              <TextInput
                label="Email"
                placeholder="you@example.dev"
                required
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                {...form.getInputProps("password")}
              />
              <Group position="apart" mt="md">
                <Checkbox
                  label="Remember me"
                  {...form.getInputProps("remember")}
                />
                <Anchor<"a"> href="/admin/forgot-password" size="sm">
                  Forgot password?
                </Anchor>
              </Group>
              <Box mt="md" mb="md">
                <Reaptcha
                  sitekey="6LdsI54lAAAAAMuwi9HnGSp6Ny0fgqhjGH1I6HP1"
                  onVerify={() => {
                    setCaptchaVerified(true);
                  }}
                  onExpire={() => {
                    setCaptchaVerified(false);
                  }}
                />
              </Box>
              <Button
                fullWidth
                mt="xl"
                type="submit"
                disabled={!captchaVerified}
              >
                Sign in
              </Button>
            </form>
          </Paper>
        </>
      )}
      {otpStep && isFirstTime && choosenMethod === "" && (
        <>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Choose Two Factor Authentication Method
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Choose the method you want to use for two factor authentication.
            This will be used to verify your identity when logging in. You can
            change this method at any time. This is mandatory.
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Button
              fullWidth
              mt="xl"
              onClick={() => {
                choose2FAMethod("app");
              }}
              sx={{ backgroundColor: "#3b5998", color: "white" }}
            >
              Authenticator App - Recommended
            </Button>
            <Button
              fullWidth
              mt="xl"
              onClick={() => {
                choose2FAMethod("email");
              }}
              sx={{ backgroundColor: "#db4437", color: "white" }}
            >
              Email
            </Button>
          </Paper>
        </>
      )}
      {otpStep && isFirstTime && choosenMethod === "app" && (
        <>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Scan the QR Code
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Scan the QR code using your authenticator app to complete the
            process. And then enter the OTP below.
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Image src={qrCode} alt="QR Code" m={"auto"} />
            <TextInput
              label="OTP"
              placeholder="Enter the OTP"
              required
              mt="md"
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              fullWidth
              mt="xl"
              onClick={() => {
                verifyOTP();
              }}
            >
              Verify
            </Button>
          </Paper>
        </>
      )}
      {otpStep &&
        isFirstTime &&
        (choosenMethod === "phone" || choosenMethod === "email") && (
          <>
            <Title
              align="center"
              sx={(theme) => ({
                fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                fontWeight: 900,
              })}
            >
              Enter the OTP
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
              Enter the OTP sent to your {choosenMethod} to complete the
              process.
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
              <TextInput
                label="OTP"
                placeholder="Enter the OTP"
                required
                mt="md"
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                fullWidth
                mt="xl"
                onClick={() => {
                  verifyOTP();
                }}
              >
                Verify
              </Button>
            </Paper>
          </>
        )}
      {otpStep && !isFirstTime && (
        <>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Enter the OTP
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Enter the OTP sent to your previously choosen method to complete
            process.
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="OTP"
              placeholder="Enter the OTP"
              required
              mt="md"
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              fullWidth
              mt="xl"
              onClick={() => {
                verifyOTP();
              }}
            >
              Verify
            </Button>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default AdminLogin;
