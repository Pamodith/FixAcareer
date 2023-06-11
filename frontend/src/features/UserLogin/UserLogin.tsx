import {
  Paper,
  Title,
  PasswordInput,
  Checkbox,
  Button,
  TextInput,
  createStyles,
  Center,
  Grid,
  Image,
  Group,
  Stack,
  Anchor,
  Text,
  Select,
  Switch,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import IMAGE from "../../assets/career-path.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../services";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import sha256 from "crypto-js/sha256";

//create a Custom style class
const useStyles = createStyles((theme) => ({
  form: {
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[3]
    }`,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

const educationLevels = [
  { value: "grade 6-9", label: "Grade 6 - 9" },
  { value: "ordinaryLevel", label: "Ordinary Level" },
  { value: "advancedLevel", label: "Advanced Level" },
  { value: "certificate", label: "Certificate" },
  { value: "diploma", label: "Diploma" },
  { value: "HigherDiploma", label: "Higher Diploma" },
  { value: "bachelor", label: "Bachelor" },
  { value: "masters", label: "Masters" },
];

const UserLogin: React.FC = () => {
  const navigate = useNavigate();

  if (localStorage.getItem("role")) {
    if (
      localStorage.getItem("role") === "user" &&
      JSON.parse(localStorage.getItem("user") || "{}").accessToken
    ) {
      navigate("/user");
    }
  }
  //set the page title
  document.title = "Log in to FixAcareer | FixAcareer";
  const { classes } = useStyles();
  const [isRegstering, setIsRegistering] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);

  //from Structure
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validate: {
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid Email",
    },
  });

  const userLogin = (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    notifications.show({
      id: "login-user",
      loading: true,
      title: "Logging in...",
      message: "Please wait while we log you in to the user dashboard",
      autoClose: false,
      withCloseButton: false,
    });
    const encryptedPassword = sha256(values.password);
    UserService.userLogin(
      values.email.toLowerCase(),
      encryptedPassword.toString()
    )
      .then(async (response) => {
        notifications.update({
          id: "login-user",
          color: "teal",
          title: "Logged in successfully",
          message:
            "You have been logged in successfully. Redirecting you to the user dashboard...",
          icon: <IconCheck />,
          autoClose: 1000,
        });
        const user = response.data.data;
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => {
          localStorage.setItem("role", "user");
          navigate("/user");
        }, 1000);
      })
      .catch(() => {
        notifications.update({
          id: "login-user",
          color: "red",
          title: "Login failed",
          message:
            "We were unable to log you in. Please check your email and password and try again.",
          icon: <IconAlertTriangle />,
          autoClose: 5000,
        });
      });
  };

  const registerForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      educationLevel: "",
      isEmployed: false,
      currentJobTitle: "",
      stillStudying: false,
      studyLevel: "",
      fieldOfStudy: "",
    },
    validate: {
      firstName: (value) =>
        value.length > 0 ? null : "First Name is required",
      lastName: (value) => (value.length > 0 ? null : "Last Name is required"),
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid Email",
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
          ? null
          : "Password must be include at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
      educationLevel: (value) =>
        value.length > 0 ? null : "Education Level is required",
    },
  });

  const registerUser = (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    educationLevel: string;
    isEmployed: boolean;
    currentJobTitle: string;
    stillStudying: boolean;
    studyLevel: string;
    fieldOfStudy: string;
  }) => {
    notifications.show({
      id: "register-user",
      loading: true,
      title: "Registering...",
      message: "Please wait while we register you to the user dashboard",
      autoClose: false,
      withCloseButton: false,
    });
    values.password = sha256(values.password).toString();
    const user = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email.toLowerCase(),
      password: values.password,
      educationLevel: values.educationLevel,
      isEmployed: values.isEmployed,
      currentJobTitle: values.currentJobTitle,
      stillStudying: values.stillStudying,
      studyLevel: values.studyLevel,
      fieldOfStudy: values.fieldOfStudy,
    };
    UserService.userRegister(user)
      .then(async () => {
        setRegisterStep(1);
        setIsRegistering(false);
        registerForm.reset();
        notifications.update({
          id: "register-user",
          color: "teal",
          title: "Registered successfully",
          message:
            "You have been registered successfully. Please Login to continue.",
          icon: <IconCheck />,
          autoClose: 1000,
        });
      })
      .catch(() => {
        notifications.update({
          id: "register-user",
          color: "red",
          title: "Registration failed",
          message:
            "We were unable to register you. Please check your details and try again.",
          icon: <IconAlertTriangle />,
          autoClose: 5000,
        });
      });
  };

  return (
    <>
      <Center
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper
          shadow={"lg"}
          sx={{
            width: 900,
            height: 600,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          withBorder
        >
          <Grid
            grow
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid.Col md={6} lg={3}>
              <Image src={IMAGE} width={400} height={300} p={20} />
            </Grid.Col>
            <Grid.Col md={6} lg={3}>
              {!isRegstering && (
                <Paper className={classes.form} p={20}>
                  <Title pt={"lg"} align="center" className={classes.title}>
                    Welcome Back to FixAcareer!
                  </Title>

                  {/* Form */}
                  <Paper p={30}>
                    {/* FORM STRUCTURE */}
                    <form
                      onSubmit={form.onSubmit((values) => {
                        console.log(values);
                      })}
                    >
                      <Stack mt={5}>
                        <TextInput
                          label="Email"
                          placeholder="you@email.com"
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
                        <Group position="apart" mt="lg">
                          <Checkbox
                            label="Remember me"
                            sx={{ lineHeight: 1 }}
                            {...form.getInputProps("remember")}
                          />
                          <Anchor<"a">
                            onClick={(event) => event.preventDefault()}
                            href="#"
                            size="sm"
                          >
                            Forgot password?
                          </Anchor>
                        </Group>
                      </Stack>
                      <Button
                        type="submit"
                        fullWidth
                        mt={40}
                        mb={10}
                        onClick={() => {
                          userLogin(form.values);
                        }}
                      >
                        Sign in
                      </Button>
                    </form>
                    <Text align="center" mt={10}>
                      Don't have an account?{" "}
                      <Anchor<"a">
                        onClick={(event) => {
                          event.preventDefault();
                          setIsRegistering(true);
                        }}
                        href="#"
                        size="sm"
                      >
                        Register Now!
                      </Anchor>
                    </Text>
                  </Paper>
                </Paper>
              )}
              {isRegstering && registerStep === 1 && (
                <Paper className={classes.form} p={20}>
                  <Title pt={"lg"} align="center" className={classes.title}>
                    Welcome to FixAcareer!
                  </Title>
                  <TextInput
                    label="First Name"
                    placeholder="First Name"
                    required
                    {...registerForm.getInputProps("firstName")}
                    value={registerForm.values.firstName}
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Last Name"
                    required
                    {...registerForm.getInputProps("lastName")}
                    value={registerForm.values.lastName}
                  />
                  <TextInput
                    label="Email"
                    placeholder="Email"
                    required
                    {...registerForm.getInputProps("email")}
                    value={registerForm.values.email}
                  />
                  <PasswordInput
                    label="Password"
                    placeholder="Password"
                    required
                    {...registerForm.getInputProps("password")}
                    value={registerForm.values.password}
                  />
                  <PasswordInput
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    required
                    {...registerForm.getInputProps("confirmPassword")}
                    value={registerForm.values.confirmPassword}
                  />
                  <Button
                    fullWidth
                    mt={20}
                    mb={10}
                    onClick={() => setRegisterStep(2)}
                  >
                    Next
                  </Button>
                  <Text align="center" mt={10}>
                    Already have an account?{" "}
                    <Anchor<"a">
                      onClick={(event) => {
                        event.preventDefault();
                        setIsRegistering(false);
                        setRegisterStep(1);
                      }}
                      href="#"
                      size="sm"
                    >
                      Sign In
                    </Anchor>
                  </Text>
                </Paper>
              )}
              {isRegstering && registerStep === 2 && (
                <Paper className={classes.form} p={20}>
                  <Title pt={"lg"} align="center" className={classes.title}>
                    Great! Now let's get to know you better!
                  </Title>
                  <Select
                    label="Education Level"
                    placeholder="Education Level"
                    required
                    data={educationLevels}
                    {...registerForm.getInputProps("educationLevel")}
                    error={registerForm.errors.educationLevel}
                    value={registerForm.values.educationLevel}
                  />
                  <Switch
                    labelPosition="left"
                    label="Are you currently employed?"
                    color="indigo"
                    {...registerForm.getInputProps("isEmployed")}
                    checked={registerForm.values.isEmployed}
                    mt={10}
                  />
                  {registerForm.values.isEmployed && (
                    <TextInput
                      label="Current Job Title"
                      placeholder="Current Job Title"
                      required
                      {...registerForm.getInputProps("currentJobTitle")}
                      value={registerForm.values.currentJobTitle}
                    />
                  )}
                  <Switch
                    labelPosition="left"
                    label="Are you still studying?"
                    color="indigo"
                    {...registerForm.getInputProps("stillStudying")}
                    checked={registerForm.values.stillStudying}
                    mt={10}
                  />
                  {registerForm.values.stillStudying && (
                    <>
                      <Select
                        label="Level of study"
                        placeholder="Level of study"
                        required
                        data={educationLevels}
                        {...registerForm.getInputProps("studyLevel")}
                        error={registerForm.errors.studyLevel}
                        value={registerForm.values.studyLevel}
                      />
                      <TextInput
                        label="Field of study"
                        placeholder="Field of study"
                        required
                        {...registerForm.getInputProps("fieldOfStudy")}
                        value={registerForm.values.fieldOfStudy}
                      />
                    </>
                  )}
                  <Button
                    fullWidth
                    mt={20}
                    mb={10}
                    onClick={() => {
                      registerUser(registerForm.values);
                    }}
                  >
                    Register Now
                  </Button>
                  <Button
                    fullWidth
                    mt={20}
                    mb={10}
                    onClick={() => setRegisterStep(1)}
                    color="gray"
                  >
                    Back
                  </Button>
                </Paper>
              )}
            </Grid.Col>
          </Grid>
        </Paper>
      </Center>
    </>
  );
};

export default UserLogin;
